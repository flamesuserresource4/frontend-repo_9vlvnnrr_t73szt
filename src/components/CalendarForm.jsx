import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function CalendarForm({ onCreated }) {
  const [title, setTitle] = useState('Mój kalendarz')
  const [year, setYear] = useState(new Date().getFullYear())
  const [startMonth, setStartMonth] = useState(1)
  const [style, setStyle] = useState('classic')
  const [loading, setLoading] = useState(false)
  const API = import.meta.env.VITE_BACKEND_URL || ''

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API}/calendars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, year: Number(year), start_month: Number(startMonth), style })
      })
      const data = await res.json()
      if (res.ok && data.id) onCreated(data.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col text-sm text-white/80">Tytuł
          <input className="mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Np. Rodzinny 2025" />
        </label>
        <label className="flex flex-col text-sm text-white/80">Rok
          <input type="number" className="mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition" value={year} onChange={e=>setYear(e.target.value)} />
        </label>
        <label className="flex flex-col text-sm text-white/80">Miesiąc startowy
          <select className="mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition" value={startMonth} onChange={e=>setStartMonth(e.target.value)}>
            {Array.from({length:12}, (_,i)=>i+1).map(m=> <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="flex flex-col text-sm text-white/80">Styl
          <select className="mt-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition" value={style} onChange={e=>setStyle(e.target.value)}>
            <option value="classic">Klasyczny</option>
            <option value="minimal">Minimal</option>
          </select>
        </label>
      </div>
      <button disabled={loading} className="group inline-flex items-center gap-2 mt-2 bg-gradient-to-br from-blue-600 to-emerald-500 hover:brightness-110 disabled:opacity-60 text-white rounded-lg px-4 py-2 transition">
        <Sparkles className="h-4 w-4 group-disabled:opacity-70" /> {loading? 'Tworzenie...' : 'Utwórz kalendarz'}
      </button>
    </form>
  )
}
