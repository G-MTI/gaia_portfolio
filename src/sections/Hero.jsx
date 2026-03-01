

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

        <div className="container mx-auto p-16 relative z-10">
            <div className="fixed bottom-16">
                <p className="text-6xl">
                    Hello World!
                </p>
                <h1 className="text-9xl font-bold mb-4 mt-4">
                    I'm Gaia
                </h1>
                <p className="text-6xl">
                    and I love creating things
                </p>
            </div>
            <div id="stars">

            </div>
        </div>
        </div>
    </section>
}