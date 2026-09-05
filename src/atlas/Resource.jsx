
import { useEffect, useState } from "react"

import { Link, useParams } from "react-router-dom"

import { supabase } from "@/lib/supabase"

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v")

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1)

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    return null
  } catch {
    return null
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case "book":
      return "Book"
    case "video":
      return "Video"
    case "paper":
      return "Paper"
    case "website":
      return "Website"
    default:
      return "Resource"
  }
}

export const Resource = () => {
  const { id } = useParams()

  const [source, setSource] = useState(null)
  const [articles, setArticles] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getResource = async () => {
      setLoading(true)
      setError("")

      // Recupera la risorsa
      const { data: sourceData, error: sourceError } = await supabase
        .from("sources")
        .select(`
          id,
          title,
          type,
          author,
          url,
          image_url
        `)
        .eq("id", id)
        .single()

      if (sourceError) {
        setError(sourceError.message)
        setLoading(false)
        return
      }

      setSource(sourceData)

      // Recupera gli articoli collegati
      const { data: relationData, error: relationError } = await supabase
        .from("article_sources")
        .select(`
          article_id
        `)
        .eq("source_id", id)

      if (relationError) {
        setError(relationError.message)
        setLoading(false)
        return
      }

      const articleIds = (relationData ?? []).map(
        (relation) => relation.article_id
      )

      if (articleIds.length === 0) {
        setArticles([])
        setLoading(false)
        return
      }

      // Recupera solo gli articoli pubblicati
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title,
          slug,
          excerpt,
          published_at
        `)
        .in("id", articleIds)
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("number", { ascending: false })

      if (articleError) {
        setError(articleError.message)
        setLoading(false)
        return
      }

      setArticles(articleData ?? [])
      setLoading(false)
    }

    if (id) {
      getResource()
    }
  }, [id])

  if (loading) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-5xl px-6 py-32">
          <p className="text-sm text-white/40">
            Loading resource...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-5xl px-6 py-32">
          <p className="text-sm text-red-300">
            Error: {error}
          </p>

          <Link
            to="/atlas/library"
            className="mt-6 inline-flex text-sm text-white/40 transition hover:text-white"
          >
            ← Back to Library
          </Link>
        </div>
      </section>
    )
  }

  if (!source) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-5xl px-6 py-32">
          <p className="text-white/40">
            Resource not found.
          </p>

          <Link
            to="/atlas/library"
            className="mt-6 inline-flex text-sm text-white/40 transition hover:text-white"
          >
            ← Back to Library
          </Link>
        </div>
      </section>
    )
  }

  const embedUrl =
    source.type === "video"
      ? getYouTubeEmbedUrl(source.url)
      : null

  return (
    <section className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">

        {/* Back */}
        <Link
          to="/atlas/library"
          className="inline-flex text-md text-primary/40 transition hover:text-primary"
        >
          ← Library
        </Link>

        {/* Resource */}
        <div className="mt-12">

          {/* Type */}
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-white/40">
            {getTypeLabel(source.type)}
          </p>

          {/* Title */}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            {source.title}
          </h1>

          {/* Author */}
          {source.author && (
            <p className="mt-5 text-lg text-white/50">
              {source.author}
            </p>
          )}

          {/* Book */}
          {source.type === "book" && (
            <div className="mt-12 grid gap-10 md:grid-cols-[280px_1fr]">

              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {source.image_url ? (
                  <img
                    src={source.image_url}
                    alt={`Cover of ${source.title}`}
                    className="aspect-[3/4] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center">
                    <p className="px-6 text-center text-sm text-white/30">
                      No cover available
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80"
                  >
                    Open resource →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Video */}
          {source.type === "video" && (
            <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-black">
              {embedUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    title={source.title}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-sm text-white/30">
                    Invalid YouTube URL
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paper / Website */}
          {(source.type === "paper" ||
            source.type === "website") && (
            <div className="mt-10">
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80"
                >
                  {source.type === "paper"
                    ? "Open paper →"
                    : "Open website →"}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Articles */}
        <section className="mt-28">

          <div className="mb-8 flex items-center gap-6">
            <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
              Articles using this resource
            </h2>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {articles.length > 0 ? (
            <div>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/atlas/articles/${String(article.number).padStart(4, "0")}`}
                  className="group block border-b border-white/10 py-6 transition"
                >
                  <div className="flex items-start justify-between gap-6">

                    <div>
                      <p className="mb-2 text-sm text-white/30">
                        N° {String(article.number).padStart(4, "0")}
                      </p>

                      <h3 className="text-xl font-medium transition group-hover:text-primary">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                          {article.excerpt}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-white/30 transition group-hover:text-white">
                      →
                    </span>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-b border-white/10 py-10">
              <p className="text-white/40">
                No articles use this resource yet.
              </p>
            </div>
          )}
        </section>

        {/* Count */}
        <div className="mt-8">
          <p className="text-sm text-white/30">
            {articles.length}{" "}
            {articles.length === 1
              ? "article"
              : "articles"}
          </p>
        </div>

      </div>
    </section>
  )
}
