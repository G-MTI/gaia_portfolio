
import { Link } from "react-router-dom"

export const Dashboard = () => {
  return (
    <div className="p-10">

      <div className="mb-10">
        <p className="mb-2 text-sm text-white/40">
          Atlas Admin
        </p>

        <h1 className="text-4xl text-primary font-semibold">
          Dashboard
        </h1>
      </div>


      {/* Statistiche */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 p-6">
          <p className="text-sm text-white/40">
            Articoli
          </p>

          <p className="mt-3 text-4xl font-semibold">
            —
          </p>
        </div>


        <div className="rounded-2xl border border-white/10 p-6">
          <p className="text-sm text-white/40">
            Pubblicati
          </p>

          <p className="mt-3 text-4xl font-semibold">
            —
          </p>
        </div>


        <div className="rounded-2xl border border-white/10 p-6">
          <p className="text-sm text-white/40">
            Bozze
          </p>

          <p className="mt-3 text-4xl font-semibold">
            —
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
