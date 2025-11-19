import { useState, useEffect } from 'react'
import { Calendar, PlusCircle, Images, ChevronRight } from 'lucide-react'
import CalendarForm from './components/CalendarForm'
import CalendarEditor from './components/CalendarEditor'

function App() {
  const API = import.meta.env.VITE_BACKEND_URL || ''
  const [createdId, setCreatedId] = useState(null)
  const [calendars, setCalendars] = useState([])

  const refresh = async () => {
    const res = await fetch(`${API}/calendars`)
    if (res.ok) setCalendars(await res.json())
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.06),transparent_30%)]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-600/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Kreator kalendarzy</h1>
              <p className="text-xs text-white/60">Twórz, edytuj i drukuj spersonalizowane kalendarze</p>
            </div>
          </div>
          <a href="#create" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">
            <PlusCircle className="h-4 w-4" /> Nowy kalendarz
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: create + list */}
          <section className="space-y-6 lg:col-span-1" id="create">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-md bg-blue-600/20 p-2 text-blue-300"><Images className="h-4 w-4" /></div>
                <h2 className="text-base font-medium">Utwórz nowy kalendarz</h2>
              </div>
              <CalendarForm onCreated={(id)=>{ setCreatedId(id); refresh(); }} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
              <div className="mb-3 text-white/80 font-medium">Twoje kalendarze</div>
              <div className="grid grid-cols-1 gap-3">
                {calendars.map(c => (
                  <button key={c.id} onClick={()=> setCreatedId(c.id)} className={`group text-left rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4 transition hover:from-slate-800 hover:to-slate-900 ${createdId===c.id? 'ring-2 ring-blue-500':''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{c.title}</div>
                        <div className="text-white/60 text-sm">{c.year} · start {c.start_month}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/70 transition" />
                    </div>
                  </button>
                ))}
                {calendars.length===0 && (<div className="text-white/60 text-sm">Brak kalendarzy</div>)}
              </div>
            </div>
          </section>

          {/* Right column: editor */}
          <section className="lg:col-span-2">
            {createdId ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
                <CalendarEditor calendarId={createdId} />
              </div>
            ) : (
              <div className="grid h-full min-h-[28rem] place-items-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-white/60">
                <div>
                  <p className="text-lg">Wybierz istniejący kalendarz lub utwórz nowy, aby rozpocząć edycję.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Kalendarze – z miłości do dobrej organizacji
      </footer>
    </div>
  )
}

export default App
