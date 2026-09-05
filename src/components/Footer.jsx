import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-white/60">
              © 2026 Gaia — All rights reserved.
            </p>

            <p className="mt-2 text-sm text-white/30">
              Designed & built with ♥︎ by Gaia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/40">

            <a
              href="https://github.com/G-MTI"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/gaia-mazzanti-2b8b74399/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              LinkedIn
            </a>

            <Link
              to="/atlas"
              className="transition hover:text-white"
            >
              Atlas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}