// src/pages/LoginPage.jsx
import React, { useState } from "react"

const BACKEND_URL = "https://stranger077-financ.hf.space" // ✅ Hugging Face backend

export default function LoginPage({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      // ✅ Safely parse JSON (in case backend sends plain text error)
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(text || "Unexpected server response")
      }

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Login failed")
      }

      // ✅ Save token and email in localStorage
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("email", data.user_email)

      // ✅ Notify parent component (App.jsx)
      onLogin({ email: data.user_email, token: data.access_token })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-3">
            FI
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your Financial AI Assistant</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="user@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 rounded-lg font-semibold text-white ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don’t have an account?
            <button
              onClick={onSwitchToSignup}
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
