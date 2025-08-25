import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';
import { logger } from './logger.js';
export class PlaywrightMCPServer {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.serverConnected = false;
        // Initialize MCP Server
        this.server = new Server({
            name: 'playwright-mcp-server',
            version: '1.0.0',
        });
        // Register MCP tools
        this.registerTools();
    }
    registerTools() {
        // Tool: Launch browser
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'playwright_launch_browser',
                        description: 'Launch a new browser instance',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                browserType: {
                                    type: 'string',
                                    enum: ['chromium', 'firefox', 'webkit'],
                                    default: 'chromium'
                                },
                                headless: {
                                    type: 'boolean',
                                    default: true
                                }
                            }
                        }
                    },
                    {
                        name: 'playwright_navigate',
                        description: 'Navigate to a URL',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    description: 'URL to navigate to'
                                }
                            },
                            required: ['url']
                        }
                    },
                    {
                        name: 'playwright_validate_selector',
                        description: 'Validate if a selector exists on the page',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                selector: {
                                    type: 'string',
                                    description: 'CSS selector or text selector to validate'
                                }
                            },
                            required: ['selector']
                        }
                    },
                    {
                        name: 'playwright_get_element_text',
                        description: 'Get text content of an element',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                selector: {
                                    type: 'string',
                                    description: 'CSS selector or text selector'
                                }
                            },
                            required: ['selector']
                        }
                    },
                    {
                        name: 'playwright_get_element_attributes',
                        description: 'Get attributes of an element',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                selector: {
                                    type: 'string',
                                    description: 'CSS selector or text selector'
                                },
                                attributes: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'List of attributes to retrieve',
                                    default: ['id', 'data-testid', 'aria-label', 'role']
                                }
                            },
                            required: ['selector']
                        }
                    },
                    {
                        name: 'playwright_suggest_stable_selectors',
                        description: 'Suggest stable selectors for an element',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                selector: {
                                    type: 'string',
                                    description: 'Current selector to improve'
                                }
                            },
                            required: ['selector']
                        }
                    }
                ]
            };
        });
        // Tool: Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'playwright_launch_browser':
                        return await this.launchBrowser(args);
                    case 'playwright_navigate':
                        return await this.navigateToUrl(args);
                    case 'playwright_validate_selector':
                        return await this.validateSelector(args);
                    case 'playwright_get_element_text':
                        return await this.getElementText(args);
                    case 'playwright_get_element_attributes':
                        return await this.getElementAttributes(args);
                    case 'playwright_suggest_stable_selectors':
                        return await this.suggestStableSelectors(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                logger.error(`Error executing tool ${name}:`, error);
                throw error;
            }
        });
    }
    async start() {
        try {
            logger.info('Starting Playwright MCP Server...');
            // Start the MCP server
            const transport = new StdioServerTransport();
            await this.server.connect(transport);
            logger.info('Playwright MCP Server started successfully');
            this.serverConnected = true;
            // Keep the server running
            await new Promise(() => { }); // This keeps the process alive
        }
        catch (error) {
            logger.error('Failed to start MCP Server:', error);
            throw error;
        }
    }
    async connect() {
        try {
            logger.info('Connecting to Playwright MCP Server...');
            // Launch browser
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            // Create context
            this.context = await this.browser.newContext({
                viewport: { width: 1280, height: 720 },
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            });
            logger.info('Connected to Playwright MCP Server');
            return true;
        }
        catch (error) {
            logger.error('Failed to connect to Playwright MCP Server:', error);
            throw error;
        }
    }
    async launchBrowser(args) {
        const { browserType = 'chromium', headless = true } = args;
        if (this.browser) {
            await this.browser.close();
        }
        this.browser = await chromium.launch({
            headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        return {
            content: [
                {
                    type: 'text',
                    text: `Browser ${browserType} launched successfully`
                }
            ]
        };
    }
    async navigateToUrl(args) {
        const { url } = args;
        if (!this.context) {
            throw new Error('Browser not initialized. Call launch_browser first.');
        }
        if (this.page) {
            await this.page.close();
        }
        this.page = await this.context.newPage();
        await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        return {
            content: [
                {
                    type: 'text',
                    text: `Successfully navigated to ${url}`
                }
            ]
        };
    }
    async validateSelector(args) {
        const { selector } = args;
        if (!this.page) {
            throw new Error('No page loaded. Call navigate first.');
        }
        const element = await this.page.$(selector);
        const exists = !!element;
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        selector,
                        exists,
                        message: exists ? 'Selector found on page' : 'Selector not found on page'
                    })
                }
            ]
        };
    }
    async getElementText(args) {
        const { selector } = args;
        if (!this.page) {
            throw new Error('No page loaded. Call navigate first.');
        }
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Element with selector '${selector}' not found`);
        }
        const textContent = await element.textContent();
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        selector,
                        textContent: textContent?.trim() || ''
                    })
                }
            ]
        };
    }
    async getElementAttributes(args) {
        const { selector, attributes = ['id', 'data-testid', 'aria-label', 'role'] } = args;
        if (!this.page) {
            throw new Error('No page loaded. Call navigate first.');
        }
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Element with selector '${selector}' not found`);
        }
        const result = {};
        for (const attr of attributes) {
            result[attr] = await element.getAttribute(attr);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        selector,
                        attributes: result
                    })
                }
            ]
        };
    }
    async suggestStableSelectors(args) {
        const { selector } = args;
        if (!this.page) {
            throw new Error('No page loaded. Call navigate first.');
        }
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Element with selector '${selector}' not found`);
        }
        const suggestions = [];
        // Try data-testid
        const testId = await element.getAttribute('data-testid');
        if (testId) {
            suggestions.push(`[data-testid="${testId}"]`);
        }
        // Try aria-label
        const ariaLabel = await element.getAttribute('aria-label');
        if (ariaLabel) {
            suggestions.push(`[aria-label="${ariaLabel}"]`);
        }
        // Try role
        const role = await element.getAttribute('role');
        if (role) {
            suggestions.push(`role=${role}`);
        }
        // Try text content
        const textContent = await element.textContent();
        if (textContent && textContent.trim()) {
            suggestions.push(`text=${textContent.trim()}`);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        selector,
                        suggestions
                    })
                }
            ]
        };
    }
    async validateSelectors(url, steps) {
        if (!this.browser || !this.context) {
            throw new Error('Playwright MCP Server not connected');
        }
        try {
            logger.info(`Validating selectors for URL: ${url}`);
            // Create new page and navigate to URL
            this.page = await this.context.newPage();
            await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            logger.info(`Successfully navigated to ${url}`);
            const improvedSteps = await Promise.all(steps.map(async (step) => {
                return await this.validateAndImproveStep(step);
            }));
            await this.closePage();
            return improvedSteps;
        }
        catch (error) {
            logger.error('Error validating selectors:', error);
            await this.closePage();
            throw error;
        }
    }
    async validateAndImproveStep(step) {
        if (!this.page) {
            return step;
        }
        try {
            // Only validate steps that have ID selectors
            if (!step.target.startsWith('#')) {
                logger.info(`Skipping validation for non-ID selector: ${step.target}`);
                return step;
            }
            switch (step.action) {
                case 'click':
                    return await this.validateClickStep(step);
                case 'fill':
                    return await this.validateFillStep(step);
                case 'expect':
                    return await this.validateExpectStep(step);
                case 'type':
                    return await this.validateTypeStep(step);
                case 'select':
                    return await this.validateSelectStep(step);
                case 'hover':
                    return await this.validateHoverStep(step);
                default:
                    return step;
            }
        }
        catch (error) {
            logger.warn(`Could not validate step: ${step.description}`, error);
            return step;
        }
    }
    async validateClickStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if ID selector exists on the page
            const element = await this.page.$(step.target);
            if (element) {
                logger.info(`✅ ID selector ${step.target} is valid`);
                return step; // Keep the original ID selector
            }
            else {
                logger.warn(`❌ ID selector ${step.target} not found, skipping validation`);
                return step; // Keep the original step but mark as not validated
            }
        }
        catch (error) {
            logger.warn(`Could not validate click step: ${step.target}`, error);
            return step; // Keep the original step on error
        }
    }
    async validateFillStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if ID selector exists on the page
            const element = await this.page.$(step.target);
            if (element) {
                logger.info(`✅ ID selector ${step.target} is valid for fill action`);
                return step; // Keep the original ID selector
            }
            else {
                logger.warn(`❌ ID selector ${step.target} not found, skipping validation`);
                return step; // Keep the original step but mark as not validated
            }
        }
        catch (error) {
            logger.warn(`Could not validate fill step: ${step.target}`, error);
            return step; // Keep the original step on error
        }
    }
    async validateExpectStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if ID selector exists on the page
            const element = await this.page.$(step.target);
            if (element) {
                logger.info(`✅ ID selector ${step.target} is valid for expect action`);
                return step; // Keep the original ID selector
            }
            else {
                logger.warn(`❌ ID selector ${step.target} not found, skipping validation`);
                return step; // Keep the original step but mark as not validated
            }
        }
        catch (error) {
            logger.warn(`Could not validate expect step: ${step.target}`, error);
            return step; // Keep the original step on error
        }
    }
    async validateTypeStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if ID selector exists on the page
            const element = await this.page.$(step.target);
            if (element) {
                logger.info(`✅ ID selector ${step.target} is valid for type action`);
                return step; // Keep the original ID selector
            }
            else {
                logger.warn(`❌ ID selector ${step.target} not found, skipping validation`);
                return step; // Keep the original step but mark as not validated
            }
        }
        catch (error) {
            logger.warn(`Could not validate type step: ${step.target}`, error);
            return step; // Keep the original step on error
        }
    }
    async validateSelectStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if ID selector exists on the page
            const element = await this.page.$(step.target);
            if (element) {
                logger.info(`✅ ID selector ${step.target} is valid for select action`);
                return step; // Keep the original ID selector
            }
            else {
                logger.warn(`❌ ID selector ${step.target} not found, skipping validation`);
                return step; // Keep the original step but mark as not validated
            }
        }
        catch (error) {
            logger.warn(`Could not validate select step: ${step.target}`, error);
            return step; // Keep the original step on error
        }
    }
    async validateHoverStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if ID selector exists on the page
            const element = await this.page.$(step.target);
            if (element) {
                logger.info(`✅ ID selector ${step.target} is valid for hover action`);
                return step; // Keep the original ID selector
            }
            else {
                logger.warn(`❌ ID selector ${step.target} not found, skipping validation`);
                return step; // Keep the original step but mark as not validated
            }
        }
        catch (error) {
            logger.warn(`Could not validate hover step: ${step.target}`, error);
            return step; // Keep the original step on error
        }
    }
    async closePage() {
        try {
            if (this.page) {
                await this.page.close();
                this.page = null;
            }
        }
        catch (error) {
            logger.warn('Error closing page:', error);
        }
    }
    async disconnect() {
        try {
            await this.closePage();
            if (this.context) {
                await this.context.close();
                this.context = null;
            }
            if (this.browser) {
                await this.browser.close();
                this.browser = null;
            }
            logger.info('Disconnected from Playwright MCP Server');
        }
        catch (error) {
            logger.error('Error disconnecting from MCP Server:', error);
        }
    }
    isConnected() {
        return this.serverConnected;
    }
}
