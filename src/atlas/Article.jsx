
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { supabase } from "@/lib/supabase"

import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import "katex/dist/katex.min.css"

export const Article = () => {
  const { number } = useParams()

  const [article, setArticle] = useState(null)
  const [sources, setSources] = useState([])
  const [previousArticle, setPreviousArticle] = useState(null)
  const [nextArticle, setNextArticle] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true)
      setError(null)

      const articleNumber = Number(number)

      if (Number.isNaN(articleNumber)) {
        setError("Invalid article number")
        setLoading(false)
        return
      }

      // --------------------------------------------------
      // ARTICLE
      // --------------------------------------------------

      const { data, error: articleError } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title,
          slug,
          excerpt,
          content,
          published_at
        `)
        .eq("number", articleNumber)
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .single()

      if (articleError) {
        setError(articleError.message)
        setLoading(false)
        return
      }

      setArticle(data)

      // --------------------------------------------------
      // SOURCES
      // --------------------------------------------------

      const { data: links, error: linksError } = await supabase
        .from("article_sources")
        .select("source_id, note")
        .eq("article_id", data.id)

      if (linksError) {
        setError(linksError.message)
        setLoading(false)
        return
      }

      if (links && links.length > 0) {
        const sourceIds = links.map((link) => link.source_id)

        const { data: sourceData, error: sourceError } =
          await supabase
            .from("sources")
            .select(`
              id,
              title,
              type,
              author,
              url,
              description,
              image_url
            `)
            .in("id", sourceIds)

        if (sourceError) {
          setError(sourceError.message)
          setLoading(false)
          return
        }

        const combinedSources = links
          .map((link) => ({
            note: link.note,
            source: sourceData.find(
              (source) => source.id === link.source_id
            ),
          }))
          .filter((item) => item.source)

        setSources(combinedSources)
      } else {
        setSources([])
      }

      // --------------------------------------------------
      // PREVIOUS ARTICLE
      // --------------------------------------------------

      const { data: previousData } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title
        `)
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .lt("number", articleNumber)
        .order("number", { ascending: false })
        .limit(1)
        .maybeSingle()

      setPreviousArticle(previousData ?? null)

      // --------------------------------------------------
      // NEXT ARTICLE
      // --------------------------------------------------

      const { data: nextData } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title
        `)
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .gt("number", articleNumber)
        .order("number", { ascending: true })
        .limit(1)
        .maybeSingle()

      setNextArticle(nextData ?? null)

      setLoading(false)
    }

    getArticle()
  }, [number])

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-6 py-32">
          <p className="text-sm text-white/40">
            Loading article...
          </p>
        </div>
      </section>
    )
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !article) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-6 py-32">

          <p className="text-sm text-white/40">
            Article not found.
          </p>

          <Link
            to="/atlas"
            className="mt-6 inline-flex text-sm text-white/40 transition hover:text-white"
          >
            ← Back to Atlas
          </Link>

        </div>
      </section>
    )
  }

  // --------------------------------------------------
  // ARTICLE
  // --------------------------------------------------

  return (
    <article className="min-h-screen">

      <div className="mx-auto w-full max-w-3xl px-6 py-24 md:py-32">

        {/* Back */}

        <Link
          to="/atlas"
          className="inline-flex text-sm text-white/40 transition hover:text-white"
        >
          ← Atlas
        </Link>

        {/* Header */}

        <header className="mt-16">

          <div className="mb-6 flex items-center gap-6">
            <p className=" text-sm uppercase tracking-[0.2em] text-white/40">
              N° {String(article.number).padStart(4, "0")}
            </p>
    
            {article.published_at && (
              <p className=" text-sm text-white/40">
                {new Date(article.published_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            )}
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50 md:text-xl">
              {article.excerpt}
            </p>
          )}

          

        </header>

        {/* Divider */}

        <div className="my-12 h-px bg-white/10" />

        {/* Content */}

        <div className="article-content">

          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}

            components={{

              h1: ({ children }) => (
                <h2 className="mt-16 mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
                  {children}
                </h2>
              ),

              h2: ({ children }) => (
                <h2 className="mt-14 mb-5 text-2xl font-semibold tracking-tight md:text-3xl">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="mt-10 mb-4 text-xl font-semibold md:text-2xl">
                  {children}
                </h3>
              ),

              p: ({ children }) => (
                <p className="mb-7 text-lg leading-8 text-white/80">
                  {children}
                </p>
              ),

              ul: ({ children }) => (
                <ul className="mb-7 ml-6 list-disc space-y-3 text-lg leading-8 text-white/80">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="mb-7 ml-6 list-decimal space-y-3 text-lg leading-8 text-white/80">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="pl-2">
                  {children}
                </li>
              ),

              blockquote: ({ children }) => (
                <blockquote className="my-10 border-l border-white/30 pl-6 text-lg italic leading-8 text-white/50">
                  {children}
                </blockquote>
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-white">
                  {children}
                </strong>
              ),

              em: ({ children }) => (
                <em className="italic">
                  {children}
                </em>
              ),

              code: ({ children }) => (
                <code className="rounded-md bg-white/10 px-1.5 py-1 font-mono text-[0.9em] text-white/80">
                  {children}
                </code>
              ),

              pre: ({ children }) => (
                <pre className="my-10 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-sm leading-7">
                  {children}
                </pre>
              ),

              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
                >
                  {children}
                </a>
              ),

              img: ({ src, alt }) => (
                <figure className="my-10">
                  <img
                    src={src}
                    alt={alt || ""}
                    loading="lazy"
                    className="w-full rounded-xl border border-white/10"
                  />
                  {alt && (
                    <figcaption className="mt-3 text-sm text-white/30">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              ),

              hr: () => (
                <hr className="my-14 border-0 border-t border-white/10" />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>

        </div>

        {/* Sources */}

        {sources.length > 0 && (
          <section className="mt-24">

            <div className="mb-8 flex items-center gap-6">

              <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
                Sources
              </h2>

              <div className="h-px flex-1 bg-white/10" />

            </div>

            <div className="space-y-8">

              {sources.map((item) => {
                const source = item.source

                return (
                  <div
                    key={source.id}
                    className="border-b border-white/10 pb-8"
                  >

                    <div className="flex items-start justify-between gap-6">

                      <div>

                        <p className="text-lg font-medium">
                          {source.title}
                        </p>

                        {source.author && (
                          <p className="mt-1 text-sm text-white/40">
                            {source.author}
                          </p>
                        )}

                        {item.note && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                            {item.note}
                          </p>
                        )}

                      </div>

                      <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-white/30">
                        {source.type}
                      </span>

                    </div>

                    <Link
                      to={`/atlas/library/${source.id}`}
                      className="mt-4 inline-flex text-sm text-white/40 transition hover:text-white"
                    >
                      Open resource →
                    </Link>

                  </div>
                )
              })}

            </div>

          </section>
        )}

        {/* Previous / Next */}

        <nav className="mt-24 border-t border-white/10 pt-8">

          <div className="grid gap-8 sm:grid-cols-2">

            {/* Previous */}

            <div>

              {previousArticle ? (
                <Link
                  to={`/atlas/articles/${String(previousArticle.number).padStart(4, "0")}`}
                  className="group block"
                >

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
                    Previous
                  </p>

                  <p className="text-lg font-medium transition group-hover:text-primary">
                    {previousArticle.title}
                  </p>

                  <p className="mt-2 text-sm text-white/30">
                    N° {String(previousArticle.number).padStart(4, "0")} ←
                  </p>

                </Link>
              ) : (
                <div />
              )}

            </div>

            {/* Next */}

            <div className="sm:text-right">

              {nextArticle ? (
                <Link
                  to={`/atlas/articles/${String(nextArticle.number).padStart(4, "0")}`}
                  className="group block"
                >

                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
                    Next
                  </p>

                  <p className="text-lg font-medium transition group-hover:text-primary">
                    {nextArticle.title}
                  </p>

                  <p className="mt-2 text-sm text-white/30">
                    → N° {String(nextArticle.number).padStart(4, "0")}
                  </p>

                </Link>
              ) : (
                <div />
              )}

            </div>

          </div>

        </nav>

      </div>

    </article>
  )
}
