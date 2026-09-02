import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

import { supabase } from "@/lib/supabase"

export const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const currentUser = session?.user ?? null

      if (!currentUser) {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      setUser(currentUser)

      const { data: admin, error } = await supabase.rpc("is_admin")

      if (error) {
        console.error("Errore verifica admin:", error)
        setIsAdmin(false)
      } else {
        setIsAdmin(admin === true)
      }

      setLoading(false)
    }

    checkAccess()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <p className="text-white/50">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/atlas" replace />
  }

  return <Outlet />
}