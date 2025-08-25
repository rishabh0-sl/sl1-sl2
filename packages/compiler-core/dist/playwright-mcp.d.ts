import { TestStep } from './index';
export declare class PlaywrightBrowserAutomation {
    private browser;
    private context;
    private page;
    connect(): Promise<boolean>;
    validateSelectors(url: string, steps: TestStep[]): Promise<TestStep[]>;
    private validateAndImproveStep;
    private validateClickStep;
    private validateFillStep;
    private validateExpectStep;
    suggestStableSelectors(selector: string): Promise<string[]>;
    private closePage;
    disconnect(): Promise<void>;
}
