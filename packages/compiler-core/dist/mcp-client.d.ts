export interface MCPExecutionResult {
    success: boolean;
    improvedSelector?: string;
    error?: string;
    executionTime?: number;
}
export declare class MCPClient {
    private client;
    private isConnected;
    private transport;
    constructor();
    connect(): Promise<boolean>;
    executeStep(action: string, target: string, data?: string): Promise<MCPExecutionResult>;
    validateSelector(selector: string): Promise<MCPExecutionResult>;
    private navigate;
    private click;
    private fill;
    private expect;
    private wait;
    private type;
    disconnect(): void;
    isConnectedToServer(): boolean;
}
