import { MapPin, Package, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Destinos cadastrados', value: '12', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Ofertas ativas', value: '8', icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Conteúdos gerados', value: '47', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Membros da equipe', value: '5', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
]

const recentOffers = [
  { id: '1', title: 'Pacote Paris Romântico', destination: 'Paris, França', price: 8500, status: 'active' },
  { id: '2', title: 'Cancún All Inclusive', destination: 'Cancún, México', price: 4200, status: 'draft' },
  { id: '3', title: 'Safari no Quênia', destination: 'Nairóbi, Quênia', price: 15000, status: 'active' },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Bem-vindo ao TravelCraft</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Ofertas recentes</h2>
            <Link href="/offers" className="text-sm text-blue-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentOffers.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-900">{offer.title}</p>
                  <p className="text-sm text-slate-500">{offer.destination}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    R$ {offer.price.toLocaleString('pt-BR')}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      offer.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {offer.status === 'active' ? 'Ativa' : 'Rascunho'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Ações rápidas</h2>
          <div className="space-y-2">
            <Link
              href="/destinations/new"
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <MapPin className="h-4 w-4 text-blue-500" />
              Novo destino
            </Link>
            <Link
              href="/offers/new"
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Package className="h-4 w-4 text-green-500" />
              Nova oferta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
