export interface MCPServerConfig {
    server: {
        name: string;
        version: string;
    };
    playwright: {
        browser: 'chromium' | 'firefox' | 'webkit';
        headless: boolean;
        timeout: number;
    };
}
export declare const defaultMCPConfig: MCPServerConfig;
