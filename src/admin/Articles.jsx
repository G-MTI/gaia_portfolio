
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { supabase } from "@/lib/supabase"

export const Articles = () => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const getArticles = async () => {

    const { data, error } = await supabase
      .from("articles")
      .select(`
        id,
        number,
        title,
        slug,
        excerpt,
        published_at
      `)
      .order("number", { ascending: false })


    if (error) {
      setError(error.message)
    } else {
      setArticles(data ?? [])
    }

    setLoading(false)
  }


  useEffect(() => {
    getArticles()
  }, [])


  const getStatus = (publishedAt) => {

    if (!publishedAt) {
      return {
        label: "Bozza",
        className: "bg-white/10 text-white/60",
      }
    }

    if (new Date(publishedAt) > new Date()) {
      return {
        label: "Programmato",
        className: "bg-yellow-500/10 text-yellow-300",
      }
    }

    return {
      label: "Pubblicato",
      className: "bg-green-500/10 text-green-300",
    }
  }


  if (loading) {
    return (
      <div className="p-10 text-white/50">
        Caricamento articoli...
      </div>
    )
  }


  if (error) {
    return (
      <div className="p-10">
        <p className="text-red-300">
          Errore: {error}
        </p>
      </div>
    )
  }


  return (

    <div className="p-10">

      {/* Header */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <p className="mb-2 text-sm text-white/40">
            Gestione contenuti
          </p>

          <h1 className="text-4xl font-semibold">
            Articoli
          </h1>

        </div>


        <Link
          to="/admin/articles/new"
          className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80"
        >
          + Nuovo articolo
        </Link>

      </div>


      {/* Lista */}

      <div className="overflow-hidden rounded-2xl border border-white/10">

        {articles.length === 0 ? (

          <div className="p-10 text-center text-white/40">
            Nessun articolo presente.
          </div>

        ) : (

          <div>

            {articles.map((article) => {

              const status = getStatus(article.published_at)

              return (

                <div
                  key={article.id}
                  className="flex items-center gap-6 border-b border-white/10 px-6 py-5 last:border-b-0"
                >

                  {/* Numero */}

                  <div className="w-16 shrink-0">

                    <p className="font-mono text-sm text-white/40">
                      {String(article.number).padStart(4, "0")}
                    </p>

                  </div>


                  {/* Titolo */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-medium">
                      {article.title}
                    </p>

                    {article.excerpt && (
                      <p className="mt-1 truncate text-sm text-white/40">
                        {article.excerpt}
                      </p>
                    )}

                  </div>


                  {/* Data */}

                  <div className="hidden w-28 shrink-0 text-sm text-white/40 md:block">

                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString("it-IT")
                      : "—"
                    }

                  </div>


                  {/* Stato */}

                  <div className="w-28 shrink-0">

                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs ${status.className}`}
                    >
                      {status.label}
                    </span>

                  </div>


                  {/* Modifica */}

                  <div className="shrink-0">

                    <Link
                      to={`/admin/articles/${article.id}`}
                      className="text-sm text-white/50 transition hover:text-white"
                    >
                      Modifica →
                    </Link>

                  </div>

                </div>

              )

            })}

          </div>

        )}

      </div>

    </div>

  )
}