
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

export const AdminLayout = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Articoli",
      path: "/admin/articles",
    },
    {
      name: "Fonti",
      path: "/admin/sources",
    },
  ]


  useEffect(() => {

    const getUser = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

    }

    getUser()

  }, [])


  const handleLogout = async () => {

    await supabase.auth.signOut()

    navigate("/admin/login")

  }


  return (

    <div className="min-h-screen bg-neutral-950 text-white">


      {/* Sidebar */}

      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/10 p-6">


        {/* Logo */}

        <div className="mb-12">

          <p className="text-xl font-semibold">
            Atlas
          </p>

          <p className="mt-1 text-sm text-white/40">
            Admin
          </p>

        </div>


        {/* Navigation */}

        <nav className="space-y-2">

          {navigation.map((item) => {

            const active = location.pathname === item.path

            return (

              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-4 py-3 text-sm transition ${
                  active
                    ? "bg-primary text-black"
                    : "text-white/60 hover:bg-primary/10 hover:text-white"
                }`}
              >
                {item.name}
              </Link>

            )

          })}

        </nav>


        {/* Bottom */}

        <div className="mt-auto space-y-4">


          {/* User */}

          {user && (

            <div className="rounded-lg border border-white/10 px-4 py-3">

              <p className="truncate text-sm">
                {user.email}
              </p>

              <p className="mt-1 text-xs text-white/40">
                Admin
              </p>

            </div>

          )}


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            Esci
          </button>


          {/* Atlas */}

          <Link
            to="/atlas"
            className="block rounded-lg px-4 py-3 text-sm text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            ← Torna ad Atlas
          </Link>

        </div>

      </aside>


      {/* Main */}

      <main className="ml-64 min-h-screen">

        <Outlet />

      </main>

    </div>

  )
}