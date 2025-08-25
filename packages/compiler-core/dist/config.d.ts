export interface AppConfig {
    gemini: {
        apiKey: string;
        model: string;
        baseUrl: string;
    };
    mcp: {
        enabled: boolean;
        externalServer: boolean;
    };
}
export declare const config: AppConfig;
