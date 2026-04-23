/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push("/recipes")
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email for a confirmation link!")
      }
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">
      <div className="mb-8">
        <img src="/bingeLogo.png" alt="Binge" className="h-32 w-auto" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        {/* Toggle */}
        <div className="flex mb-6 bg-orange-100 rounded-xl p-1">
          <button
            onClick={() => { setMode("signin"); setError(null); setMessage(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === "signin" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(null); setMessage(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === "signup" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          {message && <p className="text-green-600 text-xs text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </main>
  )
}
