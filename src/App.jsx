import { Routes, Route } from "react-router-dom"

import { Hero } from "@/sections/Hero"
import { Navbar } from "@/sections/Navbar"
import { Me } from "@/sections/Me"
import { Creations } from "@/sections/Creations"
import { Experience } from "@/sections/Experience"
import { Contact } from "@/sections/Contact"
import { NavbarAtlas } from "@/atlas/NavbarAtlas"
import { Home } from "@/atlas/Home"
import { Article } from "@/atlas/Article"

function App() {
  return (
    <Routes>

      <Route path="/" element={
        <div className="min-h-screen overflow-x-hidden ">
          <Navbar />
          <main>
            <Hero />
            <Me />
            <Creations />
            <Experience />
            <Contact />

          </main>
        </div>
      }/>

      <Route path="/atlas" element={
        <div className="min-h-screen overflow-x-hidden ">
          <NavbarAtlas />
          <main>
            <Home />
          </main>
        </div>
      }/>

      <Route path="/atlas/articles/:number" element={
        <div className="min-h-screen overflow-x-hidden">
          <NavbarAtlas />
          <main>
            <Article />
          </main>
        </div>
      }/>

    </Routes>
  );
}

export default App;
