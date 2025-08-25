import { Tool } from '@modelcontextprotocol/sdk/types.js';
export interface SelectorValidationResult {
    isValid: boolean;
    improvedSelector?: string;
    error?: string;
    elementInfo?: {
        tagName: string;
        textContent?: string;
        attributes: Record<string, string>;
    };
}
export declare class PlaywrightValidateSelectorTool implements Tool {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            selector: {
                type: "string";
                description: string;
            };
            context: {
                type: "string";
                description: string;
                enum: string[];
            };
            page: {
                type: "object";
                description: string;
            };
        };
        required: string[];
    };
    execute(args: {
        selector: string;
        context?: string;
        page?: any;
    }): Promise<SelectorValidationResult>;
    private suggestAlternativeSelectors;
    private suggestBetterSelector;
    private getElementInfo;
}
export declare const playwrightValidateSelectorTool: PlaywrightValidateSelectorTool;
