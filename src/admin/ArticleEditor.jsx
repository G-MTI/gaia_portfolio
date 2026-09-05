
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

  // Exams
  const [exams, setExams] = useState([])
  const [examId, setExamId] = useState("")

  // Sources
  const [selectedSources, setSelectedSources] = useState([])
  const [sourceSearch, setSourceSearch] = useState("")
  const [sourceResults, setSourceResults] = useState([])
  const [searchingSources, setSearchingSources] = useState(false)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Preview confirmation
  const [showPreviewConfirm, setShowPreviewConfirm] = useState(false)

  //Control+S shortcut for saving
  useEffect(() => {
  const handleShortcut = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault()

      const form = document.querySelector("form")

      if (form) {
        form.requestSubmit()
      }
    }
  }

  window.addEventListener("keydown", handleShortcut)

  return () => {
    window.removeEventListener("keydown", handleShortcut)
  }
}, [])

  /*
   * Load exams
   */
  useEffect(() => {
    const getExams = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("id, name")
        .order("name", { ascending: true })

      if (error) {
        setError(error.message)
        return
      }

      setExams(data ?? [])
    }

    getExams()
  }, [])

  /*
   * Load article when editing
   */
  useEffect(() => {
    if (!isEditing) {
      setLoading(false)
      return
    }

    const getArticle = async () => {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          number,
          title,
          excerpt,
          content,
          published_at,
          exam_id
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
      setExamId(data.exam_id ?? "")

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

      /*
       * Load connected sources
       */
      const {
        data: relationData,
        error: relationError,
      } = await supabase
        .from("article_sources")
        .select(`
          source_id,
          note,
          sources (
            id,
            title,
            type,
            author,
            url,
            image_url
          )
        `)
        .eq("article_id", id)

      if (relationError) {
        setError(relationError.message)
        setLoading(false)
        return
      }

      const connectedSources =
        (relationData ?? [])
          .map((relation) => ({
            ...relation.sources,
            note: relation.note ?? "",
          }))
          .filter(Boolean)

      setSelectedSources(connectedSources)

      setLoading(false)
    }

    getArticle()
  }, [id, isEditing])

  /*
   * Search sources
   */
  useEffect(() => {
    const searchSources = async () => {
      const search = sourceSearch.trim()

      if (!search) {
        setSourceResults([])
        setSearchingSources(false)
        return
      }

      setSearchingSources(true)

      const pattern = `%${search
        .replace(/[%_]/g, "\\$&")
        .replace(/[,()]/g, " ")}%`

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
        .or(
          `title.ilike.${pattern},author.ilike.${pattern}`
        )
        .order("title", { ascending: true })
        .limit(20)

      if (error) {
        setError(error.message)
        setSourceResults([])
        setSearchingSources(false)
        return
      }

      const selectedIds = new Set(
        selectedSources.map((source) => source.id)
      )

      const filteredResults = (data ?? []).filter(
        (source) => !selectedIds.has(source.id)
      )

      setSourceResults(filteredResults)
      setSearchingSources(false)
    }

    const timeout = setTimeout(
      searchSources,
      250
    )

    return () => clearTimeout(timeout)
  }, [sourceSearch, selectedSources])

  /*
   * Add source
   */
  const addSource = (source) => {
    const alreadySelected =
      selectedSources.some(
        (item) => item.id === source.id
      )

    if (alreadySelected) {
      return
    }

    setSelectedSources((current) => [
      ...current,
      source,
    ])

    setSourceSearch("")
    setSourceResults([])
  }

  /*
   * Remove source
   */
  const removeSource = (sourceId) => {
    setSelectedSources((current) =>
      current.filter(
        (source) => source.id !== sourceId
      )
    )
  }

  /*
   * Formatting helpers
   */
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

    const prefix =
      level === 2 ? "## " : "### "

    if (!selectedText) {
      insertAtCursor(prefix)
      return
    }

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
        start + replacement.length
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

  /*
   * Save article + source relations
   */
  const saveSourceRelations = async (
    articleId
  ) => {
    const { error: deleteError } =
      await supabase
        .from("article_sources")
        .delete()
        .eq("article_id", articleId)

    if (deleteError) {
      return deleteError
    }

    if (selectedSources.length === 0) {
      return null
    }

    const relations =
      selectedSources.map((source) => ({
        article_id: articleId,
        source_id: source.id,
      }))

    const { error: insertError } =
      await supabase
        .from("article_sources")
        .insert(relations)

    return insertError ?? null
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
      exam_id: examId || null,
    }

    if (isEditing) {
      const { error: updateError } =
        await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id)

      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }

      const relationError =
        await saveSourceRelations(id)

      if (relationError) {
        setError(
          `Articolo salvato, ma si è verificato un errore nel salvataggio delle fonti: ${relationError.message}`
        )
        setSaving(false)
        return
      }

      setSuccess("Articolo salvato.")
    } else {
      const {
        data,
        error: insertError,
      } = await supabase
        .from("articles")
        .insert(articleData)
        .select("id")
        .single()

      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }

      const relationError =
        await saveSourceRelations(data.id)

      if (relationError) {
        setError(
          `Articolo creato, ma si è verificato un errore nel salvataggio delle fonti: ${relationError.message}`
        )
        setSaving(false)
        return
      }

      navigate(
        `/admin/articles/${data.id}`
      )
    }

    setSaving(false)
  }

  const getSourceTypeLabel = (type) => {
    switch (type) {
      case "book":
        return "Book"
      case "video":
        return "Video"
      case "paper":
        return "Paper"
      case "website":
        return "Website"
      case "course":
        return "Course"
      default:
        return "Other"
    }
  }

  /*
   * Open preview confirmation
   */
  const handlePreviewClick = () => {
    setShowPreviewConfirm(true)
  }

  /*
   * Confirm preview
   */
  const handleConfirmPreview = () => {
    setShowPreviewConfirm(false)

    navigate(
      `/atlas/articles/${String(number).padStart(4, "0")}`
    )
  }

  /*
   * Cancel preview
   */
  const handleCancelPreview = () => {
    setShowPreviewConfirm(false)
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
            {isEditing
              ? "Modifica articolo"
              : "Nuovo articolo"}
          </h1>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handlePreviewClick}
            className="text-sm text-white/40 transition hover:text-white"
          >
            Visualizza →
          </button>
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
              setTitle(event.target.value)
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

        {/* Esame */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Esame
          </label>

          <select
            value={examId}
            onChange={(event) =>
              setExamId(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
          >
            <option
              value=""
              className="bg-neutral-900"
            >
              Nessun esame
            </option>

            {exams.map((exam) => (
              <option
                key={exam.id}
                value={exam.id}
                className="bg-neutral-900"
              >
                {exam.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-white/30">
            Seleziona l'esame a cui appartiene
            questo articolo.
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(event) =>
              setExcerpt(event.target.value)
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
                replaceSelection("**", "**")
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
                replaceSelection("*", "*")
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
                replaceSelection("`", "`")
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
              onClick={() => formatHeading(2)}
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
              onClick={() => formatHeading(3)}
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
              onClick={() => formatList(false)}
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
              onClick={() => formatList(true)}
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
                addColor(
                  "var(--color-primary)"
                )
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
                addColor(
                  "rgb(219, 72, 72)"
                )
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
                addColor(
                  "rgb(93, 255, 104)"
                )
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
              setContent(event.target.value)
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

        {/* Fonti */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm text-white/60">
              Fonti
            </label>

            <span className="text-xs text-white/30">
              {selectedSources.length}{" "}
              {selectedSources.length === 1
                ? "fonte collegata"
                : "fonti collegate"}
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="rounded-xl border border-white/10 bg-white/5">
              <input
                type="search"
                value={sourceSearch}
                onChange={(event) =>
                  setSourceSearch(
                    event.target.value
                  )
                }
                placeholder="Cerca una fonte..."
                autoComplete="off"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/20"
              />
            </div>

            {/* Search results */}
            {(sourceSearch.trim() ||
              searchingSources) && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl">
                {searchingSources ? (
                  <div className="px-4 py-5 text-sm text-white/30">
                    Ricerca...
                  </div>
                ) : sourceResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {sourceResults.map(
                      (source) => (
                        <button
                          key={source.id}
                          type="button"
                          onClick={() =>
                            addSource(source)
                          }
                          className="flex w-full items-start gap-4 border-b border-white/10 px-4 py-4 text-left transition last:border-b-0 hover:bg-white/5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                              {source.title}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-xs uppercase tracking-wider text-white/30">
                                {getSourceTypeLabel(
                                  source.type
                                )}
                              </span>

                              {source.author && (
                                <>
                                  <span className="text-white/20">
                                    ·
                                  </span>

                                  <span className="truncate text-xs text-white/40">
                                    {source.author}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <span className="shrink-0 pt-1 text-white/30">
                            +
                          </span>
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-5 text-sm text-white/30">
                    Nessuna fonte trovata.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected sources */}
          {selectedSources.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedSources.map(
                (source) => (
                  <div
                    key={source.id}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {source.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-white/30">
                          {getSourceTypeLabel(
                            source.type
                          )}
                        </span>

                        {source.author && (
                          <>
                            <span className="text-white/20">
                              ·
                            </span>

                            <span className="truncate text-xs text-white/40">
                              {source.author}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeSource(
                          source.id
                        )
                      }
                      className="shrink-0 rounded-lg px-3 py-2 text-sm text-white/30 transition hover:bg-white/10 hover:text-red-300"
                      title="Rimuovi fonte"
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {selectedSources.length === 0 && (
            <p className="mt-3 text-xs text-white/30">
              Cerca una fonte e cliccala per
              collegarla all'articolo.
            </p>
          )}
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

      {/* Preview confirmation modal */}
      {showPreviewConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-7 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">
              Hai salvato l'articolo?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Prima di visualizzare l'articolo,
              assicurati di aver salvato tutte le
              ultime modifiche.
            </p>

            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelPreview}
                className="rounded-lg px-5 py-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                No, torna all'editor
              </button>

              <button
                type="button"
                onClick={handleConfirmPreview}
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80"
              >
                Sì, visualizza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
