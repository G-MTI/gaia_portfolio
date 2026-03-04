
import { ExternalLink} from "lucide-react"
import { Github} from "lucide-react"

const creations = [
    {
        title:"Cicly",
        link:"https://g-mti.github.io/cicly/index.html",
        githubLink: "https://github.com/G-MTI/cicly",
        description: "An educational website designed to provide clear, friendly, and accessible information about the menstrual cycle. This was the first time I built something entirely from scratch.",
        image: "/creations/Cicly.png",
        tags: ["HTML/CSS", "JavaScript"],
    },
    {
        title:"Librify",
        link:"https://g-mti.github.io/Librify/index.html",
        githubLink: "https://github.com/G-MTI/librify",
        description: "A library management system designed to provide a simple and efficient way to track and organize your books",
        image: "/creations/Librify.png",
        tags: ["HTML/CSS", "JavaScript", "API"],
    },
    {
        title:"SMABacktest",
        link:"https://smabacktest.streamlit.app/",
        githubLink: "https://github.com/G-MTI/smabacktest",
        description: "A library management system designed to provide a simple and efficient way to track and organize your books",
        image: "/creations/SMA.png",
        tags: ["Python", "pandas", "Streamlit"],
    },
    {
        title:"Mito della Velocità",
        link:"https://g-mti.github.io/MitoDellaVelocita/",
        githubLink: "https://github.com/G-MTI/MitoDellaVelocita", 
        description: "A library management system designed to provide a simple and efficient way to track and organize your books",
        image: "/creations/mitoVelocita.png",
        tags: ["HTML/CSS"],
    },
    {
        title:"CompoundInterestCalculator",
        link:"https://g-mti.github.io/CompoundInterestCalculator/calculator.html",
        githubLink: "https://github.com/G-MTI/CompoundInterestCalculator",
        description: "A library management system designed to provide a simple and efficient way to track and organize your books",
        image: "/creations/CIC.png",
        tags: ["HTML/CSS", "JavaScript"],
    },
    
]

export const Creations = () =>{
    return <section id="creations" className="py-32 relative overflow-hidden">
 
    <div className="container mx-auto px-12 relative z-10">
        <div className="text-center text-xl text-primary text-bold mb-4 uppercase mx-auto mb-12">
            <h2>My latest projects that</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            {creations.map((creation, idx) => (
                <a
                    key={idx}
                    href={creation.link}
                    className="group glass-light rounded-2xl overflow-hidden "
            
                >
                    {/* img */}
                    <div className="container flex items-center justify-center relative">
                    <div className="relative overflow-hidden group-hover:scale-105 duration-500">
                          <img
                              src={creation.image}
                              alt={creation.title}
                              className=""
                          />
                    </div>
                    {/* link */}
                    <div className="absolute inset-0 flex justify-center items-center gap-6 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <a href={creation.link} className="p-2 rounded-full bg-white hover:bg-primary flex items-center justify-center">
                            <ExternalLink size={16} /> 
                        </a>
                        <a href={creation.githubLink} className="p-2 rounded-full bg-white hover:bg-primary flex items-center justify-center">
                            <Github size={16} /> 
                        </a>

                    </div>
                    </div>
                    {/* info */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white">{creation.title}</h3>
                        <p className="text-gray-300 mt-2">{creation.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {creation.tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-primary/60 text-white text-sm rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </a>
            ))}
        </div>
    </div>
</section>
}