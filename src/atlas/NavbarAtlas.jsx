
import { Button } from "@/components/Button";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

import { Link, Outlet, useLocation } from "react-router-dom"

const NavButton = [
    {link: "/atlas/library", label: "Library"},
    {link: "#creations", label: "Search"},
    {link: "#archive", label: "Subscribe"},
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
        <header className={` fixed top-0 left-0 right-0 py-6 ${isScrolled ? "glass-transparent" : "bg-transparent"} z-50`}>
            <nav className="max-w-screen container flex items-center left-0 px-12 right-0 top-0 justify-between mx-auto">
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
                        <Link
                        key={index} 
                        to={button.link} 
                        className=" text-xl px-6 hover:text-bold hover:text-primary hover:scale-130 duration-300" >
                            {button.label}
                        </Link>
                    ))}
                </div>

                {/*Mobile*/}
                <button className="md:hidden text-white" onClick={() => setIsOpen((prev) => !prev)}>
                    {isOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </nav>
            {/*Mobile*/}
            {isOpen && (
                <div className="md:hidden glass absolute top-full left-6 right-6 rounded-lg">
                    <div className="container text-background flex flex-col items-center gap-4 p-4 mx-auto">
                        {NavButton.map((button, index) => (
                            <Link
                            key={index} 
                            to={button.link} 
                            className=" px-6 hover:text-bold hover:scale-130 duration-300" >
                                {button.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}