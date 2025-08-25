export interface PRDIntake {
    objective: string;
    url: string;
    credentials?: {
        username: string;
        password?: string;
        secretRef?: string;
    };
    runId?: string;
}
export interface TestStep {
    action: 'goto' | 'fill' | 'click' | 'expect' | 'wait' | 'type' | 'select' | 'hover';
    target: string;
    data?: string;
    description: string;
}
export interface TestScenario {
    id: string;
    name: string;
    steps: TestStep[];
    timeTakenToCompile?: string;
    tags?: string[];
}
export interface LLMRunOutput {
    runId: string;
    outputs: Array<{
        scenario: TestScenario;
    }>;
    metadata?: {
        generatedAt: string;
        model: string;
        totalTime?: string;
        source?: string;
        mcpValidationSuccessful?: boolean;
        stage?: string;
    };
}
export interface GenerationResult {
    geminiOutput: LLMRunOutput;
    mcpOutput: LLMRunOutput;
    mainOutput: LLMRunOutput;
    mcpValidationSuccessful: boolean;
}
export declare class LLMCompiler {
    private geminiService;
    private mcpClient;
    private ajv;
    constructor();
    generateScenarios(input: PRDIntake): Promise<GenerationResult>;
    private validateSelectorsWithMCP;
    private executeScenarioWithMCP;
    private executeStepWithMCP;
    private generateGeminiScenarios;
}
export { GeminiService } from './gemini-service';
export { config } from './config';
export { logger } from './logger';
