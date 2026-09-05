
import { Button } from "@/components/Button";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

import { NavLink, Link, Outlet, useLocation } from "react-router-dom"

const NavButton = [
    {link: "/atlas/library", label: "Library"},
    {link: "/atlas/search", label: "Search"},
] 

export const NavbarAtlas= () =>{

    const [isOpen, setIsOpen] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <header className= "fixed top-0 left-0 right-0 z-50">
            <nav className={` max-w-screen container flex items-center left-0 py-6 px-12 right-0 top-0 justify-between mx-auto ${isScrolled ? "glass-transparent" : "bg-transparent"} `}>
                {/*schiaccio cambia tema sito?*/}
                <Link to="/" >
                    <p className="text-3xl font-bold">
                        GM
                        <span className="text-primary">.</span>
                    </p>
                </Link>

                {/*Desktop*/}
                
                <div className="hidden md:flex items-center gap-6">
                    {NavButton.map((button, index) => (
                        <NavLink
                        key={index} 
                        to={button.link} 
                        className={({ isActive }) => `text-xl px-6 duration-300 ${
                            isActive 
                                ? "bg-primary text-black rounded-full px-6 py-2" 
                                : "duration-300 hover:scale-130 hover:text-primary" }`}>
                            {button.label}
                        </NavLink>
                    ))}
                </div>

                {/*Mobile*/}
                <button className="md:hidden text-white" onClick={() => setIsOpen((prev) => !prev)}>
                    {isOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </nav>

{/* Mobile menu */}
{isOpen && (
              <div className="md:hidden glass-transparent absolute left-6 right-6 top-full mt-3 overflow-hidden rounded-xl border border-white/10">
                <div className="flex flex-col">
                  {NavButton.map((button, index) => (
                    <a
                      key={button.label}
                      href={button.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between border-b border-white/10 px-6 py-5 last:border-b-0"
                    >
                      <div className="flex  items-center gap-8">
                        <span className="text-xs text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                
                        <span className="text-lg text-white transition-all duration-300 group-hover:translate-x-1 group-hover:scale-130 ">
                          {button.label}
                        </span>
                      </div>
                
                      <span className="text-white transition-all duration-300 group-hover:translate-x-1 group-hover:scale-130">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </header>
    )
}