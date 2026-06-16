import Link from 'next/link'
import { MapPin, Plus, Edit, Globe } from 'lucide-react'

const mockDestinations = [
  {
    id: '1',
    name: 'Paris',
    country: 'França',
    offers: 3,
    description: 'A cidade mais romântica do mundo, conhecida pela Torre Eiffel e culinária refinada.',
  },
  {
    id: '2',
    name: 'Cancún',
    country: 'México',
    offers: 2,
    description: 'Praias paradisíacas com águas cristalinas e rica cultura maia.',
  },
  {
    id: '3',
    name: 'Tóquio',
    country: 'Japão',
    offers: 1,
    description: 'Metrópole futurista que combina tradição milenar com modernidade tecnológica.',
  },
  {
    id: '4',
    name: 'Nairóbi',
    country: 'Quênia',
    offers: 1,
    description: 'Portal para safáris inesquecíveis na savana africana.',
  },
]

export default function DestinationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destinos</h1>
          <p className="text-slate-500 mt-1">{mockDestinations.length} destinos cadastrados</p>
        </div>
        <Link
          href="/destinations/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo destino
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Globe className="h-3 w-3" />
                    {dest.country}
                  </div>
                </div>
              </div>
              <Link
                href={`/destinations/${dest.id}/edit`}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{dest.description}</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {dest.offers} {dest.offers === 1 ? 'oferta vinculada' : 'ofertas vinculadas'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
