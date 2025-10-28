import React, { useState } from 'react';
import QueryForm from '../components/QueryForm';
import ResultCard from '../components/ResultCard';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      <header className="py-6 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800">AI Assistant</h1>
        <p className="text-lg text-gray-500 mt-1">Engage the AI for market analysis, predictions, and document summarization.</p>
      </header>

      <QueryForm setResult={setResult} setLoading={setLoading} />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analysis Result</h2>
        
        {loading && (
          <div className="p-6 rounded-xl bg-yellow-100 text-yellow-800 font-medium flex items-center justify-center space-x-2 shadow-inner">
            <span className="animate-spin text-2xl">⚙️</span>
            <span>Processing your financial request... Please wait.</span>
          </div>
        )}

        {result && <ResultCard result={result} />}

        {!loading && !result && (
          <div className="p-6 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            Your analysis results will appear here once you submit a query.
          </div>
        )}
      </section>
    </div>
  );
}