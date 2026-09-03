
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { supabase } from "@/lib/supabase"

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export const ArticleEditor = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const isEditing = Boolean(id)

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [publishedAt, setPublishedAt] = useState("")
  const [number, setNumber] = useState(null)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")


  // Recupera articolo quando stiamo modificando

  useEffect(() => {

    if (!isEditing) {
      return
    }

    const getArticle = async () => {

      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title,
          excerpt,
          content,
          published_at
        `)
        .eq("id", id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setNumber(data.number)
      setTitle(data.title ?? "")
      setExcerpt(data.excerpt ?? "")
      setContent(data.content ?? "")

      if (data.published_at) {
        const date = new Date(data.published_at)

        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )

        setPublishedAt(
          localDate.toISOString().slice(0, 16)
        )
      }

      setLoading(false)
    }

    getArticle()

  }, [id, isEditing])


  // Salva articolo

  const handleSave = async (event) => {

    event.preventDefault()

    setSaving(true)
    setError("")
    setSuccess("")


    const articleData = {
      title,
      slug: createSlug(title),
      excerpt,
      content,
      published_at: publishedAt
        ? new Date(publishedAt).toISOString()
        : null,
    }


    if (isEditing) {

      const { error } = await supabase
        .from("articles")
        .update(articleData)
        .eq("id", id)

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Articolo salvato.")
      }

    } else {

      const { data, error } = await supabase
        .from("articles")
        .insert(articleData)
        .select("id")
        .single()

      if (error) {
        setError(error.message)
      } else {
        navigate(`/admin/articles/${data.id}`)
      }

    }

    setSaving(false)

  }


  if (loading) {

    return (
      <div className="p-10 text-white/50">
        Caricamento articolo...
      </div>
    )

  }


  return (

    <div className="p-10">

      {/* Header */}

      <div className="mb-10 flex items-start justify-between">

        <div>

          <Link
            to="/admin/articles"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Articoli
          </Link>

          <h1 className="mt-4 text-4xl font-semibold">
            {isEditing ? "Modifica articolo" : "Nuovo articolo"}
          </h1>

        </div>

        {isEditing && (
          <Link
            to={`/atlas/articles/${number}`}
            className="text-sm text-white/40 transition hover:text-white"
          >
            Visualizza →
          </Link>
        )}

      </div>


      <form
        onSubmit={handleSave}
        className="max-w-4xl space-y-8"
      >

        {/* Titolo */}

        <div>

          <label className="mb-2 block text-sm text-white/60">
            Titolo
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-xl outline-none transition focus:border-white/40"
            placeholder="Titolo dell'articolo"
          />

        </div>

        {isEditing && number !== null && (
  <p className="mt-2 text-sm text-white/40">
    N° {String(number).padStart(4, "0")}
  </p>
)}


        {/* Excerpt */}

        <div>

          <label className="mb-2 block text-sm text-white/60">
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-white/40"
            placeholder="Breve descrizione dell'articolo..."
          />

        </div>


        {/* Contenuto */}

        <div>

          <div className="mb-2 flex items-center justify-between">

            <label className="block text-sm text-white/60">
              Contenuto
            </label>

            <span className="text-xs text-white/30">
              Markdown + LaTeX
            </span>

          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={24}
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-4 font-mono text-sm leading-7 outline-none transition focus:border-white/40"
            placeholder={`# Titolo
              Scrivi qui il contenuto...

              $$
              E = mc^2
              $$`}
          />

        </div>


        {/* Pubblicazione */}

        <div>

          <label className="mb-2 block text-sm text-white/60">
            Data di pubblicazione
          </label>

          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
          />

          <p className="mt-2 text-xs text-white/30">
            Lascia vuoto per salvare come bozza.
            Una data futura programma automaticamente l'articolo.
          </p>

        </div>


        {/* Messaggi */}

        {error && (

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>

        )}

        {success && (

          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>

        )}


        {/* Azioni */}

        <div className="flex items-center gap-4 border-t border-white/10 pt-8">

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Salvataggio..."
              : isEditing
                ? "Salva modifiche"
                : "Crea articolo"
            }
          </button>

          <Link
            to="/admin/articles"
            className="rounded-lg px-6 py-3 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            Annulla
          </Link>

        </div>

      </form>

    </div>

  )
}