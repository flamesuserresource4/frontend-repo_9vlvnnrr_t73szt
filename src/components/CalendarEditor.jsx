import { useEffect, useMemo, useState } from 'react'
import Uploader from './Uploader'

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
        <div className="text-white/70 text-sm">{saving ? 'Zapisywanie...' : 'Gotowe'}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderedPages.map(p => (
          <div key={p.month} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-white">{monthNames[p.month-1]}</div>
              <Uploader onUploaded={(url)=>{ setPage(p.month, { image_url: url }); savePage(p.month, { image_url: url }) }} />
            </div>
            <div className="aspect-[4/3] bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
              {p.image_url ? (<img src={`${API}${p.image_url}`} alt="preview" className="w-full h-full object-cover" />) : (
                <div className="text-white/60 text-sm">Brak zdjęcia</div>
              )}
            </div>
            <textarea placeholder="Notatka" className="mt-2 w-full bg-white/10 border border-white/10 rounded p-2 text-white text-sm" value={p.note||''} onChange={e=> setPage(p.month, { note: e.target.value })} onBlur={e=> savePage(p.month, { note: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  )
}
