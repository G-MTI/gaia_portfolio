import { Code2} from "lucide-react"

const areas = [
    {icon: Code2, title: "Tech", description: "I spend a lot of time learning new tools, I like designing websites and creating small robots"},
    {icon: Code2, title: "Art", description: "I love drawing, painting, and 3D modeling, art allows me to express myself."},
    {icon: Code2, title: "Sports", description: "I like running, going to the gym, and playing tennis. In general, I love any outdoor activity."},
    {icon: Code2, title: "Finance", description: "I'm interested in personal finance and investment strategies"},
] 
 
export const Me = () =>{
    return <section id="me">
        <div className="container min-h-screen flex items-center pt-20 px-12 mx-auto overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 flex items-center">
                <div>
                    <div className="text-xl text-primary text-bold mb-4 uppercase">
                        About Me
                    </div>
                    <div>
                        I'm a last year student in high school with a passion for technology and art. I love combining the two by creating things. I'm interested in economics and science, and I also love drawing, sports, and traveling: activities that inspire my creativity and help me approach problems with curiosity and new perspectives.
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    {areas.map((area, index) => (
                        <div key={index} className="glass-light rounded-2xl p-4 flex flex-col justify-center hover:bg-primary/60">
                            <div className="p-2 rounded-xl bg-primary/50 flex items-center justify-center w-max  duration-250">
                                <area.icon size={16}/>
                            </div>
                            <div className="text-lg font-semibold mt-1">
                                {area.title}
                            </div>
                            <div className="text-sm">
                                {area.description}
                            </div>
                        </div>
                    ))}
                </div> 
            </div>
        </div>
    </section>
}