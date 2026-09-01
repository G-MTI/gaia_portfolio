import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

export const Home = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, number, title, slug, excerpt, published_at")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("number", { ascending: false })
        .range(0, 19)

      if (error) {
        setError(error.message)
      } else {
        setArticles(data ?? [])
      }

      setLoading(false)
    }

    getArticles()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Errore: {error}</p>
  }

  return (
    <section className="relative min-h-screen overflow-hidden ">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">

        <h1 className="mb-12 text-4xl font-bold">
          Road to engineer
        </h1>

        <h1 className="mb-12 text-4xl font-bold">
          n° log
        </h1>

        <div className=" flex flex-row flex-wrap justify-center gap-6">
          {articles.map((article) => (
            <Link to={`/atlas/articles/${String(article.number).padStart(4, "0")}`}>
              <article className="border-1 border-white rounded-lg p-6 text-white transition hover:bg-neutral-800 hover:text-primary" key={article.id} >

              <p className="mb-2 text-sm opacity-50">
                N°
                <span className="mx-0.5"></span>
                {String(article.number).padStart(4, "0")}
                <span className="mx-3">-</span>
                {new Date(article.published_at).toLocaleDateString("it-IT")}
              </p>

              <h2 className="mb-3 text-2xl font-bolds">
                {article.title}
              </h2>

              <p className="mb-4 opacity-70">
                {article.excerpt}
              </p>
 
            </article>
            </Link>
            
          ))}
        </div>

      </div>
    </section>
  )
}