# 🚀 PTOSMCPLLM + SL2 Combined Project

A **unified, full-featured web application** that seamlessly combines **Prompt to Test Scenarios with LLM** and **Playwright Compiler** into a single, professional workflow. This project eliminates the need for separate scripts and provides a modern, full-width web interface for end-to-end test automation.

## 🏗️ **Project Architecture**

```
combined-project/
├── 📁 packages/
│   ├── contracts/          # Shared JSON Schemas & Type Definitions
│   ├── compiler-core/      # Core LLM compiler & MCP integration logic
│   └── ir/                 # Intermediate Representation types
├── 📁 apps/
│   ├── console-ui/         # Modern React frontend with full-width UI
│   └── combined-api/       # Unified API server (Gemini + Playwright)
├── 📁 results/             # Auto-saved JSON files for manual verification
├── config.env              # Environment configuration
├── package.json            # Workspace root configuration
├── pnpm-workspace.yaml     # PNPM workspace configuration
└── tsconfig.json           # Root TypeScript configuration
```

## ✨ **Key Features**

### 🔄 **Complete End-to-End Workflow**
- **Step 1**: Generate test scenarios from natural language using Gemini AI
- **Step 2**: Automatically compile scenarios into executable Playwright TypeScript tests
- **Step 3**: Download and use the generated tests immediately
- **Single UI**: One professional interface handles the entire workflow

### 🎯 **Advanced Prompt-to-Scenario Generation**
- **Natural Language Input**: Describe test objectives in plain English
- **Gemini AI Integration**: Latest AI models (currently configured for Gemini 1.5 Flash)
- **Smart Scenario Creation**: Generates realistic, structured test scenarios
- **Restricted Actions**: Only 4 core actions allowed for consistency: `goto`, `fill`, `click`, `expect`
- **No Fallback Mechanism**: Pure AI-generated content only - no hardcoded scenarios
- **Automatic Validation**: JSON schema validation and action validation
- **Result Persistence**: All generated scenarios automatically saved to `results/` folder

### ⚡ **Professional Playwright Compilation**
- **TypeScript Output**: Generates valid, runnable Playwright tests
- **Smart Selector Strategy**: Role-first approach for accessibility
- **Page Object Support**: Optional page object generation
- **Download Ready**: Direct download of `.ts` test files
- **Result Persistence**: All compilation results saved for verification

### 💾 **Automatic Results Management**
- **Auto-Save**: Every generation and compilation automatically saved
- **Timestamped Files**: Easy identification and version tracking
- **Manual Verification**: Access to all JSON files for inspection
- **Results API**: `GET /api/v1/results` to list all saved files

### 🎨 **Professional Web Interface**
- **Full-Width Design**: Utilizes entire screen width like a real website
- **Tabbed Navigation**: Clean separation between generation and compilation
- **Auto-Population**: Generated scenarios automatically populate compilation form
- **Responsive Design**: Works perfectly on all device sizes
- **Modern UI**: Professional appearance with proper spacing and typography

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PNPM (recommended) or npm
- Gemini API key

### **Installation**

```bash
# Navigate to the combined project
cd combined-project

# Install all dependencies
pnpm install

# Set up environment variables
cp config.env.example config.env
# Edit config.env with your Gemini API key

# Build all packages
pnpm build
```

### **Running the Application**

```bash
# Start both API and UI simultaneously
pnpm dev

# The application will be available at:
# 🌐 Frontend UI: http://localhost:3000
# 🔌 Backend API: http://localhost:3002
# 📁 Results API: http://localhost:3002/api/v1/results
```

## 📖 **Usage Guide**

### **1. Generate Test Scenarios**

1. **Open the "Generate Scenarios" tab**
2. **Enter your test objective** (e.g., "Test user login and search functionality")
3. **Provide the target URL** (e.g., "https://example.com")
4. **Add optional credentials** (username/password if needed)
5. **Click "Generate Scenarios"**

**What happens:**
- ✅ Your prompt is sent to Gemini AI (1.5 Flash model)
- ✅ AI generates realistic test scenarios with only 4 allowed actions
- ✅ Actions are validated to ensure only `goto`, `fill`, `click`, `expect` are used
- ✅ Results are automatically saved to `results/` folder
- ✅ UI automatically switches to compilation tab
- ✅ Generated scenarios are pre-populated

### **2. Compile to Playwright Tests**

1. **The "Compile to Playwright" tab is automatically populated**
2. **Select a scenario** from the dropdown (auto-populated from generation)
3. **Configure options** (filename, suite ID)
4. **Click "Compile to Playwright"**

**What happens:**
- ✅ Selected scenario is compiled to TypeScript
- ✅ Playwright test code is generated
- ✅ Results are automatically saved to `results/` folder
- ✅ Downloadable `.ts` file is provided

## 🔌 **API Endpoints**

### **Generate Test Scenarios**
```bash
POST /api/v1/generate
Content-Type: application/json

{
  "objective": "Test user login and search functionality",
  "url": "https://example.com",
  "credentials": {
    "username": "testuser",
    "password": "testpass"
  },
  "runId": "run_123"
}
```

