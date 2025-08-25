export declare class PlaywrightMCPServer {
    private server;
    private transport;
    constructor();
    private handleValidateSelector;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare const playwrightMCPServer: PlaywrightMCPServer;
