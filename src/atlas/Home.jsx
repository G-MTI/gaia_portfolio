import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { supabase } from "@/lib/supabase"

const PAGE_SIZE = 20

export const Home = () => {
  const [articles, setArticles] = useState([])
  const [totalArticles, setTotalArticles] = useState(0)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const getArticles = async (from = 0, append = false) => {
    const { data, count, error } = await supabase
      .from("articles")
      .select(
        "id, number, title, slug, excerpt, published_at",
        { count: "exact" }
      )
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("number", { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      setError(error.message)
      return
    }

    if (append) {
      setArticles((current) => [...current, ...(data ?? [])])
    } else {
      setArticles(data ?? [])
    }

    setTotalArticles(count ?? 0)
  }

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true)
      await getArticles(0, false)
      setLoading(false)
    }

    loadArticles()
  }, [])

  const handleLoadMore = async () => {
    setLoadingMore(true)

    await getArticles(articles.length, true)

    setLoadingMore(false)
  }

  const hasMore = articles.length < totalArticles

  if (loading) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <p className="text-sm text-white/40">
            Loading atlas...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <p className="text-sm text-red-300">
            Error: {error}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen sm:px-16 ">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">

        {/* Intro + Stats */}
        <header className="grid lg:grid-cols-2 gap-12 flex items-center mt-12 mb-20">

            <div className="flex flex-col ">
              <p className="mb-6 text-5xl uppercase text-primary font-bold tracking-[0.2em]">
                Atlas
              </p>

              <h1 className=" font-semibold tracking-tight">
                - Road to engineer
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/70">
                A daily record of my journey through computer engineering:
                concepts, problems, experiments, and everything I learn
                along the way.
              </p>
            </div>

            {/* Articles counter */}
            <div className="flex flex-col gap-6 ">
              <div className=" rounded-2xl border border-white/40 px-8 py-6">
                <p className="text-4xl font-semibold">
                  {totalArticles}
                </p>

                <p className="mt-1 text-sm text-white/70">
                  Articles
                </p>
              </div>

              <div className="rounded-2xl border border-white/40 px-8 py-6">
                <p className="text-4xl font-semibold">
                  {/*{totalExams}*/} -
                </p>

                <p className="mt-1 text-sm text-white/70">
                  Exams
                </p>
              </div>
            </div>
        </header>

        {/* Recent articles divider */}
        <div className="mb-8 flex items-center gap-6">
          <div className="h-px flex-1 bg-white/10" />

          <p className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
            Recent articles
          </p>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Articles */}
        <div>
          {articles.length === 0 ? (
            <div className="py-16">
              <p className="text-white/40">
                No articles published yet.
              </p>
            </div>
          ) : (
            <div>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/atlas/articles/${String(article.number).padStart(4, "0")}`}
                  className="group block border-b border-white/10 py-8 transition"
                >
                  <article>
                    <div className="mb-3 flex items-center gap-3 text-sm text-white/40">
                      <span className="font-mono">
                        {String(article.number).padStart(4, "0")}
                      </span>

                      <span>—</span>

                      <time dateTime={article.published_at}>
                        {new Date(
                          article.published_at
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <h2 className="text-2xl font-medium transition group-hover:text-primary">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="mt-3 max-w-2xl leading-7 text-white/50">
                        {article.excerpt}
                      </p>
                    )}

                    <p className="mt-4 text-sm text-white/30 transition group-hover:text-white/60">
                      Read article →
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center py-12">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-lg border border-white/10 px-6 py-3 text-sm text-white/60 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loadingMore
                ? "Loading..."
                : "Load more"}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}