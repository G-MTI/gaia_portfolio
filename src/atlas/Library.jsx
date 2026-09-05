import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { supabase } from "@/lib/supabase"

const sourceTypes = [
  { value: "all", label: "All" },
  { value: "book", label: "Books" },
  { value: "video", label: "Videos" },
  { value: "paper", label: "Papers" },
  { value: "website", label: "Websites" },
]

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

const BookCard = ({ source }) => {
  return (
    <Link
      to={`/atlas/library/${source.id}`}
      className="group block"
    >
      <article>
        <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {source.image_url ? (
            <img
              src={source.image_url}
              alt={`Cover of ${source.title}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="px-6 text-center text-sm text-white/30">
                No cover available
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm text-white/40 transition group-hover:text-primary">
            Show resource →
          </p>
        </div>
      </article>
    </Link>
  )
}

const VideoCard = ({ source }) => {
  const embedUrl = getYouTubeEmbedUrl(source.url)

  if (!embedUrl) {
    return (
      <article className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="flex aspect-video items-center justify-center">
          <p className="text-sm text-white/30">
            Invalid YouTube URL
          </p>
        </div>
      </article>
    )
  }

  return (
    <article>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
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
      </div>

      <Link
        to={`/atlas/library/${source.id}`}
        className="mt-4 inline-flex text-sm text-white/40 transition hover:text-primary"
      >
        Show resource →
      </Link>
    </article>
  )
}

const SimpleCard = ({ source }) => {
  return (
    <Link
      to={`/atlas/library/${source.id}`}
      className="group block border-b border-white/10 py-6"
    >
      <article>
        <div className="flex items-center justify-between gap-6">
          <h3 className="text-xl font-medium leading-snug transition group-hover:text-primary">
            {source.title}
          </h3>

          <span className="shrink-0 text-sm text-white/40 transition group-hover:text-white">
            →
          </span>
        </div>
      </article>
    </Link>
  )
}

export const Library = () => {
  const [sources, setSources] = useState([])
  const [activeType, setActiveType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getSources = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("sources")
        .select(`
          id,
          title,
          type,
          author,
          url,
          image_url
        `)
        .neq("type", "course")
        .order("title", { ascending: true })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSources(data ?? [])
      setLoading(false)
    }

    getSources()
  }, [])

  const filteredSources =
    activeType === "all"
      ? sources
      : sources.filter((source) => source.type === activeType)

  const books = filteredSources.filter(
    (source) => source.type === "book"
  )

  const videos = filteredSources.filter(
    (source) => source.type === "video"
  )

  const papers = filteredSources.filter(
    (source) => source.type === "paper"
  )

  const websites = filteredSources.filter(
    (source) => source.type === "website"
  )

  if (loading) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-6xl px-6 py-32">
          <p className="text-sm text-white/40">
            Loading library...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen">
        <div className="mx-auto w-full max-w-6xl px-6 py-32">
          <p className="text-sm text-red-300">
            Error: {error}
          </p>
        </div>
      </section>
    )
  }

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
            The resources behind the journey.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            everything I use to understand
            the concepts I write about in Atlas.
          </p>
        </header>

        {/* Filters */}
        <div className="mt-16 flex flex-wrap gap-2 border-y border-white/10 py-5">
          {sourceTypes.map((type) => {
            const active = activeType === type.value

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setActiveType(type.value)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-primary text-black"
                    : "text-white/50 hover:bg-primary/10 hover:text-white"
                }`}
              >
                {type.label}
              </button>
            )
          })}
        </div>

        {/* Books */}
        {books.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-center gap-6">
              <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
                Books
              </h2>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {books.map((source) => (
                <BookCard
                  key={source.id}
                  source={source}
                />
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-center gap-6">
              <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
                Videos
              </h2>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {videos.map((source) => (
                <VideoCard
                  key={source.id}
                  source={source}
                />
              ))}
            </div>
          </section>
        )}

        {/* Papers */}
        {papers.length > 0 && (
          <section className="mt-24">
            <div className="mb-2 flex items-center gap-6">
              <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
                Papers
              </h2>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div>
              {papers.map((source) => (
                <SimpleCard
                  key={source.id}
                  source={source}
                />
              ))}
            </div>
          </section>
        )}

        {/* Websites */}
        {websites.length > 0 && (
          <section className="mt-24">
            <div className="mb-2 flex items-center gap-6">
              <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/40">
                Websites
              </h2>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div>
              {websites.map((source) => (
                <SimpleCard
                  key={source.id}
                  source={source}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filteredSources.length === 0 && (
          <div className="mt-20 border-b border-white/10 py-16">
            <p className="text-white/40">
              No resources in this category yet.
            </p>
          </div>
        )}

        {/* Count */}
        <div className="mt-24 border-t border-white/10 pt-6">
          <p className="text-sm text-white/30">
            {filteredSources.length}{" "}
            {filteredSources.length === 1
              ? "resource"
              : "resources"}
          </p>
        </div>
      </div>
    </section>
  )
}