
import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"

import { Hero } from "@/sections/Hero"
import { Navbar } from "@/sections/Navbar"
import { Me } from "@/sections/Me"
import { Creations } from "@/sections/Creations"
import { Experience } from "@/sections/Experience"
import { Contact } from "@/sections/Contact"

import { NavbarAtlas } from "@/atlas/NavbarAtlas"

// Carichiamo Atlas solo quando serve
const Home = lazy(() => import("@/atlas/Home").then(module => ({
  default: module.Home
})))

const Article = lazy(() => import("@/atlas/Article").then(module => ({
  default: module.Article
})))

function App() {

  return (

    <Routes>

      {/* HOME */}

      <Route
        path="/"
        element={
          <div className="min-h-screen overflow-x-hidden">
            <Navbar />

            <main>
              <Hero />
              <Me />
              <Creations />
              <Experience />
              <Contact />
            </main>
          </div>
        }
      />


      {/* ATLAS */}

      <Route
        path="/atlas"
        element={
          <div className="min-h-screen overflow-x-hidden">

            <NavbarAtlas />

            <main>
              <Suspense fallback={<p>Loading...</p>}>
                <Home />
              </Suspense>
            </main>

          </div>
        }
      />


      {/* ARTICLE */}

      <Route
        path="/atlas/articles/:number"
        element={
          <div className="min-h-screen overflow-x-hidden">

            <NavbarAtlas />

            <main>
              <Suspense fallback={<p>Loading...</p>}>
                <Article />
              </Suspense>
            </main>

          </div>
        }
      />

    </Routes>

  )
}

export default App
