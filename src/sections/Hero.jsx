import Star from "../components/Star"


export const Hero = () =>{
    return <section>
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
        <div className=" z-1000">
        <Star />
        </div>
        <div className="z-10 p-16 flex justify-between items-center">
            <div className="fixed bottom-16">
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
            <div className="flex flex-end items-end">
             
            </div>
        </div>
        </div>
    </section>
}