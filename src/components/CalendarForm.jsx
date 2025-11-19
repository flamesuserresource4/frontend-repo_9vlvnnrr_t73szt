import { useState } from 'react'

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
    <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm text-white/80">Tytuł
          <input className="mt-1 bg-white/10 border border-white/10 rounded px-3 py-2 text-white" value={title} onChange={e=>setTitle(e.target.value)} />
        </label>
        <label className="flex flex-col text-sm text-white/80">Rok
          <input type="number" className="mt-1 bg-white/10 border border-white/10 rounded px-3 py-2 text-white" value={year} onChange={e=>setYear(e.target.value)} />
        </label>
        <label className="flex flex-col text-sm text-white/80">Miesiąc startowy
          <select className="mt-1 bg-white/10 border border-white/10 rounded px-3 py-2 text-white" value={startMonth} onChange={e=>setStartMonth(e.target.value)}>
            {Array.from({length:12}, (_,i)=>i+1).map(m=> <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="flex flex-col text-sm text-white/80">Styl
          <select className="mt-1 bg-white/10 border border-white/10 rounded px-3 py-2 text-white" value={style} onChange={e=>setStyle(e.target.value)}>
            <option value="classic">Klasyczny</option>
            <option value="minimal">Minimal</option>
          </select>
        </label>
      </div>
      <button disabled={loading} className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded px-4 py-2">{loading? 'Tworzenie...' : 'Utwórz kalendarz'}</button>
    </form>
  )
}
