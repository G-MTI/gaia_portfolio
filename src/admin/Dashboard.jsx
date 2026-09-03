
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { supabase } from "@/lib/supabase"

export const Dashboard = () => {

  const [stats, setStats] = useState({
    articles: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {

    const getStats = async () => {

      const { data, error } = await supabase
        .from("articles")
        .select("published_at")

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }


      const now = new Date()

      const articles = data ?? []

      const published = articles.filter(
        (article) =>
          article.published_at &&
          new Date(article.published_at) <= now
      )

      const drafts = articles.filter(
        (article) => !article.published_at
      )

      const scheduled = articles.filter(
        (article) =>
          article.published_at &&
          new Date(article.published_at) > now
      )


      setStats({
        articles: articles.length,
        published: published.length,
        drafts: drafts.length,
        scheduled: scheduled.length,
      })

      setLoading(false)
    }


    getStats()

  }, [])


  if (loading) {
    return (
      <div className="p-10 text-white/50">
        Caricamento dashboard...
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

      <div className="mb-10">

        <p className="mb-2 text-sm text-white/40">
          Atlas Admin
        </p>

        <h1 className="text-4xl font-semibold text-primary">
          Dashboard
        </h1>

      </div>


      {/* Statistiche */}

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border border-white/10 p-6">

          <p className="text-sm text-white/40">
            Articoli
          </p>

          <p className="mt-3 text-4xl font-semibold">
            {stats.articles}
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 p-6">

          <p className="text-sm text-white/40">
            Pubblicati
          </p>

          <p className="mt-3 text-4xl font-semibold">
            {stats.published}
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 p-6">

          <p className="text-sm text-white/40">
            Bozze
          </p>

          <p className="mt-3 text-4xl font-semibold">
            {stats.drafts}
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 p-6">

          <p className="text-sm text-white/40">
            Programmati
          </p>

          <p className="mt-3 text-4xl font-semibold">
            {stats.scheduled}
          </p>

        </div>

      </div>


      {/* Azione principale */}

      <div className="mt-8 rounded-2xl border border-white/10 p-8">

        <p className="text-sm text-white/40">
          Pubblica qualcosa di nuovo
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Scrivi il prossimo articolo
        </h2>

        <p className="mt-2 max-w-xl text-white/50">
          Crea una nuova scheda per documentare ciò che hai imparato oggi.
        </p>

        <Link
          to="/admin/articles/new"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80"
        >
          + Nuovo articolo
        </Link>

      </div>

    </div>

  )
}
