import Link from 'next/link'
import { Package, Plus, Eye, MapPin, Calendar, Users } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockOffers = [
  {
    id: '1',
    title: 'Pacote Paris Romântico',
    destination: 'Paris, França',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-06-22'),
    price: 8500,
    maxPax: 20,
    status: 'active',
  },
  {
    id: '2',
    title: 'Cancún All Inclusive',
    destination: 'Cancún, México',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-17'),
    price: 4200,
    maxPax: 30,
    status: 'draft',
  },
  {
    id: '3',
    title: 'Safari no Quênia',
    destination: 'Nairóbi, Quênia',
    startDate: new Date('2024-08-05'),
    endDate: new Date('2024-08-14'),
    price: 15000,
    maxPax: 12,
    status: 'active',
  },
]

export default function OffersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ofertas</h1>
          <p className="text-slate-500 mt-1">{mockOffers.length} ofertas cadastradas</p>
        </div>
        <Link
          href="/offers/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova oferta
        </Link>
      </div>

      <div className="space-y-3">
        {mockOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{offer.title}</h3>
                  <div className="flex items-center gap-3 mt-0.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {offer.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      até {offer.maxPax} pax
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatCurrency(offer.price)}</p>
                  <p className="text-xs text-slate-500">por pessoa</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    offer.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {offer.status === 'active' ? 'Ativa' : 'Rascunho'}
                </span>
                <Link
                  href={`/offers/${offer.id}`}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
