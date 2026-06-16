'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewDestinationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    country: '',
    description: '',
    highlights: [] as string[],
    imageUrl: '',
  })
  const [newHighlight, setNewHighlight] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  async function generateDescription() {
    if (!form.name || !form.country) {
      alert('Preencha o nome do destino e o país primeiro.')
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/destination-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, country: form.country, highlights: form.highlights }),
      })
      const data = await res.json()
      setForm((f) => ({ ...f, description: data.description }))
    } catch {
      alert('Erro ao gerar descrição. Verifique sua chave de API.')
    } finally {
      setGenerating(false)
    }
  }

  function addHighlight() {
    if (newHighlight.trim()) {
      setForm((f) => ({ ...f, highlights: [...f.highlights, newHighlight.trim()] }))
      setNewHighlight('')
    }
  }

  function removeHighlight(i: number) {
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    router.push('/destinations')
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/destinations"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para destinos
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Novo destino</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome do destino *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex: Paris"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">País *</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="ex: França"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL da imagem</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destaques</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addHighlight()
                  }
                }}
                placeholder="ex: Torre Eiffel"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {h}
                    <button type="button" onClick={() => removeHighlight(i)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Descrição</label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating}
                className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {generating ? 'Gerando...' : 'Gerar com IA'}
              </button>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={5}
              placeholder="Descreva o destino ou clique em 'Gerar com IA'..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/destinations"
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar destino
          </button>
        </div>
      </form>
    </div>
  )
}
