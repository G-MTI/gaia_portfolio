
import { ExternalLink } from "lucide-react"
import { GitGraph } from "lucide-react"

const creations = [
    {
        title:"FinanceDashboard",
        link:"[https://finance-dashboard-theta-mocha.vercel.app/](https://finance-dashboard-theta-mocha.vercel.app/)",
        githubLink: "[https://github.com/G-MTI/financeDashboard](https://github.com/G-MTI/financeDashboard)",
        description: "A web app to track income and expenses and to visualize them with charts.",
        image: "/creations/financeDashboard.png",
        tags: ["React","Vite" , "Recharts", "Tailwind CSS"],
    },
    {
        title:"SMABacktest",
        link:"[https://smabacktest.streamlit.app/](https://smabacktest.streamlit.app/)",
        githubLink: "[https://github.com/G-MTI/smabacktest](https://github.com/G-MTI/smabacktest)",
        description: "A web application built with Streamlit that allows users to backtest a simple moving average (SMA) trading strategy on historical stock data.",
        image: "/creations/SMA.png",
        tags: ["Python", "pandas", "Streamlit"],
    },
    {
        title:"Cicly",
        link:"[https://g-mti.github.io/cicly/index.html](https://g-mti.github.io/cicly/index.html)",
        githubLink: "[https://github.com/G-MTI/cicly](https://github.com/G-MTI/cicly)",
        description: "An educational website designed to provide clear, friendly, and accessible information about the menstrual cycle. This was the first time I built something entirely from scratch.",
        image: "/creations/Cicly.png",
        tags: ["HTML/CSS", "JavaScript"],
    },
    {
        title:"Librify",
        link:"[https://g-mti.github.io/Librify/index.html](https://g-mti.github.io/Librify/index.html)",
        githubLink: "[https://github.com/G-MTI/librify](https://github.com/G-MTI/librify)",
        description: "A library management system designed to provide a simple and efficient way to track and organize your books",
        image: "/creations/Librify.png",
        tags: ["HTML/CSS", "JavaScript", "API"],
    },
    {
        title:"Mito della Velocità",
        link:"[https://g-mti.github.io/MitoDellaVelocita/](https://g-mti.github.io/MitoDellaVelocita/)",
        githubLink: "[https://github.com/G-MTI/MitoDellaVelocita](https://github.com/G-MTI/MitoDellaVelocita)", 
        description: "My first website, created for an Italian Air Force competition, thanks to this site my school ranked third.",
        image: "/creations/mitoVelocita.png",
        tags: ["HTML/CSS"],
    },
    {
        title:"CompoundInterestCalculator",
        link:"[https://g-mti.github.io/CompoundInterestCalculator/calculator.html](https://g-mti.github.io/CompoundInterestCalculator/calculator.html)",
        githubLink: "[https://github.com/G-MTI/CompoundInterestCalculator](https://github.com/G-MTI/CompoundInterestCalculator)",
        description: "A simple compound interest calculator, it allows users to calculate the future value of an investment based on specified parameters.",
        image: "/creations/CIC.png",
        tags: ["HTML/CSS", "JavaScript"],
    },
]

export const Creations = () => {
    return (
        <section
            id="creations"
            className="relative overflow-hidden py-32"
        >
            <div className="container relative z-10 mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="mb-16 flex items-center gap-4">
                    <span className="text-xs tracking-[0.25em] text-white/30">
                        02
                    </span>

                    <div className="h-px w-12 bg-white/20" />

                    <span className="text-xs uppercase tracking-[0.25em] text-primary">
                        Creations
                    </span>
                </div>

                <div className="mb-16">
                    <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
                        Things I've{" "}
                        <span className="text-white/30">built.</span>
                    </h2>
                </div>

                {/* Projects */}
                <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
                    {creations.map((creation, idx) => (
                        <article
                            key={idx}
                            className="group"
                        >
                            {/* Image */}
                            <a
                                href={creation.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden border border-white/10 bg-white/[0.03]"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={creation.image}
                                        alt={creation.title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition duration-500 group-hover:opacity-100">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:bg-primary">
                                            <ExternalLink size={16} />
                                        </span>
                                    </div>
                                </div>
                            </a>

                            {/* Info */}
                            <div className="mt-5 border-t border-white/10 pt-5">

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-white/25">
                                                {String(idx + 1).padStart(2, "0")}
                                            </span>

                                            <h3 className="text-xl font-medium transition group-hover:text-primary">
                                                {creation.title}
                                            </h3>
                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-white/40">
                                            {creation.description}
                                        </p>
                                    </div>

                                    <a
                                        href={creation.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`View ${creation.title} on GitHub`}
                                        className="mt-1 shrink-0 text-white/30 transition hover:text-white"
                                    >
                                        <GitGraph size={16} />
                                    </a>
                                </div>

                                {/* Tags */}
                                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                                    {creation.tags.map((tag, tagIdx) => (
                                        <span
                                            key={tagIdx}
                                            className="text-xs uppercase tracking-[0.1em] text-white/25"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}
