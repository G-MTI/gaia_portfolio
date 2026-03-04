import { Code2} from "lucide-react"

const areas = [
    {icon: Code2, title: "Tech", description: "Me"},
    {icon: Code2, title: "Art", description: "Creations"},
    {icon: Code2, title: "Sports", description: "Experience"},
    {icon: Code2, title: "Finance", description: "Contact"},
] 
 
export const Me = () =>{
    return <section id="me">
        <div className="container min-h-screen flex items-center px-12 mx-auto overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-6">
                <div>
                    <div className="text-xl text-primary text-bold mb-4 uppercase">
                        About Me
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti in illo rem quo. Consequatur id voluptas voluptatibus, nemo earum a doloremque inventore nam corporis exercitationem recusandae fugit quae. Sequi, aliquid?
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti in illo rem quo. Consequatur id voluptas voluptatibus, nemo earum a doloremque inventore nam corporis exercitationem recusandae fugit quae. Sequi, aliquid?
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti in illo rem quo. Consequatur id voluptas voluptatibus, nemo earum a doloremque inventore nam corporis exercitationem recusandae fugit quae. Sequi, aliquid?
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