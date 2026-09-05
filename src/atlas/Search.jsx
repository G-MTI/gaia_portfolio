
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { supabase } from "@/lib/supabase"

export const Search = () => {
  const [query, setQuery] = useState("")
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const searchArticles = async () => {
      const search = query.trim()

      if (!search) {
        setArticles([])
        setSearched(false)
        setError("")
        return
      }

      setLoading(true)
      setSearched(true)
      setError("")

      const pattern = `%${search}%`
      const now = new Date().toISOString()

      const { data, error: searchError } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title,
          slug,
          excerpt,
          published_at
        `)
        .not("published_at", "is", null)
        .lte("published_at", now)
        .or(
          `title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`
        )
        .order("number", { ascending: false })

      if (searchError) {
        setError(searchError.message)
        setArticles([])
        setLoading(false)
        return
      }

      setArticles(data ?? [])
      setLoading(false)
    }

    const timeout = setTimeout(searchArticles, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <section className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">

        {/* Back to Atlas */}

        <Link
          to="/atlas"
          className="inline-flex text-lg text-primary transition hover:scale-130 hover:text-bold"
        >
          ← Atlas
        </Link>

        {/* Header */}

        <header className="mt-12 max-w-3xl">

          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Search the Atlas.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Find articles by title, description, or content.
          </p>
        </header>

        {/* Search input */}

        <div className="mt-16 border-y border-white/10 py-6">
          <label
            htmlFor="article-search"
            className="sr-only "
          >
            Search articles
          </label>

          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            autoComplete="off"
            className="w-full bg-transparent text-xl outline-none placeholder:text-white/20 md:text-2xl"
          />
        </div>

        {/* Results */}

        {loading && (
          <div className="mt-16">
            <p className="text-sm text-white/40">
              Searching...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-16">
            <p className="text-sm text-red-300">
              Error: {error}
            </p>
          </div>
        )}

        {!loading && !error && searched && (
          <section className="mt-16">

            {/* Results header */}

            <div className="mb-8 flex items-center gap-6">
              <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
                {articles.length}{" "}
                {articles.length === 1 ? "result" : "results"}
              </h2>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Results list */}

            {articles.length > 0 ? (
              <div>
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/atlas/articles/${String(article.number).padStart(4, "0")}`}
                    className="group block border-b border-white/10 py-7 transition"
                  >
                    <article>

                      <div className="flex items-start justify-between gap-6">

                        <div className="min-w-0">

                          <p className="mb-3 text-sm text-white/30">
                            N° {String(article.number).padStart(4, "0")}
                            {article.published_at && (
                              <>
                                <span className="mx-3">·</span>
                                {new Date(
                                  article.published_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </>
                            )}
                          </p>

                          <h3 className="text-2xl font-medium leading-snug transition group-hover:text-primary">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="mt-3 max-w-3xl text-base leading-7 text-white/40">
                              {article.excerpt}
                            </p>
                          )}

                        </div>

                        <span className="shrink-0 pt-8 text-white/30 transition group-hover:text-white">
                          →
                        </span>

                      </div>

                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border-b border-white/10 py-12">
                <p className="text-white/40">
                  No articles found for "{query}".
                </p>
              </div>
            )}

          </section>
        )}

        {/* Empty state before search */}

        {!searched && (
          <div className="mt-16">
            <p className="text-sm text-white/30">
              Start typing to search the articles.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}