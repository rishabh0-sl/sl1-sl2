export interface GeminiConfig {
    apiKey: string;
    model: string;
    baseUrl: string;
}
export interface GeminiRequest {
    contents: Array<{
        parts: Array<{
            text: string;
        }>;
    }>;
    generationConfig?: {
        temperature: number;
        topK: number;
        topP: number;
        maxOutputTokens: number;
    };
}
export interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}
export declare class GeminiService {
    private config;
    constructor(config: GeminiConfig);
    generateTestScenarios(objective: string, url: string, credentials?: {
        username: string;
        password?: string;
    }): Promise<string>;
    private buildPrompt;
    parseGeminiResponse(response: string): Promise<any>;
}
