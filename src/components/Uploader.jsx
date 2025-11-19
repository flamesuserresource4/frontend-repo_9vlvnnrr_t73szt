import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function Uploader({ onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const API = import.meta.env.VITE_BACKEND_URL || ''

  const onPick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok && data.url) onUploaded(data.url)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      <button onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/20 px-3 py-2 text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-60 transition">
        <UploadCloud className="h-4 w-4" /> {uploading ? 'Wgrywanie…' : 'Wgraj zdjęcie'}
      </button>
    </div>
  )
}