**Response Structure:**
```json
{
  "runId": "run_1756119768425_mcp",
  "outputs": [
    {
      "id": "scenario_1",
      "name": "Login Test",
      "description": "Test user authentication",
      "steps": [
        {
          "action": "goto",
          "target": "https://example.com",
          "data": null,
          "description": "Navigate to website"
        },
        {
          "action": "fill",
          "target": "input[name='username']",
          "data": "testuser",
          "description": "Enter username"
        }
      ]
    }
  ],
  "metadata": {
    "generatedAt": "2025-08-25T11:02:48.425Z",
    "model": "gemini-1.5-flash",
    "totalTime": 7017,
    "source": "gemini_generated",
    "mcpValidationSuccessful": false,
    "stage": "generation_complete",
    "savedToFile": "gemini_scenarios_2025-08-25T11-02-48-424Z.json"
  }
}
```

**Key Features:**
- **`outputs` array**: Contains all generated scenarios
- **Restricted actions**: Only `goto`, `fill`, `click`, `expect` allowed
- **Metadata**: Complete generation information including timing and model used

### **Compile to Playwright**
```bash
POST /api/v1/compile
Content-Type: application/json

{
  "scenario": {
    "id": "scenario_1",
    "name": "Login Test",
    "steps": [
      {
        "action": "goto",
        "target": "https://example.com",
        "data": null,
        "description": "Navigate to website"
      }
    ]
  },
  "options": {
    "fileName": "login_test.spec.ts",
    "suiteId": "suite_generated"
  }
}
```

**Response includes:**
- Compiled Playwright TypeScript code
- IR (Intermediate Representation)
- Metadata with saved filename

### **List Results Files**
```bash
GET /api/v1/results
```

**Returns:**
- List of all saved JSON files
- File metadata (size, creation date, modification date)
- Total file count

## ⚙️ **Configuration**

### **Environment Variables** (`config.env`)

```bash
# Gemini AI Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash          # Currently configured for 1.5 Flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com

# API Server Configuration
PORT=3002

# MCP Configuration
MCP_ENABLED=true
```

### **Current Gemini Model**

The project is currently configured to use **Gemini 1.5 Flash**:
- **Fast and efficient** for test scenario generation
- **Cost-effective** for high-volume usage
- **Reliable** for consistent test scenario output

**To change models**, edit `config.env`:
```bash
# Available options:
GEMINI_MODEL=gemini-2.0-flash-exp      # Latest & fastest
GEMINI_MODEL=gemini-2.0-pro            # Most capable
GEMINI_MODEL=gemini-1.5-flash          # Current default (recommended)
GEMINI_MODEL=gemini-1.5-pro            # Previous generation
```

**After changing, restart the application:**
```bash
# Stop current app (Ctrl+C)
pnpm dev  # Restart
```

## 🎯 **Test Scenario Actions**

### **Restricted Action Set**

The system now enforces **only 4 core actions** for consistency and reliability:

| Action | Description | Use Case |
|--------|-------------|----------|
| **`goto`** | Navigate to a URL | Page navigation, starting tests |
| **`fill`** | Fill form fields with data | Input forms, search boxes |
| **`click`** | Click on elements | Buttons, links, form submissions |
| **`expect`** | Verify/assert conditions | Validation, checking results |

### **Benefits of Action Restriction**

- **✅ Consistency**: All scenarios use the same action vocabulary
- **✅ Reliability**: Reduces errors from complex or unsupported actions
- **✅ Maintainability**: Easier to understand and modify scenarios
- **✅ Playwright Compatibility**: Direct mapping to Playwright methods

### **Action Validation**

The system automatically validates generated scenarios:
- **Server-side validation** ensures only allowed actions are used
- **Automatic rejection** of scenarios with invalid actions
- **Clear error messages** when validation fails

## 📁 **Results Management**

### **Automatic File Saving**

Every operation automatically saves results to the `results/` folder:

```
results/
├── gemini_scenarios_2025-08-25T11-02-48-424Z.json
├── gemini_scenarios_2025-08-25T11-07-04-328Z.json
├── playwright_compilation_2025-08-25T11-10-00-146Z.json
└── ... (more files as you use the app)
```

### **File Naming Convention**
- **Gemini Scenarios**: `gemini_scenarios_TIMESTAMP.json`
- **Playwright Compilation**: `playwright_compilation_TIMESTAMP.json`
- **Timestamps**: ISO format for easy sorting and identification

### **Manual Verification**
- **Access files directly** from the `results/` folder
- **Use the API**: `GET /api/v1/results` to list all files
- **Inspect content**: Open any JSON file to verify generated content

## 🎨 **UI Features**

### **Modern Design**
- **Full-Width Layout**: Utilizes entire screen width like professional websites
- **Responsive Design**: Adapts to all screen sizes
- **Professional Typography**: Clear, readable fonts with proper contrast
- **Smooth Animations**: Hover effects and transitions

### **User Experience**
- **Auto-Population**: Generated scenarios automatically populate compilation form
- **Smart Navigation**: Automatic tab switching after generation
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages and validation
- **Download Support**: Direct download of generated test files

