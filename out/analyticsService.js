"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterAnalyticsService = void 0;
const vscode = __importStar(require("vscode"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class OpenRouterAnalyticsService {
    static getManagementKey() {
        return vscode.workspace.getConfiguration("openrouterUsageToday").get("managementKey", "");
    }
    static async getApiKeys() {
        const managementKey = this.getManagementKey();
        if (!managementKey) {
            return [];
        }
        try {
            const response = await (0, node_fetch_1.default)(this.BASE_URL + "/keys", {
                headers: {
                    "Authorization": "Bearer " + managementKey,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            return (data.data || []).map((k) => ({
                hash: k.hash,
                name: k.name,
                label: k.label
            }));
        }
        catch (error) {
            return [];
        }
    }
    static async getKeyDetail(keyHash) {
        const managementKey = this.getManagementKey();
        if (!managementKey) {
            return null;
        }
        try {
            const response = await (0, node_fetch_1.default)(this.BASE_URL + "/keys/" + keyHash, {
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
        }
        catch (error) {
            return null;
        }
    }
    static async getModelUsage(keyHash) {
        const managementKey = this.getManagementKey();
        if (!managementKey) {
            return null;
        }
        try {
            const now = new Date();
            const startOfTodayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const response = await (0, node_fetch_1.default)(`${this.BASE_URL}/analytics/query`, {
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
                .filter((row) => typeof row.model === "string")
                .map((row) => ({
                model: row.model,
                usage: Number(row.total_usage) || 0
            }))
                .sort((a, b) => b.usage - a.usage);
        }
        catch (error) {
            return null;
        }
    }
}
exports.OpenRouterAnalyticsService = OpenRouterAnalyticsService;
OpenRouterAnalyticsService.BASE_URL = "https://openrouter.ai/api/v1";
