
import { useEffect, useRef, useState } from "react"

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

  const contentRef = useRef(null)

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
          date.getTime() -
            date.getTimezoneOffset() * 60000
        )

        setPublishedAt(
          localDate.toISOString().slice(0, 16)
        )
      }

      setLoading(false)
    }

    getArticle()
  }, [id, isEditing])

  const replaceSelection = (
    before,
    after = before
  ) => {
    const textarea = contentRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const selectedText = content.slice(start, end)

    const replacement =
      selectedText.length > 0
        ? `${before}${selectedText}${after}`
        : `${before}${after}`

    const newContent =
      content.slice(0, start) +
      replacement +
      content.slice(end)

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()

      if (selectedText.length > 0) {
        textarea.setSelectionRange(
          start + before.length,
          start +
            before.length +
            selectedText.length
        )
      } else {
        textarea.setSelectionRange(
          start + before.length,
          start + before.length
        )
      }
    })
  }

  const insertAtCursor = (text) => {
    const textarea = contentRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newContent =
      content.slice(0, start) +
      text +
      content.slice(end)

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()

      const cursorPosition =
        start + text.length

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      )
    })
  }

  const formatHeading = (level) => {
    const textarea = contentRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const selectedText = content.slice(start, end)

    if (!selectedText) {
      const prefix =
        level === 2 ? "## " : "### "

      insertAtCursor(prefix)
      return
    }

    const prefix =
      level === 2 ? "## " : "### "

    const replacement =
      `${prefix}${selectedText}`

    const newContent =
      content.slice(0, start) +
      replacement +
      content.slice(end)

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()

      textarea.setSelectionRange(
        start + prefix.length,
        start +
          replacement.length
      )
    })
  }

  const formatList = (ordered = false) => {
    const textarea = contentRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const selectedText = content.slice(start, end)

    if (!selectedText) {
      insertAtCursor(
        ordered ? "1. " : "- "
      )
      return
    }

    const lines = selectedText.split("\n")

    const formattedLines = lines.map(
      (line, index) => {
        if (!line.trim()) {
          return line
        }

        if (ordered) {
          return `${index + 1}. ${line}`
        }

        return `- ${line}`
      }
    )

    const replacement =
      formattedLines.join("\n")

    const newContent =
      content.slice(0, start) +
      replacement +
      content.slice(end)

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()

      textarea.setSelectionRange(
        start,
        start + replacement.length
      )
    })
  }

  const formatQuote = () => {
    const textarea = contentRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const selectedText = content.slice(start, end)

    if (!selectedText) {
      insertAtCursor("> ")
      return
    }

    const lines = selectedText.split("\n")

    const replacement = lines
      .map((line) =>
        line.trim()
          ? `> ${line}`
          : line
      )
      .join("\n")

    const newContent =
      content.slice(0, start) +
      replacement +
      content.slice(end)

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()

      textarea.setSelectionRange(
        start,
        start + replacement.length
      )
    })
  }

  const addLink = () => {
    const textarea = contentRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const selectedText = content.slice(start, end)

    const url = window.prompt(
      "URL del link",
      "https://"
    )

    if (!url || url === "https://") {
      return
    }

    const text =
      selectedText || "link"

    const replacement =
      `[${text}](${url})`

    const newContent =
      content.slice(0, start) +
      replacement +
      content.slice(end)

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()

      textarea.setSelectionRange(
        start,
        start + replacement.length
      )
    })
  }

  const addImage = () => {
    const url = window.prompt(
      "URL dell'immagine"
    )

    if (!url) {
      return
    }

    const alt =
      window.prompt(
        "Descrizione dell'immagine"
      ) || "Image"

    insertAtCursor(
      `![${alt}](${url})`
    )
  }

  const addColor = (color) => {
  replaceSelection(
    `<span style="color: ${color};">`,
    "</span>"
  )
}

  const addFormula = () => {
    insertAtCursor(
      "\n\n$$\nE = mc^2\n$$\n\n"
    )
  }

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
        ? new Date(
            publishedAt
          ).toISOString()
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
        setSuccess(
          "Articolo salvato."
        )
      }
    } else {
      const { data, error } =
        await supabase
          .from("articles")
          .insert(articleData)
          .select("id")
          .single()

      if (error) {
        setError(error.message)
      } else {
        navigate(
          `/admin/articles/${data.id}`
        )
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
      <div className="mb-10 flex items-start justify-between">
        <div>
          <Link
            to="/admin/articles"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Articoli
          </Link>

          <h1 className="mt-4 text-4xl font-semibold">
            {isEditing
              ? "Modifica articolo"
              : "Nuovo articolo"}
          </h1>
        </div>

        {isEditing && (
          <Link
            to={`/atlas/articles/${String(
              number
            ).padStart(4, "0")}`}
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
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-xl outline-none transition focus:border-white/40"
            placeholder="Titolo dell'articolo"
          />

          {isEditing &&
            number !== null && (
              <p className="mt-2 text-sm text-white/40">
                N°{" "}
                {String(number).padStart(
                  4,
                  "0"
                )}
              </p>
            )}
        </div>

        {/* Excerpt */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(event) =>
              setExcerpt(
                event.target.value
              )
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-white/40"
            placeholder="Breve descrizione dell'articolo..."
          />
        </div>

        {/* Contenuto */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm text-white/60">
              Contenuto
            </label>

            <span className="text-xs text-white/30">
              Markdown + LaTeX
            </span>
          </div>

          {/* Toolbar */}

          <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-white/10 bg-white/5 p-2">
            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                replaceSelection(
                  "**",
                  "**"
                )
              }
              className="rounded-lg px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Grassetto"
            >
              B
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                replaceSelection(
                  "*",
                  "*"
                )
              }
              className="rounded-lg px-3 py-2 text-sm italic text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Corsivo"
            >
              I
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                replaceSelection(
                  "`",
                  "`"
                )
              }
              className="rounded-lg px-3 py-2 font-mono text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Codice"
            >
              {"</>"}
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                formatHeading(2)
              }
              className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Titolo H2"
            >
              H2
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                formatHeading(3)
              }
              className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Titolo H3"
            >
              H3
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={formatQuote}
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Citazione"
            >
              “
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                formatList(false)
              }
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Lista puntata"
            >
              •
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                formatList(true)
              }
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Lista numerata"
            >
              1.
            </button>

            <div className="mx-1 h-6 w-px bg-white/10" />

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={addLink}
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Link"
            >
              ↗
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={addImage}
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Immagine"
            >
              ◫
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={addFormula}
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Formula LaTeX"
            >
              Σ
            </button>

            <div className="mx-1 h-6 w-px bg-white/10" />

            {/* Colori */}

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                addColor("var(--color-primary)")
              }
              className="rounded-lg px-3 py-2 text-sm text-primary transition hover:bg-white/10"
              title="Colore principale"
            >
              A
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                addColor("rgb(96 165 250)")
              }
              className="rounded-lg px-3 py-2 text-sm text-blue-400 transition hover:bg-white/10"
              title="Blu"
            >
              A
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                addColor("rgb(192 132 252)")
              }
              className="rounded-lg px-3 py-2 text-sm text-purple-400 transition hover:bg-white/10"
              title="Viola"
            >
              A
            </button>

            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                addColor("rgb(219, 72, 72)")
              }
              className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-white/10"
              title="Rosso"
            >
              A
            </button>
            <button
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                addColor("rgb(93, 255, 104)")
              }
              className="rounded-lg px-3 py-2 text-sm text-green-400 transition hover:bg-white/10"
              title="Verde"
            >
              A
            </button>
          </div>

          <textarea
            ref={contentRef}
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            required
            rows={24}
            className="w-full resize-y rounded-b-xl border border-t-0 border-white/10 bg-white/5 px-5 py-5 text-base leading-8 outline-none transition focus:border-white/40"
            placeholder="Scrivi qui il contenuto..."
          />

          <p className="mt-2 text-xs text-white/30">
            Seleziona una parte del testo e usa
            la barra sopra per formattarla.
          </p>
        </div>

        {/* Pubblicazione */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Data di pubblicazione
          </label>

          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(event) =>
              setPublishedAt(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
          />

          <p className="mt-2 text-xs text-white/30">
            Lascia vuoto per salvare come bozza.
            Una data futura programma automaticamente
            l'articolo.
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
                : "Crea articolo"}
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
