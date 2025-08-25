import React, { useState, useEffect } from 'react';
import './App.css';

interface GenerationForm {
  objective: string;
  url: string;
  credentials: {
    username: string;
    password: string;
  };
  runId: string;
}

interface CompilationForm {
  selectedScenarioIndex: number;
  options: {
    fileName: string;
    suiteId: string;
    runId?: string;
  };
}

interface GenerationResult {
  runId: string;
  outputs: Array<{
    id: string;
    name: string;
    description: string;
    steps: Array<{
      action: string;
      target: string;
      data?: any;
      description: string;
    }>;
  }>;
  metadata: {
    generatedAt: string;
    model: string;
    totalTime: number;
    source: string;
    mcpValidationSuccessful: boolean;
    stage: string;
    savedToFile: string;
  };
}

interface CompilationResult {
  runId: string;
  ir: {
    suiteId: string;
    cases: Array<{
      id: string;
      name: string;
      steps: Array<{
        type: string;
        url?: string;
        selector?: string;
        value?: any;
      }>;
    }>;
  };
  artifacts: {
    testFileName: string;
    pageObjects: string[];
    ts: string;
  };
}

function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'compile'>('generate');
  const [generationForm, setGenerationForm] = useState<GenerationForm>({
    objective: '',
    url: '',
    credentials: {
      username: '',
      password: ''
    },
    runId: ''
  });
  const [compilationForm, setCompilationForm] = useState<CompilationForm>({
    selectedScenarioIndex: 0,
    options: {
      fileName: 'generated_test.spec.ts',
      suiteId: 'suite_generated'
    }
  });
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [latestGeneratedScenarios, setLatestGeneratedScenarios] = useState<GenerationResult | null>(null);

  // Auto-update compilation form when scenarios are generated
  useEffect(() => {
    if (latestGeneratedScenarios && latestGeneratedScenarios.outputs.length > 0) {
      const firstScenario = latestGeneratedScenarios.outputs[0];
      setCompilationForm(prev => ({
        ...prev,
        options: {
          ...prev.options,
          fileName: `${firstScenario.name.replace(/[^a-zA-Z0-9]/g, '_')}.spec.ts`,
          suiteId: `suite_${firstScenario.id}`
        }
      }));
    }
  }, [latestGeneratedScenarios]);

  const handleGenerationInputChange = (field: keyof GenerationForm, value: any) => {
    if (field === 'credentials') {
      setGenerationForm(prev => ({
        ...prev,
        credentials: { ...prev.credentials, ...value }
      }));
    } else {
      setGenerationForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCompilationInputChange = (field: keyof CompilationForm, value: any) => {
    if (field === 'options') {
      setCompilationForm(prev => ({
        ...prev,
        options: { ...prev.options, ...value }
      }));
    } else {
      setCompilationForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleGenerationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationForm),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGenerationResult(result);
      setLatestGeneratedScenarios(result); // Store for auto-population
      
      // Auto-switch to compile tab after successful generation
      setActiveTab('compile');
    } catch (error) {
      console.error('Error generating scenarios:', error);
      alert('Failed to generate scenarios. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompilationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!latestGeneratedScenarios) {
      alert('No scenarios available. Please generate scenarios first.');
      return;
    }
    
    setIsCompiling(true);
    
    try {
      const selectedScenario = latestGeneratedScenarios.outputs[compilationForm.selectedScenarioIndex];
      const payload = {
        scenario: {
          id: selectedScenario.id,
          name: selectedScenario.name,
          steps: selectedScenario.steps
        },
        options: {
          emitPageObjects: true,
          selectorStrategy: 'role-first',
          fileName: compilationForm.options.fileName,
          suiteId: compilationForm.options.suiteId
        }
      };

      const response = await fetch('/api/v1/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setCompilationResult(result);
    } catch (error) {
      console.error('Error compiling scenario:', error);
      alert('Failed to compile scenario. Please try again.');
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadGeneratedTest = () => {
    if (compilationResult) {
      const blob = new Blob([compilationResult.artifacts.ts], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = compilationResult.artifacts.testFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleTabChange = (tab: 'generate' | 'compile') => {
    setActiveTab(tab);
    // Clear previous results when switching tabs
    if (tab === 'generate') {
      setCompilationResult(null);
    } else {
      setGenerationResult(null);
    }
  };

  const formatScenarioOption = (scenario: any, index: number) => {
    return `${index + 1}. ${scenario.name} (${scenario.steps.length} steps)`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Prompt to Playwright Typescript</h1>
        <p>Generate Test Scenarios with LLM and Compile to Playwright</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => handleTabChange('generate')}
        >
          Generate Scenarios
        </button>
        <button 
          className={`tab ${activeTab === 'compile' ? 'active' : ''}`}
          onClick={() => handleTabChange('compile')}
        >
          Compile to Playwright
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="generation-section">
          <h2>Generate Test Scenarios</h2>
          <form onSubmit={handleGenerationSubmit} className="generation-form">
            <div className="form-group">
              <label htmlFor="objective">Test Objective:</label>
              <textarea
                id="objective"
                value={generationForm.objective}
                onChange={(e) => handleGenerationInputChange('objective', e.target.value)}
                placeholder="Describe what you want to test (e.g., 'Login functionality for Amazon website')"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="url">Target URL:</label>
              <input
                type="url"
                id="url"
                value={generationForm.url}
                onChange={(e) => handleGenerationInputChange('url', e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username (optional):</label>
              <input
                type="text"
                id="username"
                value={generationForm.credentials.username}
                onChange={(e) => handleGenerationInputChange('credentials', { username: e.target.value })}
                placeholder="testuser"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password (optional):</label>
              <input
                type="password"
                id="password"
                value={generationForm.credentials.password}
                onChange={(e) => handleGenerationInputChange('credentials', { password: e.target.value })}
                placeholder="testpass"
              />
            </div>

            <div className="form-group">
              <label htmlFor="runId">Run ID (optional):</label>
              <input
                type="text"
                id="runId"
                value={generationForm.runId}
                onChange={(e) => handleGenerationInputChange('runId', e.target.value)}
                placeholder="run_123"
              />
            </div>

            <button type="submit" disabled={isGenerating} className="generate-btn">
              {isGenerating ? 'Generating...' : 'Generate Scenarios'}
            </button>
          </form>

          {generationResult && (
            <div className="generation-result">
              <h3>Generated Scenarios</h3>
              <div className="result-details">
                <p><strong>Run ID:</strong> {generationResult.runId}</p>
                <p><strong>Generated At:</strong> {new Date(generationResult.metadata.generatedAt).toLocaleString()}</p>
                <p><strong>Model:</strong> {generationResult.metadata.model}</p>
                <p><strong>Total Time:</strong> {generationResult.metadata.totalTime}ms</p>
                <p><strong>Source:</strong> {generationResult.metadata.source}</p>
              </div>
              
              <div className="scenarios-list">
                {generationResult.outputs.map((output, index) => (
                  <div key={index} className="scenario-item">
                    <h4>Scenario {index + 1}: {output.name}</h4>
                    <p><strong>ID:</strong> {output.id}</p>
                    <p><strong>Description:</strong> {output.description}</p>
                    <div className="steps-list">
                      <h5>Steps:</h5>
                      {output.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="step-item">
                          <span className="step-action">{step.action}</span>
                          <span className="step-target">{step.target}</span>
                          {step.data && <span className="step-data">Data: {JSON.stringify(step.data)}</span>}
                          <span className="step-description">{step.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="success-message">
                ✅ Scenarios generated successfully! Switch to "Compile to Playwright" tab to convert them to tests.
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'compile' && (
        <div className="compilation-section">
          <h2>Compile to Playwright</h2>
          
          {latestGeneratedScenarios ? (
            <div className="auto-populated-info">
              <h3>🔄 Available Scenarios from Latest Generation</h3>
              <p>Using scenarios from: <strong>{latestGeneratedScenarios.runId}</strong></p>
              <p>Generated at: <strong>{new Date(latestGeneratedScenarios.metadata.generatedAt).toLocaleString()}</strong></p>
              <p>Total scenarios: <strong>{latestGeneratedScenarios.outputs.length}</strong></p>
            </div>
          ) : (
            <div className="no-scenarios-warning">
              <h3>⚠️ No Scenarios Available</h3>
              <p>Please generate scenarios first using the "Generate Scenarios" tab.</p>
            </div>
          )}

          {latestGeneratedScenarios && (
            <form onSubmit={handleCompilationSubmit} className="compilation-form">
              <div className="form-group">
                <label htmlFor="scenario-select">Select Scenario:</label>
                <select
                  id="scenario-select"
                  value={compilationForm.selectedScenarioIndex}
                  onChange={(e) => handleCompilationInputChange('selectedScenarioIndex', parseInt(e.target.value))}
                  required
                >
                  {latestGeneratedScenarios.outputs.map((output, index) => (
                    <option key={index} value={index}>
                      {formatScenarioOption(output, index)}
                    </option>
                  ))}
                </select>
                <small className="help-text">
                  Choose which generated scenario to compile to Playwright test
                </small>
              </div>

              <button type="submit" disabled={isCompiling} className="compile-btn">
                {isCompiling ? 'Compiling...' : '🚀 Compile to Playwright'}
              </button>
            </form>
          )}

          {compilationResult && (
            <div className="compilation-result">
              <h3>✅ Compilation Successful!</h3>
              <div className="compilation-details">
                <p><strong>Run ID:</strong> {compilationResult.runId}</p>
                <p><strong>Test File:</strong> {compilationResult.artifacts.testFileName}</p>
                <p><strong>Page Objects:</strong> {compilationResult.artifacts.pageObjects.join(', ')}</p>
              </div>
              
              <div className="generated-code">
                <h4>Generated Playwright Test:</h4>
                <div className="code-block">
                  <pre><code>{compilationResult.artifacts.ts}</code></pre>
                </div>
                <button onClick={downloadGeneratedTest} className="download-btn">
                  📥 Download {compilationResult.artifacts.testFileName}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
