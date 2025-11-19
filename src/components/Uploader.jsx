import { useRef, useState } from 'react'

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
      <button onClick={() => inputRef.current?.click()} disabled={uploading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded px-3 py-2">
        {uploading ? 'Wgrywanie...' : 'Wgraj zdjęcie'}
      </button>
    </div>
  )
}
