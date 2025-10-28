// src/components/QueryForm.jsx

import React, { useState } from 'react'
import { REACT_BACKEND_URL } from '../config'

// Utility function to determine mode from query
const getModeFromQuery = (query) => {
  const lower = query.toLowerCase()
  if (lower.includes('trend') || lower.includes('predict') || lower.includes('forecast'))
    return 'trend'
  return 'sentiment'
}

export default function QueryForm({ setResult, setLoading }) {
  const [query, setQuery] = useState('')
  const [file, setFile] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setResult(null)
    setLoading(true)

    let mode = 'sentiment'
    if (file) mode = 'document'
    else mode = getModeFromQuery(query)

    if (!query.trim() && mode !== 'document') {
      setLoading(false)
      setResult({ title: 'Input Error', body: 'Please enter a query for sentiment/trend analysis.' })
      return
    }

    try {
      if (mode === 'document' && file) {
        // Document Upload
        const fd = new FormData()
        fd.append('file', file)
        const resp = await fetch(`${REACT_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: fd,
        })
        const data = await resp.json()
        setResult({ title: 'Document Summary', body: data.body || data })
      } 
      else {
        // Trend Prediction Endpoint
        const resp = await fetch(`${REACT_BACKEND_URL}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })
        const data = await resp.json()
        setResult(data)
      } 
    } catch (err) {
      setResult({
        title: 'Error',
        body: `Could not reach backend at ${REACT_BACKEND_URL}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (file) setFile(null)
          }}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Ask a financial question, e.g., 'predict trend for RELIANCE' or 'analyze article on INFY'"
        />
        <button type="submit" className="px-5 py-3 bg-indigo-600 text-white rounded-lg">
          Analyze
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-slate-500">
          You can perform <b>Sentiment Analysis</b>, <b>Trend Prediction</b>, or <b>Upload Documents</b>.
          Include words like “trend” or “predict” for stock predictions, or upload a document.
        </div>
        <div className="flex items-center gap-3">
          <label className="flex-1 border-dashed border-2 p-4 rounded-lg text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null)
                setQuery('')
              }}
            />
            {file ? (
              <span>File Uploaded: <b>{file.name}</b></span>
            ) : (
              <span>Click to upload a PDF / TXT file</span>
            )}
          </label>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="px-3 py-2 border rounded-lg hover:bg-slate-100"
            >
              Clear File
            </button>
          )}
        </div>
      </div>
    </form>
  )
}