### **Accessibility**
- **Role-First Selectors**: Accessibility-friendly element selection
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML

## 🔄 **Complete Workflow Example**

### **Input Prompt**
```
"Test user login and search functionality on Amazon website"
```

### **Generated Scenario** (Auto-saved)
```json
{
  "scenarios": [
    {
      "id": "scenario_1",
      "name": "Amazon Login and Search",
      "description": "Test user authentication and search functionality",
      "steps": [
        {
          "action": "goto",
          "target": "https://amazon.com",
          "data": null,
          "description": "Navigate to Amazon homepage"
        },
        {
          "action": "click",
          "target": "button[data-testid='login']",
          "data": null,
          "description": "Click on login button"
        },
        {
          "action": "fill",
          "target": "input[name='username']",
          "data": "testuser",
          "description": "Enter username in login field"
        },
        {
          "action": "expect",
          "target": ".welcome-message",
          "data": null,
          "description": "Verify that welcome message is displayed"
        }
      ]
    }
  ]
}
```

**Key Points:**
- **Only 4 actions used**: `goto`, `click`, `fill`, `expect`
- **Realistic selectors**: Based on common web patterns
- **Clear descriptions**: Each step is self-explanatory

### **Generated Playwright Test** (Auto-saved)
```typescript
import { test, expect } from '@playwright/test';

test('Amazon Login and Search', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://amazon.com');
  
  // Click on element
  await page.locator('button[data-testid="login"]').click();
  
  // Fill input field
  await page.locator('input[name="username"]').fill('testuser');
  
  // Verify element
  await expect(page.locator('.welcome-message')).toBeVisible();
});
```

## 🛠️ **Development**

### **Building the Project**

```bash
# Build all packages and apps
pnpm build

# Build specific components
pnpm --filter combined-api build
pnpm --filter console-ui build
```

### **Development Mode**

```bash
# Start both API and UI in watch mode
pnpm dev

# Start individual components
pnpm --filter combined-api dev
pnpm --filter console-ui dev
```

### **Type Checking**

```bash
# Check all packages for type errors
pnpm typecheck
```

### **Package Management**

```bash
# Add dependencies to specific packages
pnpm --filter combined-api add package-name
pnpm --filter console-ui add package-name

# Add workspace dependencies
pnpm add -w package-name
```

## 🚀 **Deployment**

### **Production Build**

```bash
# Build all packages
pnpm build

# Start production server
pnpm --filter combined-api start
```

### **Environment Setup**
- Ensure `config.env` is properly configured
- Set production environment variables
- Configure reverse proxy if needed

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: `pnpm build && pnpm test`
5. **Submit a pull request**

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add proper error handling
- Include relevant documentation
- Test your changes thoroughly

## 📄 **License**

MIT License - see LICENSE file for details

## 🆘 **Support & Troubleshooting**

### **Common Issues**

**API Connection Errors:**
- Check if both API (port 3002) and UI (port 3000) are running
- Verify `pnpm dev` is running from `combined-project` directory
- Check console for error messages

**Gemini API Errors:**
- Verify `GEMINI_API_KEY` in `config.env`
- Check API key validity and quotas
- Ensure proper internet connection

**Build Errors:**
- Run `pnpm install` to ensure all dependencies are installed
- Check TypeScript configuration
- Verify all package.json files are correct

**Action Validation Errors:**
- Ensure scenarios only use: `goto`, `fill`, `click`, `expect`
- Check the generated JSON for invalid actions
- Review the Gemini prompt for action restrictions

### **Getting Help**
- **Create an issue** in the repository
- **Check the logs** in the terminal output
- **Review the results folder** for generated files
- **Test the API endpoints** directly with curl or Postman

## 🔗 **Related Projects**

- **PTOSMCPLLM**: Original prompt-to-scenario generator
- **SL2**: Original Playwright compiler
- **Gemini AI**: Google's AI model for scenario generation
- **Playwright**: Microsoft's browser automation framework
- **Fastify**: High-performance web framework
- **React**: Modern UI library

## 📝 **Recent Updates**

### **v2.0.0 - Action Restriction & Gemini 1.5 Flash**
- **🎯 Restricted Actions**: Only 4 core actions allowed (`goto`, `fill`, `click`, `expect`)
- **🚀 Gemini 1.5 Flash**: Updated to latest fast and efficient model
- **❌ No Fallback**: Removed hardcoded fallback scenarios - pure AI generation only
- **✅ Action Validation**: Server-side validation ensures action compliance
- **📊 Enhanced Metadata**: Better response structure with timing and model information
- **🔧 Schema Updates**: Updated JSON schemas to reflect new action restrictions

### **v1.5.0 - Frontend Structure Update**
- **🔄 Simplified API Response**: Frontend now accepts direct scenario objects
- **📱 Better UI Integration**: Improved scenario display and compilation workflow
- **🎨 Enhanced User Experience**: Cleaner interface with better error handling

---

**Built with ❤️ using TypeScript, React, Fastify, and modern web technologies**

**This combined project eliminates the need for separate scripts and provides a professional, unified experience for test automation workflows with consistent, reliable action patterns.**
