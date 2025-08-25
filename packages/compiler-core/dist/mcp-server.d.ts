export declare class PlaywrightMCPServer {
    private server;
    private browser;
    private context;
    private page;
    private serverConnected;
    constructor();
    private registerTools;
    start(): Promise<void>;
    connect(): Promise<boolean>;
    private launchBrowser;
    private navigateToUrl;
    private validateSelector;
    private getElementText;
    private getElementAttributes;
    private suggestStableSelectors;
    validateSelectors(url: string, steps: any[]): Promise<any[]>;
    private validateAndImproveStep;
    private validateClickStep;
    private validateFillStep;
    private validateExpectStep;
    private validateTypeStep;
    private validateSelectStep;
    private validateHoverStep;
    private closePage;
    disconnect(): Promise<void>;
    isConnected(): boolean;
}
