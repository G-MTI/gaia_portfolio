
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"

const sourceTypes = [
  { value: "all", label: "All" },
  { value: "book", label: "Books" },
  { value: "video", label: "Videos" },
  { value: "paper", label: "Papers" },
  { value: "website", label: "Websites" },
  { value: "course", label: "Courses" },
  { value: "other", label: "Other" },
]

const emptyForm = {
  title: "",
  type: "book",
  author: "",
  url: "",
  image_url: "",
  description: "",
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
    case "course":
      return "Course"
    default:
      return "Other"
  }
}

export const Sources = () => {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState(emptyForm)

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const getSources = async () => {
    setLoading(true)
    setError("")

    const { data, error: sourcesError } = await supabase
      .from("sources")
      .select(`
        id,
        title,
        type,
        author,
        url,
        image_url,
        description,
        created_at
      `)
      .order("created_at", { ascending: false })

    if (sourcesError) {
      setError(sourcesError.message)
      setSources([])
    } else {
      setSources(data ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    getSources()
  }, [])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  const openEditForm = (source) => {
    setEditingId(source.id)

    setForm({
      title: source.title ?? "",
      type: source.type ?? "book",
      author: source.author ?? "",
      url: source.url ?? "",
      image_url: source.image_url ?? "",
      description: source.description ?? "",
    })

    setError("")
    setSuccess("")
    setIsFormOpen(true)
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setError("")
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError("")
    setSuccess("")

    const sourceData = {
      title: form.title.trim(),
      type: form.type,
      author: form.author.trim() || null,
      url: form.url.trim() || null,
      image_url: form.image_url.trim() || null,
      description: form.description.trim() || null,
    }

    if (!sourceData.title) {
      setError("Title is required.")
      setSaving(false)
      return
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from("sources")
        .update(sourceData)
        .eq("id", editingId)

      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }

      setSuccess("Resource updated.")
    } else {
      const { error: insertError } = await supabase
        .from("sources")
        .insert(sourceData)

      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }

      setSuccess("Resource created.")
    }

    await getSources()

    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)

    setSaving(false)
  }

  const handleDelete = async (source) => {
    const confirmed = window.confirm(
      `Delete "${source.title}"? This will also remove its connections to articles.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(source.id)
    setError("")
    setSuccess("")

    const { error: deleteError } = await supabase
      .from("sources")
      .delete()
      .eq("id", source.id)

    if (deleteError) {
      setError(deleteError.message)
      setDeletingId(null)
      return
    }

    setSuccess("Resource deleted.")

    await getSources()

    setDeletingId(null)
  }

  const filteredSources = sources.filter((source) => {
    const normalizedQuery = query.trim().toLowerCase()

    const matchesType =
      typeFilter === "all" ||
      source.type === typeFilter

    if (!normalizedQuery) {
      return matchesType
    }

    const searchableText = [
      source.title,
      source.author,
      source.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return (
      matchesType &&
      searchableText.includes(normalizedQuery)
    )
  })

  return (
    <div className="p-10">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <Link
            to="/admin"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Dashboard
          </Link>

          <h1 className="mt-4 text-4xl font-semibold">
            Sources
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80"
        >
          + New resource
        </button>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-8 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {isFormOpen && (
        <section className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/30">
                {editingId ? "Edit resource" : "New resource"}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {editingId
                  ? "Edit resource"
                  : "Add a resource"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="text-sm text-white/40 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="max-w-3xl space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Introduction to Algorithms"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              >
                {sourceTypes
                  .filter((item) => item.value !== "all")
                  .map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-neutral-900"
                    >
                      {item.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Author
              </label>

              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Cormen, Leiserson, Rivest, Stein"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                URL
              </label>

              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Image URL
              </label>

              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
              />

              <p className="mt-2 text-xs text-white/30">
                Used as the cover image for books in the Library.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Short description of the resource..."
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-white/40"
              />
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Create resource"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg px-6 py-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search resources..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/40 md:w-48"
        >
          {sourceTypes.map((item) => (
            <option
              key={item.value}
              value={item.value}
              className="bg-neutral-900"
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex items-center gap-6">
        <p className="shrink-0 text-sm uppercase tracking-[0.2em] text-white/30">
          {filteredSources.length}{" "}
          {filteredSources.length === 1
            ? "resource"
            : "resources"}
        </p>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      {loading ? (
        <p className="text-sm text-white/40">
          Loading resources...
        </p>
      ) : filteredSources.length === 0 ? (
        <div className="border-b border-white/10 py-12">
          <p className="text-white/40">
            {sources.length === 0
              ? "No resources yet."
              : "No resources match your search."}
          </p>

          {sources.length === 0 && (
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 text-sm text-white/50 transition hover:text-white"
            >
              Create your first resource →
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {filteredSources.map((source) => (
            <article
              key={source.id}
              className="py-6"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.15em] text-white/30">
                      {getTypeLabel(source.type)}
                    </span>

                    {source.author && (
                      <>
                        <span className="text-white/20">
                          ·
                        </span>

                        <span className="text-sm text-white/40">
                          {source.author}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-medium">
                    {source.title}
                  </h2>

                  {source.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                      {source.description}
                    </p>
                  )}

                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm text-white/30 transition hover:text-white"
                    >
                      Open resource ↗
                    </a>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(source)
                    }
                    className="text-sm text-white/40 transition hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(source)
                    }
                    disabled={deletingId === source.id}
                    className="text-sm text-red-300/60 transition hover:text-red-300 disabled:opacity-50"
                  >
                    {deletingId === source.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}