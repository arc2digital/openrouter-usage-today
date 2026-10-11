import * as vscode from "vscode";
import { OpenRouterAnalyticsService } from "./analyticsService";

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.show();

  async function updateStatus() {
    try {
      const config = vscode.workspace.getConfiguration("openrouterUsageToday");
      const managementKey = config.get("managementKey", "");
      const selectedKeyHash = config.get("selectedKeyHash", "");

      if (!managementKey) {
        statusBarItem.text = "$(symbol-event) Setup required";
        statusBarItem.tooltip = "Configure your OpenRouter Management key in settings";
        statusBarItem.command = "openrouterUsageToday.openSettings";
        statusBarItem.show();
        return;
      }

      const keys = await OpenRouterAnalyticsService.getApiKeys();
      if (keys.length === 0) {
        statusBarItem.text = "$(symbol-event) No keys found";
        statusBarItem.tooltip = "Check your Management key and try again";
        statusBarItem.command = "openrouterUsageToday.openSettings";
        statusBarItem.show();
        return;
      }

      const selectedKey = keys.find((k) => k.hash === selectedKeyHash) || keys[0];
      const detail = await OpenRouterAnalyticsService.getKeyDetail(selectedKey.hash);

      if (!detail) {
        statusBarItem.text = `$(symbol-event) ${selectedKey.name} (loading...)`;
        statusBarItem.tooltip = "Fetching usage data...";
        statusBarItem.command = "openrouterUsageToday.selectKey";
        statusBarItem.show();
        return;
      }

      const todayUsage = detail.usage_daily > 0 ? detail.usage_daily : detail.usage;
      statusBarItem.text = `$(symbol-event) ${selectedKey.name}: $${todayUsage.toFixed(2)}`;
      
      const modelUsage = await OpenRouterAnalyticsService.getModelUsage(selectedKey.hash);
      const md = new vscode.MarkdownString();
      md.supportHtml = true;
      md.appendMarkdown("**Usage Summary**\n\n");
      md.appendMarkdown("<table><tr><td valign=\"top\"><strong>By Period</strong><br><table>");

      const periodRows = [
        ["All time", detail.usage],
        ["This month", detail.usage_monthly],
        ["This week", detail.usage_weekly],
        ["Today", detail.usage_daily],
      ] as const;
      for (const [period, amount] of periodRows) {
        md.appendMarkdown(`<tr><td>${period}</td><td align=\"right\">$${amount.toFixed(4)}</td></tr>`);
      }

      md.appendMarkdown("</table></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td valign=\"top\"><strong>By Model · Today (UTC)</strong><br><table>");
      const modelRows = modelUsage?.slice(0, 4) ?? [];
      if (!modelUsage) {
        md.appendMarkdown("<tr><td colspan=\"2\">Model spend unavailable</td></tr>");
      } else if (modelRows.length === 0) {
        md.appendMarkdown("<tr><td colspan=\"2\">No model activity today</td></tr>");
      } else {
        for (const model of modelRows) {
          const modelName = model.model.replace(/[&<>\"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '\"': "&quot;",
            "'": "&#39;",
          })[character] as string).slice(0, 36);
          md.appendMarkdown(`<tr><td>${modelName}</td><td align=\"right\">$${model.usage.toFixed(4)}</td></tr>`);
        }
      }
      md.appendMarkdown("</table></td></tr></table>\n\n_Per-model spend is for today (UTC)._  \n_Click to change key_");

      statusBarItem.tooltip = md;
      statusBarItem.command = "openrouterUsageToday.selectKey";
      statusBarItem.show();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const selectKeyCommand = vscode.commands.registerCommand(
    "openrouterUsageToday.selectKey",
    async () => {
      const config = vscode.workspace.getConfiguration("openrouterUsageToday");
      const keys = await OpenRouterAnalyticsService.getApiKeys();
      if (keys.length === 0) {
        vscode.window.showWarningMessage("No API keys found");
        return;
      }

      const selectedKeyHash = config.get("selectedKeyHash", "");

      const items = keys.map((k) => ({
        label: k.name,
        description: k.label,
        hash: k.hash,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select a key to track",
        ignoreFocusOut: true,
      });

      if (selected) {
        await config.update("selectedKeyHash", selected.hash, vscode.ConfigurationTarget.Global);
        console.log("Selected key set to:", selected.hash, "Name:", selected.label);
      }
    }
  );

  const openSettingsCommand = vscode.commands.registerCommand(
    "openrouterUsageToday.openSettings",
    () => vscode.commands.executeCommand("workbench.action.openSettings", "openrouterUsageToday")
  );

  const config = vscode.workspace.getConfiguration("openrouterUsageToday");
  const pollThreshold = config.get<string>("pollThreshold") || "10s";
  const pollInterval = parsePollInterval(pollThreshold);
  let pollTimer: NodeJS.Timeout | undefined;

  const settingsChangedDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
    console.log("Config changed:", e.affectsConfiguration("openrouterUsageToday"));
    if (e.affectsConfiguration("openrouterUsageToday")) {
      updateStatus();
      if (e.affectsConfiguration("openrouterUsageToday.pollThreshold")) {
        if (pollTimer) {
          clearInterval(pollTimer);
        }
        const newConfig = vscode.workspace.getConfiguration("openrouterUsageToday");
        const newThreshold: string = newConfig.get("pollThreshold") || "10s";
        pollTimer = setInterval(updateStatus, parsePollInterval(newThreshold));
      }
    }
  });

  updateStatus();
  pollTimer = setInterval(updateStatus, pollInterval);

  context.subscriptions.push(statusBarItem, selectKeyCommand, openSettingsCommand, settingsChangedDisposable);
}

function parsePollInterval(threshold: string): number {
  const match = threshold.match(/^(\d+)(s|m|h)$/);
  if (!match) return 10000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60000;
    case "h":
      return value * 3600000;
    default:
      return 10000;
  }
}

export function deactivate() {
  console.log("OpenRouter Usage Today extension is now deactivated!");
}
