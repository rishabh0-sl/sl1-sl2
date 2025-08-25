export const config = {
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || 'api_key',
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com'
    },
    mcp: {
        enabled: process.env.MCP_ENABLED !== 'false',
        externalServer: true // We're using Cursor's built-in MCP server
    }
};
