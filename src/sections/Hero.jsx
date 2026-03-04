import Star from "../components/Star"


export const Hero = () =>{
    return <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute opacity-60 text-xs"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `drift ${10 + Math.random() * 20}s ease-in-out infinite`,
                    }}
                >
                    ★
                </div>
            ))}

        {/*Desktop*/}
        <div className="hidden md:flex justify-between items-center">
            <div className="absolute hidden md:flex pointer-events-none">
            <Star />
        </div>
            <div className="min-h-screen flex flex-col justify-center items-start mt-20 ml-16">
                <p className="text-6xl">
                    Hello World!
                </p>
                <h1 className="flex text-9xl font-bold mb-4 mt-4">
                    I'm <h1 className=" ml-8 text-primary"> Gaia</h1>
                </h1>
                <p className="text-6xl">
                    and I love creating things
                </p>
            </div>
        </div>

        {/*Mobile*/}
        <div className="min-h-screen flex md:hidden justify-center items-center">
            <div className=" ">
                <p className="text-3xl">
                    Hello World!
                </p>
                <h1 className="flex text-6xl font-bold">
                    I'm <h1 className=" ml-6 text-primary"> Gaia</h1>
                </h1>
                <p className="text-3xl">
                    and I love creating things
                </p>
            </div>
        </div>
        </div>
    </section>
}