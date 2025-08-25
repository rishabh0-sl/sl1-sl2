# 🚀 Combined Project - Complete Technical Details

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Core Components](#core-components)
4. [API Endpoints & Data Flow](#api-endpoints--data-flow)
5. [Frontend Implementation](#frontend-implementation)
6. [Backend Implementation](#backend-implementation)
7. [Data Models & Schemas](#data-models--schemas)
8. [Configuration & Environment](#configuration--environment)
9. [Build & Deployment](#build--deployment)
10. [Code Analysis & Key Functions](#code-analysis--key-functions)

---

## 🎯 Project Overview

The **Combined Project** is a unified, full-featured web application that seamlessly combines:

1. **Prompt to Test Scenarios with LLM** (PTOSMCPLLM) - AI-powered test scenario generation
2. **Playwright Compiler** (SL2) - Automated test compilation to executable Playwright TypeScript code

### Key Features
- **End-to-End Workflow**: Single interface for complete test automation
- **AI-Powered Generation**: Uses Google's Gemini AI for intelligent test scenario creation
- **Professional Compilation**: Generates production-ready Playwright tests
- **Auto-Save Results**: All operations automatically persist to JSON files
- **Modern Web UI**: Full-width, responsive React frontend
- **RESTful API**: Fastify-based backend with comprehensive endpoints

---

## 🏗️ Architecture & Design

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Fastify API    │    │  Gemini AI API  │
│   (Port 3000)   │◄──►│   (Port 3002)   │◄──►│   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │    │  Data Processing│    │  AI Generation  │
│   & Display     │    │  & Validation   │    │  & Parsing      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Results Display│    │  File Persistence│   │  Test Compilation│
│  & Download     │    │  (JSON)         │   │  (TypeScript)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Fastify + Node.js + TypeScript
- **AI Integration**: Google Gemini API
- **Package Manager**: PNPM with workspace support
- **Build Tools**: TypeScript compiler + Vite
- **Styling**: CSS with modern design principles

### Project Structure
```
combined-project/
├── 📁 packages/                    # Shared libraries
│   ├── contracts/                  # JSON schemas & type definitions
│   ├── compiler-core/              # Core LLM compiler logic
│   └── ir/                         # Intermediate representation types
├── 📁 apps/                        # Application components
│   ├── console-ui/                 # React frontend application
│   └── combined-api/               # Fastify API server
├── 📁 results/                     # Auto-saved operation results
├── config.env                      # Environment configuration
├── package.json                    # Workspace root configuration
├── pnpm-workspace.yaml            # PNPM workspace configuration
└── tsconfig.json                   # Root TypeScript configuration
```

---

## 🔧 Core Components

### 1. Compiler Core Package (`packages/compiler-core/`)

**Purpose**: Central logic for LLM integration and test scenario generation

**Key Classes**:
- `LLMCompiler`: Main orchestrator for scenario generation
- `GeminiService`: Handles Google Gemini API communication
- `MCPClient`: Manages Model Context Protocol connections

**Core Functionality**:
```typescript
// Main compilation flow
async generateScenarios(input: PRDIntake): Promise<GenerationResult> {
  // 1. Validate input using JSON schemas
  // 2. Generate scenarios via Gemini API
  // 3. Optionally enhance with MCP validation
  // 4. Return structured results
}
```

### 2. Contracts Package (`packages/contracts/`)

**Purpose**: Shared data schemas and type definitions

**Schemas**:
- `prd_intake.schema.json`: Product requirements input validation
- `scenario.schema.json`: Test scenario structure definition
- `llm_run.schema.json`: LLM execution output format

### 3. IR Package (`packages/ir/`)

**Purpose**: Intermediate representation types for test compilation

**Key Types**:
```typescript
export type StepGoto = { action: "goto"; target: string };
export type StepFill = { action: "fill"; target: string; data: string };
export type StepClick = { action: "click"; target: string };
export type StepExpect = { action: "expect"; target: string };
export type Step = StepGoto | StepFill | StepClick | StepExpect;

export interface CaseIR {
  id: string;
  name: string;
  steps: Step[];
}

export interface SuiteIR {
  suiteId: string;
  cases: CaseIR[];
}
```

---

## 🌐 API Endpoints & Data Flow

### API Server Architecture
The application uses **Fastify** as the web framework for its high performance and TypeScript support.

### Endpoint Structure

#### 1. Health Check
```typescript
GET /health
Response: { status: 'ok', timestamp: '2025-01-25T10:30:00.000Z' }
```

#### 2. Generate Test Scenarios
```typescript
POST /api/v1/generate
Content-Type: application/json

Request Body:
{
  "testObjective": "Test user login functionality",
  "targetUrl": "https://example.com",
  "username": "testuser",
  "password": "testpass"
}
```

#### 3. Compile to Playwright
```typescript
POST /api/v1/compile
Content-Type: application/json

Request Body:
{
  "scenario": {
    "id": "scenario_1",
    "name": "Login Test",
    "steps": [...]
  },
  "options": {
    "emitPageObjects": true,
    "selectorStrategy": "role-first",
    "fileName": "login_test.spec.ts",
    "suiteId": "suite_generated"
  }
}
```

#### 4. List Results
```typescript
GET /api/v1/results
Response: List of all saved JSON files with metadata
```

### Data Flow Process

1. **User Input** → Frontend form submission
2. **API Request** → Fastify server receives request
3. **Validation** → Zod schema validation
4. **AI Processing** → Gemini API call for scenario generation
5. **Response Parsing** → JSON extraction and validation
6. **Result Persistence** → Auto-save to results folder
7. **Frontend Update** → Display results and auto-populate compilation form

---

## 🎨 Frontend Implementation

### React Application Structure

**Main Component**: `App.tsx` - Single-page application with tabbed navigation

**State Management**:
```typescript
// Core state variables
const [activeTab, setActiveTab] = useState<'generate' | 'compile'>('generate');
const [generationForm, setGenerationForm] = useState<GenerationForm>({...});
const [compilationForm, setCompilationForm] = useState<CompilationForm>({...});
const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
const [latestGeneratedScenarios, setLatestGeneratedScenarios] = useState<GenerationResult | null>(null);
```

**Key Features**:
- **Tabbed Navigation**: Generate Scenarios ↔ Compile to Playwright
- **Auto-Population**: Generated scenarios automatically populate compilation form
- **Smart Switching**: Automatic tab switching after successful generation
- **Real-time Updates**: Loading states and progress indicators
- **Download Support**: Direct download of generated test files

### Form Handling

**Generation Form**:
```typescript
interface GenerationForm {
  objective: string;        // Test objective description
  url: string;             // Target website URL
  credentials: {
    username: string;       // Optional username
    password: string;       // Optional password
  };
  runId: string;           // Optional run identifier
}
```

**Compilation Form**:
```typescript
interface CompilationForm {
  selectedScenarioIndex: number;  // Index of selected scenario
  options: {
    fileName: string;             // Output test file name
    suiteId: string;              // Test suite identifier
    runId?: string;               // Optional run identifier
  };
}
```

---

## ⚙️ Backend Implementation

### Fastify Server Configuration

**Server Setup**:
```typescript
const fastify = Fastify({
  logger: true  // Built-in logging
});

// CORS configuration
await fastify.register(cors, {
  origin: true  // Allow all origins
});
```

**Port Configuration**:
- **API Server**: Port 3002
- **Frontend**: Port 3000 (Vite dev server)

### Core Server Files

#### 1. `server.ts` (Main Server)
- **Purpose**: Full-featured server with comprehensive functionality
- **Features**: 
  - Gemini API integration
  - Advanced scenario generation
  - Fallback mechanisms
  - Comprehensive error handling

#### 2. `simple-server.ts` (Simplified Server)
- **Purpose**: Streamlined server for basic operations
- **Features**:
  - Essential endpoints only
  - Simplified Gemini integration
  - Basic Playwright compilation

### Gemini API Integration

**API Configuration**:
```typescript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com';
```

**Request Structure**:
```typescript
const response = await fetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': GEMINI_API_KEY,
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: `Generate test scenarios for: ${body.testObjective}...`
      }]
    }]
  })
});
```

---

## 📊 Data Models & Schemas

### Core Data Structures

#### 1. Test Scenario Model
```typescript
interface TestScenario {
  id: string;                    // Unique identifier
  name: string;                  // Human-readable name
  steps: TestStep[];             // Array of test steps
  timeTakenToCompile?: string;   // Compilation duration
  tags?: string[];               // Categorization tags
}
```

#### 2. Test Step Model
```typescript
interface TestStep {
  action: 'goto' | 'fill' | 'click' | 'expect' | 'wait' | 'type' | 'select' | 'hover';
  target: string;                // Selector or URL
  data?: string;                 // Input data for fill/type actions
  description: string;           // Human-readable description
}
```

#### 3. Generation Result Model
```typescript
interface GenerationResult {
  runId: string;                 // Execution identifier
  outputs: Array<{
    scenario: TestScenario;      // Generated test scenario
  }>;
  metadata: {
    generatedAt: string;         // ISO timestamp
    model: string;               // AI model used
    totalTime: string;           // Generation duration
    source: string;              // Data source
    mcpValidationSuccessful: boolean;
    stage: string;               // Processing stage
  };
}
```

### JSON Schema Validation

**Validation Process**:
```typescript
// Zod schema definition
const CompilationRequestSchema = z.object({
  scenario: z.object({
    id: z.string(),
    name: z.string(),
    steps: z.array(z.object({
      action: z.string(),
      target: z.string(),
      data: z.any().optional(),
      description: z.string()
    }))
  }),
  options: z.object({
    emitPageObjects: z.boolean().default(true),
    selectorStrategy: z.enum(['role-first', 'css']).default('role-first'),
    fileName: z.string().default('generated_test.spec.ts'),
    suiteId: z.string().default('suite_generated'),
    runId: z.string().optional()
  })
});

// Validation usage
const validatedRequest = CompilationRequestSchema.parse(request.body);
```

---

## ⚙️ Configuration & Environment

### Environment Variables (`config.env`)

```bash
# Gemini AI Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com

# MCP Configuration
MCP_ENABLED=true

# API Configuration
PORT=3002
```

### Configuration Management

**Environment Loading**:
```typescript
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com';
```

**Configuration Validation**:
```typescript
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}
```

### Model Configuration Options

**Available Gemini Models**:
- `gemini-2.0-flash-exp`: Latest & fastest
- `gemini-2.0-pro`: Most capable
- `gemini-1.5-flash`: Current default
- `gemini-1.5-pro`: Previous generation

---

## 🏗️ Build & Deployment

### Build System

**Workspace Configuration** (`pnpm-workspace.yaml`):
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**Root Package Scripts**:
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter combined-api dev\" \"pnpm --filter console-ui dev\"",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck"
  }
}
```

### Build Commands

**Development Mode**:
```bash
# Start both API and UI simultaneously
pnpm dev

# Start individual components
pnpm --filter combined-api dev
pnpm --filter console-ui dev
```

**Production Build**:
```bash
# Build all packages
pnpm build

# Build specific components
pnpm --filter combined-api build
pnpm --filter console-ui build
```

**Type Checking**:
```bash
# Check all packages for type errors
pnpm typecheck
```

### Package Dependencies

**Root Dependencies**:
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "concurrently": "^8.2.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "data-uri-to-buffer": "^6.0.2"
  }
}
```

**API Dependencies**:
```json
{
  "dependencies": {
    "@fastify/cors": "^9.0.0",
    "dotenv": "^16.6.1",
    "fastify": "^4.24.0",
    "zod": "^3.23.8"
  }
}
```

**UI Dependencies**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  }
}
```

---

## 🔍 Code Analysis & Key Functions

### 1. Playwright Test Generation

**Function**: `generatePlaywrightTest(scenario, options)`

**Purpose**: Converts test scenarios to executable Playwright TypeScript code

**Key Logic**:
```typescript
function generatePlaywrightTest(scenario: any, options: any): string {
  const testName = scenario.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ');
  
  let testCode = `import { test, expect } from '@playwright/test';\n\n`;
  testCode += `test('${testName}', async ({ page }) => {\n`;
  
  scenario.steps.forEach((step: any, index: number) => {
    const indent = '  ';
    
    switch (step.action) {
      case 'goto':
        testCode += `${indent}// Navigate to the page\n`;
        testCode += `${indent}await page.goto('${step.target}');\n`;
        break;
      case 'click':
        testCode += `${indent}// Click on element\n`;
        if (options.selectorStrategy === 'role-first' && step.target.startsWith('role=')) {
          // Generate role-based selectors for accessibility
          const roleMatch = step.target.match(/role=([^[\]]+)(?:\[([^\]]+)\])?/);
          if (roleMatch) {
            const role = roleMatch[1];
            const name = roleMatch[2] ? roleMatch[2].replace(/name=['"]([^'"]+)['"]/, '$1') : undefined;
            if (name) {
              testCode += `${indent}await page.getByRole('${role}', { name: '${name}' }).click();\n`;
            } else {
              testCode += `${indent}await page.getByRole('${role}').click();\n`;
            }
          }
        } else {
          testCode += `${indent}await page.locator('${step.target}').click();\n`;
        }
        break;
      // ... other action types
    }
  });
  
  testCode += `});\n`;
  return testCode;
}
```

**Selector Strategy Support**:
- **Role-First**: Uses Playwright's `getByRole()` for accessibility
- **CSS**: Traditional CSS selector approach
- **Text-Based**: `getByText()` for text-based selection

### 2. Scenario Generation with Fallbacks

**Function**: `generateFallbackScenarios(input)`

**Purpose**: Provides backup scenarios when AI generation fails

**Fallback Logic**:
```typescript
function generateFallbackScenarios(input: any): any[] {
  const scenarios: any[] = [];
  
  // Login-specific scenarios
  if (input.objective.toLowerCase().includes('login')) {
    scenarios.push({
      id: 'scn_1',
      name: 'Login and Basic Navigation',
      steps: [
        {
          action: 'goto',
          target: input.url,
          description: `Navigate to ${input.url}`
        },
        {
          action: 'fill',
          target: '#username',
          data: input.credentials?.username || 'username',
          description: 'Enter the username'
        },
        {
          action: 'click',
          target: '#login-button',
          description: 'Click on login button'
        },
        {
          action: 'expect',
          target: '#welcome-message',
          description: 'Check if welcome message is visible'
        }
      ],
      tags: ['smoke', 'auth', 'fallback']
    });
  }

  // Generic scenarios if none match
  if (scenarios.length === 0) {
    scenarios.push({
      id: 'scn_generic_1',
      name: 'Generic Test Scenario - Page Load',
      steps: [
        {
          action: 'goto',
          target: input.url,
          description: `Navigate to ${input.url}`
        },
        {
          action: 'expect',
          target: '#main-content',
          description: 'Verify main content loads successfully'
        }
      ],
      tags: ['generic', 'smoke', 'fallback']
    });
  }

  return scenarios;
}
```

### 3. Results Persistence

**Function**: `saveToResultsFolder(data, prefix)`

**Purpose**: Automatically saves all operation results to timestamped JSON files

**Implementation**:
```typescript
function saveToResultsFolder(data: any, prefix: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${prefix}_${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved ${prefix} to: ${filepath}`);
  
  return filename;
}
```

**File Naming Convention**:
- **Gemini Scenarios**: `gemini_scenarios_TIMESTAMP.json`
- **Playwright Compilation**: `playwright_compilation_TIMESTAMP.json`
- **Timestamps**: ISO format for easy sorting

---

## 🚀 Conclusion

The **Combined Project** represents a sophisticated integration of modern web technologies, AI capabilities, and test automation. It provides a professional, end-to-end solution for test scenario generation and Playwright compilation, eliminating the need for separate tools and scripts.

### Key Strengths
- **Unified Workflow**: Single interface for complete test automation
- **AI-Powered Generation**: Intelligent scenario creation with Gemini AI
- **Professional Output**: Production-ready Playwright TypeScript tests
- **Robust Architecture**: TypeScript, React, Fastify, and modern tooling
- **Auto-Persistence**: Automatic saving of all operations
- **Extensible Design**: Modular architecture for future enhancements

### Technical Excellence
- **Type Safety**: Comprehensive TypeScript implementation
- **Schema Validation**: JSON schema validation throughout
- **Error Handling**: Multi-layer error handling and fallbacks
- **Performance**: Optimized for speed and efficiency
- **Security**: Secure API key management and input validation
- **Scalability**: Designed for horizontal and vertical scaling

This project demonstrates modern software development best practices and provides a solid foundation for enterprise-grade test automation workflows.

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-25  
**Project Status**: Production Ready  
**Maintainer**: Development Team
