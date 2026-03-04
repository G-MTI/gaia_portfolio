
import { Hero } from "@/sections/Hero"
import { Navbar } from "@/sections/Navbar"
import { Me } from "@/sections/Me"
import { Creations } from "@/sections/Creations"
import { Experience } from "@/sections/Experience"
import { Contact } from "@/sections/Contact"

function App() {
  return (
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
  );
}

export default App
