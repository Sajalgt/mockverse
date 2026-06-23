import { useState } from 'react';
import SchemaInput from './components/SchemaInput';
import SchemaPreview from './components/SchemaPreview';
import TargetApiForm from './components/TargetApiForm';
import LiveProgress from './components/LiveProgress';
import ResultsChart from './components/ResultsChart';
import ErrorBreakdown from './components/ErrorBreakdown';
import FAQ from './components/FAQ';
import { useSocket } from './hooks/useSocket';

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Describe Data' },
    { num: 2, label: 'Configure Test' },
    { num: 3, label: 'View Results' },
  ];

  return (
    <div className="flex flex-col gap-2 mb-8">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mono transition-all duration-300 ${
              currentStep >= step.num
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}
          >
            {step.num}
          </div>
          <span
            className={`text-sm transition-all duration-300 ${
              currentStep >= step.num ? 'text-gray-200' : 'text-gray-600'
            }`}
          >
            {step.label}
          </span>
          {idx < steps.length - 1 && (
            <div className="absolute left-[13px] mt-7 w-px h-2 bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [schema, setSchema] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const { progress, finalResult, error, resetTestState } = useSocket();

  const currentStep = finalResult ? 3 : testStarted ? 3 : schema ? 2 : 1;

  function handleSchemaGenerated(newSchema) {
    setSchema(newSchema);
    setTestStarted(false);
    resetTestState();
  }

  function handleTestStarted() {
    setTestStarted(true);
    resetTestState();
  }

  return (
    <div className="min-h-screen bg-[#0f1117] py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mono">
            Mock<span className="text-indigo-400">Verse</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            AI-powered synthetic data generator & API load tester
          </p>
        </div>

        {/* Step Indicator */}
        <div className="relative pl-2 mb-6">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Cards */}
        <SchemaInput onSchemaGenerated={handleSchemaGenerated} />
        <SchemaPreview schema={schema} />
        <TargetApiForm schema={schema} onTestStarted={handleTestStarted} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm mono">
            ✗ {error}
          </div>
        )}

        {testStarted && <LiveProgress progress={progress} />}
        <ResultsChart result={finalResult} />
        <ErrorBreakdown result={finalResult} />
        <FAQ />
      </div>
    </div>
  );
}

export default App;