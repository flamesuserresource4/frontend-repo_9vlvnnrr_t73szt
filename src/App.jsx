import { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">Spersonalizowane kalendarze do druku</h1>
            <p className="text-blue-200 mt-2">Utwórz kalendarz, wgraj zdjęcia dla każdego miesiąca i pobierz do druku.</p>
          </div>

          <CalendarForm onCreated={(id)=>{ setCreatedId(id); refresh(); }} />

          {createdId && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <CalendarEditor calendarId={createdId} />
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-white/80 font-medium mb-3">Twoje kalendarze</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {calendars.map(c => (
                <button key={c.id} onClick={()=> setCreatedId(c.id)} className={`text-left bg-black/20 hover:bg-black/30 border border-white/10 rounded-lg p-3 ${createdId===c.id? 'ring-2 ring-blue-500':''}`}>
                  <div className="text-white font-medium">{c.title}</div>
                  <div className="text-white/60 text-sm">{c.year} · start {c.start_month}</div>
                </button>
              ))}
              {calendars.length===0 && (<div className="text-white/60 text-sm">Brak kalendarzy</div>)}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App