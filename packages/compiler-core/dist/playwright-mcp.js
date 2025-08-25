import { chromium } from 'playwright';
import { logger } from './logger';
export class PlaywrightBrowserAutomation {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }
    async connect() {
        try {
            logger.info('Initializing Playwright browser...');
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
            logger.info('Playwright browser initialized successfully');
            return true;
        }
        catch (error) {
            logger.error('Failed to initialize Playwright browser:', error);
            throw error;
        }
    }
    async validateSelectors(url, steps) {
        if (!this.browser || !this.context) {
            throw new Error('Playwright browser not initialized');
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
            switch (step.action) {
                case 'click':
                    return await this.validateClickStep(step);
                case 'fill':
                    return await this.validateFillStep(step);
                case 'expect':
                    return await this.validateExpectStep(step);
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
            // Check if selector exists
            const element = await this.page.$(step.target);
            if (element) {
                // Get element text for better selector
                const textContent = await element.textContent();
                if (textContent && textContent.trim()) {
                    const cleanText = textContent.trim();
                    return {
                        ...step,
                        target: `text=${cleanText}`,
                        description: `click on ${cleanText}`
                    };
                }
            }
            // Try to find alternative selectors
            const alternatives = await this.suggestStableSelectors(step.target);
            if (alternatives.length > 0) {
                return {
                    ...step,
                    target: alternatives[0],
                    description: `${step.description} (using stable selector)`
                };
            }
            return step;
        }
        catch (error) {
            logger.warn(`Could not validate click step: ${step.target}`, error);
            return step;
        }
    }
    async validateFillStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if input field exists
            const element = await this.page.$(step.target);
            if (element) {
                // Get input attributes for better selector
                const id = await element.getAttribute('id');
                const dataTestId = await element.getAttribute('data-testid');
                const ariaLabel = await element.getAttribute('aria-label');
                if (dataTestId) {
                    return {
                        ...step,
                        target: `[data-testid="${dataTestId}"]`,
                        description: step.description
                    };
                }
                else if (id) {
                    return {
                        ...step,
                        target: `#${id}`,
                        description: step.description
                    };
                }
                else if (ariaLabel) {
                    return {
                        ...step,
                        target: `[aria-label="${ariaLabel}"]`,
                        description: step.description
                    };
                }
            }
            return step;
        }
        catch (error) {
            logger.warn(`Could not validate fill step: ${step.target}`, error);
            return step;
        }
    }
    async validateExpectStep(step) {
        if (!this.page)
            return step;
        try {
            // Check if element exists
            const element = await this.page.$(step.target);
            if (element) {
                // Try to find more specific selector
                const alternatives = await this.suggestStableSelectors(step.target);
                if (alternatives.length > 0) {
                    return {
                        ...step,
                        target: alternatives[0],
                        description: step.description
                    };
                }
            }
            return step;
        }
        catch (error) {
            logger.warn(`Could not validate expect step: ${step.target}`, error);
            return step;
        }
    }
    async suggestStableSelectors(selector) {
        if (!this.page)
            return [];
        try {
            const suggestions = [];
            // Try to find the element
            const element = await this.page.$(selector);
            if (!element)
                return [];
            // Try data-testid
            try {
                const testId = await element.getAttribute('data-testid');
                if (testId) {
                    suggestions.push(`[data-testid="${testId}"]`);
                }
            }
            catch (e) {
                // Ignore errors for this attribute
            }
            // Try aria-label
            try {
                const ariaLabel = await element.getAttribute('aria-label');
                if (ariaLabel) {
                    suggestions.push(`[aria-label="${ariaLabel}"]`);
                }
            }
            catch (e) {
                // Ignore errors for this attribute
            }
            // Try role
            try {
                const role = await element.getAttribute('role');
                if (role) {
                    suggestions.push(`role=${role}`);
                }
            }
            catch (e) {
                // Ignore errors for this attribute
            }
            // Try text content
            try {
                const textContent = await element.textContent();
                if (textContent && textContent.trim()) {
                    suggestions.push(`text=${textContent.trim()}`);
                }
            }
            catch (e) {
                // Ignore errors for this attribute
            }
            return suggestions;
        }
        catch (error) {
            logger.warn('Could not suggest stable selectors:', error);
            return [];
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
            logger.info('Playwright browser disconnected successfully');
        }
        catch (error) {
            logger.error('Error disconnecting Playwright browser:', error);
        }
    }
}
