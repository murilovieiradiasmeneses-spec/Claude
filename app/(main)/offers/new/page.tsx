'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Plus, X, Check, Copy } from 'lucide-react'
import Link from 'next/link'

const STEPS = ['Informações', 'Roteiro', 'Conteúdo IA', 'Revisar']

const destinations = [
  { id: '1', name: 'Paris', country: 'França' },
  { id: '2', name: 'Cancún', country: 'México' },
  { id: '3', name: 'Tóquio', country: 'Japão' },
  { id: '4', name: 'Nairóbi', country: 'Quênia' },
]

interface ItineraryDay {
  dayNumber: number
  title: string
  description: string
}

export default function NewOfferPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    destinationId: '',
    startDate: '',
    endDate: '',
    price: '',
    currency: 'BRL',
    maxPax: '20',
    includes: ['Passagem aérea', 'Hospedagem', 'Café da manhã'],
    excludes: ['Passeios opcionais', 'Despesas pessoais'],
    itinerary: [] as ItineraryDay[],
    salesCopy: '',
    whatsappText: '',
    instagramCaption: '',
  })

  const [newInclude, setNewInclude] = useState('')
  const [newExclude, setNewExclude] = useState('')

  const selectedDest = destinations.find((d) => d.id === form.destinationId)

  function addItineraryDay() {
    const day: ItineraryDay = {
      dayNumber: form.itinerary.length + 1,
      title: `Dia ${form.itinerary.length + 1}`,
      description: '',
    }
    setForm((f) => ({ ...f, itinerary: [...f.itinerary, day] }))
  }

  function updateDay(i: number, field: keyof ItineraryDay, value: string) {
    const updated = form.itinerary.map((day, idx) =>
      idx === i ? { ...day, [field]: value } : day
    )
    setForm((f) => ({ ...f, itinerary: updated }))
  }

  function removeDay(i: number) {
    const updated = form.itinerary
      .filter((_, idx) => idx !== i)
      .map((d, idx) => ({ ...d, dayNumber: idx + 1 }))
    setForm((f) => ({ ...f, itinerary: updated }))
  }

  function addInclude() {
    if (newInclude.trim()) {
      setForm((f) => ({ ...f, includes: [...f.includes, newInclude.trim()] }))
      setNewInclude('')
    }
  }

  function addExclude() {
    if (newExclude.trim()) {
      setForm((f) => ({ ...f, excludes: [...f.excludes, newExclude.trim()] }))
      setNewExclude('')
    }
  }

  async function generateContent() {
    if (!selectedDest) return
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/offer-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerTitle: form.title,
          destination: selectedDest.name,
          country: selectedDest.country,
          startDate: form.startDate,
          endDate: form.endDate,
          price: parseFloat(form.price),
          currency: form.currency,
          includes: form.includes,
          itinerary: form.itinerary,
        }),
      })
      const data = await res.json()
      setForm((f) => ({
        ...f,
        salesCopy: data.salesCopy,
        whatsappText: data.whatsappText,
        instagramCaption: data.instagramCaption,
      }))
    } catch {
      alert('Erro ao gerar conteúdo.')
    } finally {
      setGenerating(false)
    }
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleSubmit() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    router.push('/offers')
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/offers"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para ofertas
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Nova oferta</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 text-sm font-medium ${
                i === step ? 'text-blue-600' : i < step ? 'text-green-600' : 'text-slate-400'
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  i < step ? 'bg-green-100' : i === step ? 'bg-blue-100' : 'bg-slate-100'
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {s}
            </div>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Step 0: Basic info */}
      {step === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título da oferta *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="ex: Pacote Paris Romântico"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destino *</label>
            <select
              value={form.destinationId}
              onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um destino</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data de saída *
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data de retorno *
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preço por pessoa *
              </label>
              <div className="flex">
                <select
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                  className="px-2 py-2 border border-r-0 border-slate-300 rounded-l-lg text-sm bg-slate-50 focus:outline-none"
                >
                  <option value="BRL">R$</option>
                  <option value="USD">US$</option>
                  <option value="EUR">€</option>
                </select>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0,00"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Máx. de passageiros
              </label>
              <input
                type="number"
                value={form.maxPax}
                onChange={(e) => setForm((f) => ({ ...f, maxPax: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">O que inclui</label>
              <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
                {form.includes.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm bg-green-50 px-2 py-1 rounded"
                  >
                    <span className="text-green-800">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, includes: f.includes.filter((_, idx) => idx !== i) }))
                      }
                    >
                      <X className="h-3 w-3 text-green-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInclude() } }}
                  placeholder="Adicionar item..."
                  className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addInclude}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                O que não inclui
              </label>
              <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
                {form.excludes.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm bg-red-50 px-2 py-1 rounded"
                  >
                    <span className="text-red-800">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, excludes: f.excludes.filter((_, idx) => idx !== i) }))
                      }
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExclude() } }}
                  placeholder="Adicionar item..."
                  className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addExclude}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Itinerary */}
      {step === 1 && (
        <div className="space-y-3">
          {form.itinerary.map((day, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-600">Dia {day.dayNumber}</span>
                <button
                  type="button"
                  onClick={() => removeDay(i)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => updateDay(i, 'title', e.target.value)}
                  placeholder="Título do dia..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={day.description}
                  onChange={(e) => updateDay(i, 'description', e.target.value)}
                  placeholder="Descrição das atividades do dia..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItineraryDay}
            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar dia ao roteiro
          </button>
        </div>
      )}

      {/* Step 2: AI Content */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-900">Geração de conteúdo com IA</p>
              <p className="text-xs text-purple-700 mt-0.5">
                Cria automaticamente textos de venda, mensagem para WhatsApp e legenda para
                Instagram com base nas informações da oferta.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={generateContent}
            disabled={generating || !form.title || !selectedDest}
            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? 'Gerando conteúdo...' : 'Gerar conteúdo com IA'}
          </button>

          {form.salesCopy && (
            <div className="space-y-3">
              {(
                [
                  { key: 'salesCopy', label: 'Texto de venda', value: form.salesCopy, field: 'salesCopy' as const },
                  { key: 'whatsapp', label: 'Mensagem WhatsApp', value: form.whatsappText, field: 'whatsappText' as const },
                  { key: 'instagram', label: 'Legenda Instagram', value: form.instagramCaption, field: 'instagramCaption' as const },
                ] as const
              ).map(({ key, label, value, field }) => (
                <div key={key} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">{label}</label>
                    <button
                      type="button"
                      onClick={() => copyText(value, key)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      {copied === key ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied === key ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <textarea
                    value={value}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Revisão final</h2>
          <div className="space-y-0 text-sm divide-y divide-slate-100">
            {[
              { label: 'Título', value: form.title || '—' },
              {
                label: 'Destino',
                value: selectedDest ? `${selectedDest.name}, ${selectedDest.country}` : '—',
              },
              {
                label: 'Período',
                value: form.startDate ? `${form.startDate} — ${form.endDate}` : '—',
              },
              { label: 'Preço', value: form.price ? `${form.currency} ${form.price}` : '—' },
              { label: 'Dias de roteiro', value: `${form.itinerary.length} dias` },
              { label: 'Conteúdo gerado', value: form.salesCopy ? 'Sim' : 'Não' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2.5">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
        ) : (
          <Link
            href="/offers"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar oferta
          </button>
        )}
      </div>
    </div>
  )
}
