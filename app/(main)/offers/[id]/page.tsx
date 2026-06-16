import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Users, Copy, Check } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockOffer = {
  id: '1',
  title: 'Pacote Paris Romântico',
  destination: { name: 'Paris', country: 'França' },
  startDate: new Date('2024-06-15'),
  endDate: new Date('2024-06-22'),
  price: 8500,
  currency: 'BRL',
  maxPax: 20,
  status: 'active',
  includes: ['Passagem aérea', 'Hospedagem 4 estrelas', 'Café da manhã', 'Transfer aeroporto'],
  excludes: ['Passeios opcionais', 'Alimentação além do café', 'Seguro viagem'],
  itinerary: [
    { dayNumber: 1, title: 'Chegada em Paris', description: 'Recepção no aeroporto Charles de Gaulle e transfer para o hotel.' },
    { dayNumber: 2, title: 'Tour pela Cidade Luz', description: 'Visita à Torre Eiffel, Museu do Louvre e passeio pelos Champs-Élysées.' },
    { dayNumber: 3, title: 'Versalhes e arredores', description: 'Excursão ao Palácio de Versalhes e seus jardins magníficos.' },
  ],
  salesCopy: 'Descubra a magia de Paris neste pacote especialmente elaborado para casais que buscam romance e cultura. A Cidade Luz aguarda com seus cafés charmosos, monumentos icônicos e culinária refinada.',
  whatsappText: '✈️ Pacote Paris Romântico! 7 noites com aéreo + hotel 4⭐ + café da manhã. De R$ 8.500/pessoa. Vagas limitadas! Me chama para saber mais 🌹',
  instagramCaption: 'A cidade mais romântica do mundo te espera! 🗼✨ Nosso Pacote Paris Romântico inclui tudo para a viagem dos seus sonhos. Link na bio para reservar! #Paris #ViagensRomânticas #TravelCraft #Turismo',
}

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  const offer = { ...mockOffer, id: params.id }

  return (
    <div className="max-w-3xl">
      <Link href="/offers" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar para ofertas
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{offer.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{offer.destination.name}, {offer.destination.country}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(offer.startDate)} — {formatDate(offer.endDate)}</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />até {offer.maxPax} pax</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(offer.price, offer.currency)}</p>
          <p className="text-xs text-slate-500">por pessoa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">O que inclui</h3>
          <ul className="space-y-1">
            {offer.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Não inclui</h3>
          <ul className="space-y-1">
            {offer.excludes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-3.5 w-3.5 flex items-center justify-center text-red-400 flex-shrink-0">×</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {offer.itinerary.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Roteiro</h3>
          <div className="space-y-3">
            {offer.itinerary.map((day) => (
              <div key={day.dayNumber} className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  {day.dayNumber}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{day.title}</p>
                  <p className="text-sm text-slate-500">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {offer.salesCopy && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Conteúdo gerado</h3>
          {[
            { key: 'sales', label: 'Texto de venda', value: offer.salesCopy },
            { key: 'whatsapp', label: 'Mensagem WhatsApp', value: offer.whatsappText },
            { key: 'instagram', label: 'Legenda Instagram', value: offer.instagramCaption },
          ].map(({ key, label, value }) => (
            <div key={key} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(value)
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </button>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
