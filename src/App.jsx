
import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"

import { Hero } from "@/sections/Hero"
import { Navbar } from "@/sections/Navbar"
import { Me } from "@/sections/Me"
import { Creations } from "@/sections/Creations"
import { Experience } from "@/sections/Experience"
import { Contact } from "@/sections/Contact"
import { Footer } from "@/components/Footer"

import { NavbarAtlas } from "@/atlas/NavbarAtlas"
import { Library } from "@/atlas/Library"
import { Resource } from "@/atlas/Resource"
import { Search } from "@/atlas/Search"

import { AdminLayout } from "@/admin/AdminLayout"
import { Dashboard } from "@/admin/Dashboard"
import { Login } from "@/admin/Login"
import { ProtectedRoute } from "@/admin/ProtectedRoute"
import { Articles } from "@/admin/Articles"
import { ArticleEditor } from "@/admin/ArticleEditor"
import { Sources } from "@/admin/Sources"

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
              <Footer />

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
                <Footer />
              </Suspense>
            </main>

          </div>
        }
      />

      <Route
        path="/atlas/library"
        element={
          <div className="min-h-screen overflow-x-hidden">
            <NavbarAtlas />
            <main>
              <Library />
            </main>
            <Footer />
          </div>
        }
      />

      <Route 
        path="/atlas/search" 
        element={
          <div className="min-h-screen overflow-x-hidden">
            <NavbarAtlas />
            <main>
              <Search />
              
            </main>
            <Footer />
          </div>
        } />

      
      <Route 
        path="/atlas/library/:id"
        element={
          <div className="min-h-screen overflow-x-hidden">
            <NavbarAtlas />
            <main>              
              <Resource />
              
            </main>
            <Footer />
          </div>} 
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
                <Footer />
              </Suspense>

            </main>

          </div>
        }
      />

      {/* ADMIN */}

      <Route 
        path="/admin/login" 
        element={
          <Login />
        }
      />

      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        >
          <Route
          index
          element={
            <Dashboard />
          }
          />

          <Route 
          path="articles" 
          element={
            <Articles />
          } />

          <Route 
            path="articles/new"
            element={
              <ArticleEditor />
            } />

         <Route 
          path="articles/:id"
          element={
            <ArticleEditor />
          }/>

          <Route 
          path="sources"
          element={
            <Sources />
          } />

        </Route>


      </Route>

    </Routes>

  )
}

export default App
