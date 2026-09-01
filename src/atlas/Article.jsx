import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { supabase } from "@/lib/supabase"

import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

export const Article = () => {
  const { number } = useParams()

  const [article, setArticle] = useState(null)
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getArticle = async () => {
      const articleNumber = Number(number)

      if (Number.isNaN(articleNumber)) {
        setError("Numero articolo non valido")
        setLoading(false)
        return
      }

      // Recuperiamo l'articolo
      const { data, error } = await supabase
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

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setArticle(data)

      // Recuperiamo le fonti collegate
      const { data: links, error: linksError } = await supabase
        .from("article_sources")
        .select("source_id, note")
        .eq("article_id", data.id)

        console.log("ARTICLE ID:", data.id)
        console.log("LINKS:", links)
        console.log("LINKS ERROR:", linksError)
            
      if (linksError) {
        setError(linksError.message)
        setLoading(false)
        return
      }

      if (links && links.length > 0) {
        const sourceIds = links.map((link) => link.source_id)
      
        const { data: sourceData, error: sourceError } = await supabase
          .from("sources")
          .select("id, title, type, author, url, description")
          .in("id", sourceIds)
      
        if (sourceError) {
          setError(sourceError.message)
          setLoading(false)
          return
        }
      
        const combinedSources = links.map((link) => ({
          note: link.note,
          source: sourceData.find(
            (source) => source.id === link.source_id
          )
        }))
      
        setSources(combinedSources)
      } else {
        setSources([])
      }

      setLoading(false)
    }

    getArticle()
  }, [number])

  // Loading
  if (loading) {
    return <p>Loading...</p>
  }

  // Errore
  if (error || !article) {
    return <p>Articolo non trovato.</p>
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">

      {/* Numero */}
      <p className="mb-4 text-sm opacity-50">
        {String(article.number).padStart(4, "0")}
      </p>

      {/* Titolo */}
      <h1 className="mb-6 text-4xl font-bold">
        {article.title}
      </h1>

      {/* Descrizione */}
      <p className="mb-10 text-lg opacity-70">
        {article.excerpt}
      </p>

      {/* Contenuto */}
      <div className="leading-8"> 
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex]} 
          components={{ 

            // Titolo principale Markdown # 
            h1: ({ children }) => ( 
              <h1 className="mt-12 mb-6 text-4xl font-bold"> 
                {children} 
              </h1>
            ),
            
            // Titolo secondario Markdown ##
            h2: ({ children }) => (
              <h2 className="mt-10 mb-4 text-3xl font-bold"> 
                {children} 
              </h2>
            ), 
              
            // Titolo terziario Markdown ### 
              h3: ({ children }) => (
                <h3 className="mt-8 mb-3 text-2xl font-semibold"> 
                  {children} 
                </h3>
              ),
            
            // Paragrafi 
            p: ({ children }) => (
              <p className="mb-6 text-lg leading-8"> 
                {children}
              </p>
            ), 
              
            // Liste 
            ul: ({ children }) => (
              <ul className="mb-6 ml-6 list-disc space-y-2 text-lg">
                {children}
              </ul>
            ), 
            ol: ({ children }) => (
              <ol className="mb-6 ml-6 list-decimal space-y-2 text-lg">
                {children}
              </ol>
            ),
            
            // Citazioni
            blockquote: ({ children }) => (
              <blockquote className="my-8 border-l-4 pl-6 italic opacity-70">
                {children} 
              </blockquote>
            ),

            // Codice inline / blocchi di codice
            code: ({ children }) => (
              <code className="rounded bg-black/10 px-1.5 py-0.5 text-sm">
                {children}
              </code>
            ),

            // Link
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {children}
              </a>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Fonti */}
      {sources.length > 0 && (
        <section className="mt-16">

          <h2 className="mb-6 text-2xl font-bold">
            Fonti
          </h2>

          <div className="space-y-4">

            {sources.map((item) => {
              const source = item.source

              return (
                <div key={source.id}>

                  <p className="font-semibold">
                    {source.title}
                  </p>

                  {source.author && (
                    <p className="text-sm opacity-60">
                      {source.author}
                    </p>
                  )}

                  {item.note && (
                    <p className="mt-1 text-sm opacity-60">
                      {item.note}
                    </p>
                  )}

                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      Apri fonte →
                    </a>
                  )}

                </div>
              )
            })}

          </div>

        </section>
      )}

    </article>
  )
}
