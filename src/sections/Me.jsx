

import {
    Code2,
    Palette,
    Dumbbell,
    TrendingUp,
} from "lucide-react"

import { Link } from "react-router-dom"

const areas = [
  /*}  {
        icon: Code2,
        title: "Tech",
        description:
            "I enjoy building things from scratch, learning how things work, and turning ideas into functional projects.",
    },*/
    {
        icon: Palette,
        title: "Art",
        description:
            "I love drawing, painting, and 3D modeling, art allows me to express myself.",
    },
    {
        icon: Dumbbell,
        title: "Sports",
        description:
            "I like running, going to the gym, and playing tennis. In general, I love any outdoor activity.",
    },
    {
        icon: TrendingUp,
        title: "Finance",
        description:
            "I'm interested in personal finance and investment strategies",
    },
]


export const Me = () => {
    return (
        <section id="me">
            <div className="container mx-auto min-h-screen px-6 py-24 md:px-12 md:py-32">

                <div className="mb-16 flex items-center gap-4">
                    <span className="text-xs tracking-[0.25em] text-white/30">
                        01
                    </span>

                    <div className="h-px w-12 bg-white/20" />

                    <span className="text-xs uppercase tracking-[0.25em] text-primary">
                        About Me
                    </span>
                </div>

                <div className="grid gap-20 lg:grid-cols-2 lg:gap-24">

                    <div>

                        <div className="mt-10 max-w-xl text-base leading-8 text-white/60 md:text-lg">
                            I'm a 19-year-old from Italy with a passion for technology and art. I love combining the two by creating things. I'm currently studying Computer Engineering at Roma Tre University, while open-sourcing my degree through

                            <Link
                                to="/atlas"
                                className="mx-1 text-primary underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary"
                            >
                                Atlas.
                            </Link>
                        </div>
                        <div className="mt-10 max-w-xl text-base leading-8 text-white/60 md:text-lg">

                            I enjoy working on personal projects, where I can experiment with new ideas, learn unfamiliar technologies, and turn what I learn into something real. I like the challenge of starting with an idea and figuring out how to make it work.
                        </div>
                    </div>

                    <div className="border-t border-white/10">
                        {areas.map((area, index) => (
                            <div
                                key={index}
                                className="group grid grid-cols-[45px_1fr] gap-5 border-b border-white/10 py-7 transition"
                            >
                                <div className="pt-1 text-xs text-white/25">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <area.icon
                                            size={16}
                                            strokeWidth={1.5}
                                            className="text-white/30 transition group-hover:text-primary"
                                        />

                                        <h3 className="text-lg font-medium transition group-hover:text-primary">
                                            {area.title}
                                        </h3>
                                    </div>

                                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/40">
                                        {area.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
