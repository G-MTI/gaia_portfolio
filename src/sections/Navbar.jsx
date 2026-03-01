
import { Button } from "@/components/Button";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";

const NavButton = [
    {href: "#me", label: "Me"},
    {href: "#creations", label: "Creations"},
    {href: "#experience", label: "Experience"},
    {href: "#contact", label: "Contact"}
] 

export const Navbar = () =>{

    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-6 right-0 py-6">
            <nav className="container flex items-center px-7 mx-auto justify-between">
                {/*schiaccio cambia tema sito?*/}
                <a href="#" className="text-3xl font-bold">LOGO</a>

                {/*Desktop*/}
                
                <div className="hidden md:flex gap-2 items-center ">
                    {NavButton.map((button, index) => (
                        <a 
                        key={index} 
                        href={button.href} 
                        className=" text-xl px-6 hover:text-bold hover:text-primary hover:scale-130 duration-300" >
                            {button.label}
                        </a>
                    ))}
                </div>

                {/*Mobile*/}
                <button className="md:hidden p-2 text-white" onClick={() => setIsOpen((prev) => !prev)}>
                    {isOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </nav>
            {/*Mobile*/}
            {isOpen && (
                <div className="md:hidden glass">
                    <div className="container flex flex-col items-center gap-4 p-4 mx-auto">
                        {NavButton.map((button, index) => (
                            <a 
                            key={index} 
                            href={button.href} 
                            className=" px-6 hover:text-bold hover:text-primary hover:scale-130 duration-300" >
                                {button.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}