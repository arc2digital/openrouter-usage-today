import * as vscode from "vscode";
import fetch from "node-fetch";

interface ApiKey {
  hash: string;
  name: string;
  label: string;
}

interface KeyDetail {
  hash: string;
  name: string;
  usage_daily: number;
  usage_weekly: number;
  usage_monthly: number;
  usage: number;
  [key: string]: any;
}

interface ModelUsage {
  model: string;
  usage: number;
}

interface AnalyticsResult {
  rows: Array<{[key: string]: any}>;
}

export class OpenRouterAnalyticsService {
  private static readonly BASE_URL = "https://openrouter.ai/api/v1";

  private static getManagementKey(): string {
    return vscode.workspace.getConfiguration("openrouterUsageToday").get("managementKey", "");
  }

  static async getApiKeys(): Promise<ApiKey[]> {
    const managementKey = this.getManagementKey();
    if (!managementKey) {
      return [];
    }

    try {
      const response = await fetch(this.BASE_URL + "/keys", {
        headers: {
          "Authorization": "Bearer " + managementKey,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return (data.data || []).map((k: any) => ({
        hash: k.hash,
        name: k.name,
        label: k.label
      }));
    } catch (error) {
      return [];
    }
  }

  static async getKeyDetail(keyHash: string): Promise<KeyDetail | null> {
    const managementKey = this.getManagementKey();
    if (!managementKey) {
      return null;
    }

    try {
      const response = await fetch(this.BASE_URL + "/keys/" + keyHash, {
        headers: {
          "Authorization": "Bearer " + managementKey,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return null;
    }
  }

  static async getModelUsage(keyHash: string): Promise<ModelUsage[] | null> {
    const managementKey = this.getManagementKey();
    if (!managementKey) {
      return null;
    }

    try {
      const now = new Date();
      const startOfTodayUtc = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      ));
      const response = await fetch(`${this.BASE_URL}/analytics/query`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + managementKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          metrics: ["total_usage"],
          dimensions: ["model"],
          time_range: {
            start: startOfTodayUtc.toISOString(),
            end: now.toISOString()
          },
          filters: [{ field: "api_key_id", operator: "eq", value: keyHash }],
          order_by: { field: "total_usage", direction: "desc" },
          limit: 100
        })
      });

      if (!response.ok) {
        return null;
      }

      const responseData = await response.json();
      const rows = responseData.data?.data;
      if (!Array.isArray(rows)) {
        return null;
      }

      return rows
        .filter((row: any) => typeof row.model === "string")
        .map((row: any) => ({
          model: row.model,
          usage: Number(row.total_usage) || 0
        }))
        .sort((a: ModelUsage, b: ModelUsage) => b.usage - a.usage);
    } catch (error) {
      return null;
    }
  }
}
