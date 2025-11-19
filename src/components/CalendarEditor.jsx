import { useEffect, useMemo, useState } from 'react'
import Uploader from './Uploader'
import { Pencil } from 'lucide-react'

const monthNames = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']

export default function CalendarEditor({ calendarId }) {
  const API = import.meta.env.VITE_BACKEND_URL || ''
  const [calendar, setCalendar] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/calendars/${calendarId}`)
      const data = await res.json()
      if (res.ok) setCalendar(data)
    }
    if (calendarId) load()
  }, [calendarId, API])

  const orderedPages = useMemo(() => {
    if (!calendar) return []
    const start = calendar.start_month || 1
    const pages = calendar.pages?.slice() || []
    return Array.from({length:12}, (_,i)=> ((start-1+i)%12)+1).map(m => pages.find(p=>p.month===m) || {month: m})
  }, [calendar])

  const setPage = (month, patch) => {
    setCalendar(prev => ({...prev, pages: (prev.pages||[]).some(p=>p.month===month) ? prev.pages.map(p=> p.month===month? {...p, ...patch} : p) : [...(prev.pages||[]), {month, ...patch}]}))
  }

  const savePage = async (month, payload) => {
    setSaving(true)
    try {
      await fetch(`${API}/calendars/${calendarId}/pages/${month}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } finally {
      setSaving(false)
    }
  }

  if (!calendar) return <div className="text-white/80">Ładowanie...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{calendar.title} · {calendar.year}</h2>
        <div className={`text-sm ${saving? 'text-amber-300':'text-emerald-300'}`}>{saving ? 'Zapisywanie…' : 'Zapisane'}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {orderedPages.map(p => (
          <div key={p.month} className="group rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-3 transition hover:from-slate-800 hover:to-slate-900">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium text-white">{monthNames[p.month-1]}</div>
              <Uploader onUploaded={(url)=>{ setPage(p.month, { image_url: url }); savePage(p.month, { image_url: url }) }} />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {p.image_url ? (
                <img src={`${API}${p.image_url}`} alt="preview" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              ) : (
                <div className="grid h-full place-items-center text-white/60 text-sm">
                  Brak zdjęcia
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"></div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Pencil className="h-4 w-4 text-white/50" />
              <textarea placeholder="Notatka" className="flex-1 min-h-[44px] bg-slate-900/60 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition" value={p.note||''} onChange={e=> setPage(p.month, { note: e.target.value })} onBlur={e=> savePage(p.month, { note: e.target.value })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
