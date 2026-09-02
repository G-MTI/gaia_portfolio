
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { supabase } from "@/lib/supabase"

export const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  const handleLogin = async (event) => {

    event.preventDefault()

    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate("/admin")

  }


  return (

    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">

      <div className="w-full max-w-md">

        <div className="mb-8">

          <p className="mb-2 text-sm text-white/40">
            Atlas
          </p>

          <h1 className="text-3xl font-semibold">
            Admin
          </h1>

          <p className="mt-2 text-white/50">
            Accedi per gestire gli articoli.
          </p>

        </div>


        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm text-white/60">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              placeholder="tu@email.com"
            />

          </div>


          {/* Password */}

          <div>

            <label className="mb-2 block text-sm text-white/60">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              placeholder="••••••••"
            />

          </div>


          {/* Errore */}

          {error && (

            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>

          )}


          {/* Pulsante */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? "Accesso..." : "Accedi"}

          </button>

        </form>

      </div>

    </main>

  )
}
