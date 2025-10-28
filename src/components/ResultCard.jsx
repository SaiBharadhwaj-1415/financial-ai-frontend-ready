import React from 'react';

export default function ResultCard({ result }) {
  const title = result?.title || result?.mode || 'Analysis Result';
  const body = result?.body || result?.output || JSON.stringify(result);

  return (
    <div className="p-6 bg-white border border-green-200 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
      <h3 className="font-bold text-xl text-indigo-700 mb-3 border-b pb-2 border-indigo-100">{title}</h3>
      <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
        {typeof body === 'string' ? body : JSON.stringify(body, null, 2)}
      </pre>
    </div>
  );
}