import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Star,
  Clock,
  Bath,
  Plus,
  ArrowRight,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

const POPULAR_TAGS = [
  'Bravecto cães',
  'Ração Golden Filhote',
  'Táxi Dog Busca & Leva',
  'Areia Pipicat Sílica',
  'Tapete Higiênico 50un',
  'Churu Gatos',
];

export const SearchTab: React.FC = () => {
  const {
    userAddress,
    stores,
    products,
    addToCart,
    setSelectedStoreId,
    setTutorTab,
  } = usePetHub();

  const [query, setQuery] = useState('');
  const [filterChip, setFilterChip] = useState<'tudo' | 'produtos' | 'banho' | 'farmacia'>('tudo');

  const activeProducts = products.filter((p) => {
    if (p.paused) return false;
    if (filterChip === 'farmacia' && p.category !== 'farmacia') return false;
    if (!query.trim()) return true;
    return (
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  });

  const filteredStores = stores.filter((s) => {
    if (!query.trim()) return true;
    return (
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="pb-24">
      {/* Sticky Minimal Header */}
      <div className="sticky top-0 z-20 bg-[#FAF5F2]/95 backdrop-blur-md px-4 pt-3.5 pb-3 border-b border-[#E8DDD8]/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
              PETHUB
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-[#2D1E1A]">{userAddress}</span>
              <ChevronDown className="w-4 h-4 text-[#A84A32]" />
            </div>
          </div>
          <button
            onClick={() => setTutorTab('perfil')}
            className="w-8 h-8 rounded-full border-2 border-[#A84A32] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Perfil"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 bg-white border border-[#E8DDD8] rounded-2xl px-3.5 py-2.5 shadow-clean focus-within:border-[#A84A32]">
          <Search className="w-4 h-4 text-[#A84A32] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rações, banho, remédios ou lojas..."
            className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none placeholder:text-[#7A6660]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[10px] font-bold text-[#7A6660] hover:text-[#2D1E1A]"
            >
              Limpar
            </button>
          )}
          <SlidersHorizontal className="w-4 h-4 text-[#7A6660] shrink-0" />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'tudo', label: 'Tudo' },
            { id: 'produtos', label: 'Produtos 🛍️' },
            { id: 'banho', label: 'Banho & Tosa 🛁' },
            { id: 'farmacia', label: 'Farmácia 💊' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterChip(c.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition border ${
                filterChip === c.id
                  ? 'bg-[#A84A32] text-white border-[#A84A32]'
                  : 'bg-white text-[#2D1E1A] border-[#E8DDD8] hover:border-[#A84A32]/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 space-y-5">
        {/* Highlight Banner: Festival de Banho & Tosa */}
        {!query && (
          <div className="relative rounded-3xl overflow-hidden bg-[#2D1E1A] text-white p-4 shadow-clean">
            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80"
              alt="Festival de Banho"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="relative z-10 space-y-2 max-w-[235px]">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#A84A32] text-white text-[9px] font-extrabold uppercase tracking-wider">
                Destaque da Semana
              </span>
              <h2 className="text-base font-extrabold leading-snug">
                Festival de Banho & Tosa
              </h2>
              <p className="text-[11px] text-white/85">
                Agende perto de você com até 30% OFF no pacote VIP + Comanda Híbrida
              </p>
              <button
                onClick={() => setSelectedStoreId('store-vila-pet')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-bold transition"
              >
                <span>Agendar Agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Mais buscados no bairro */}
        {!query && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#A84A32]" />
                <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                  Mais buscados no bairro
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#A84A32]">Moema & Jardins</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag.includes('Táxi Dog')) {
                      setSelectedStoreId('store-vila-pet');
                    } else {
                      setQuery(tag.split(' ')[0]);
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#F4E8E2]/80 hover:bg-[#F4E8E2] text-[#2D1E1A] text-[11px] font-semibold flex items-center gap-1.5 transition"
                >
                  <Search className="w-3 h-3 text-[#A84A32]" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Petshops & Spas em Destaque (Hiperlocal por raio) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">
                Petshops & Spas em Destaque
              </h3>
              <p className="text-[11px] text-[#7A6660]">
                Lojas por raio com entrega rápida ou agendamento hoje
              </p>
            </div>
            <span className="text-xs font-bold text-[#A84A32]">Raio 3 km</span>
          </div>

          <div className="space-y-2.5">
            {filteredStores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className="w-full text-left bg-white rounded-2xl border border-[#E8DDD8] hover:border-[#A84A32] p-3 shadow-clean flex items-center gap-3 transition group"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#FAF5F2]">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {store.isPro && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-md bg-[#A84A32] text-white text-[9px] font-extrabold">
                      PRO
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-extrabold text-[#2D1E1A] truncate">
                      {store.name}
                    </h4>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#A84A32] shrink-0">
                      <Star className="w-3 h-3 fill-[#A84A32]" />
                      {store.rating} ({store.reviewCount}+)
                    </span>
                  </div>

                  <p className="text-[11px] text-[#7A6660] truncate mt-0.5">
                    Pet Shop & Grooming • <strong className="text-[#2D1E1A]">{store.distanceKm} km</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF5F2] text-[#2D1E1A] text-[10px] font-semibold">
                      <Clock className="w-3 h-3 text-[#A84A32]" />
                      {store.etaMinutes}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-bold">
                      <Bath className="w-3 h-3" />
                      {store.nextBathSlot}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Resultados de Produtos da Busca */}
        {(query || filterChip === 'produtos' || filterChip === 'farmacia') && (
          <div>
            <h3 className="text-xs font-extrabold text-[#2D1E1A] mb-2.5">
              Produtos disponíveis perto de você ({activeProducts.length})
            </h3>
            <div className="space-y-2">
              {activeProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-[#E8DDD8] p-2.5 flex items-center gap-3 shadow-clean"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#FAF5F2] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#7A6660] font-semibold">
                      {prod.storeName} • 1.2 km
                    </span>
                    <h4 className="text-xs font-bold text-[#2D1E1A] truncate">{prod.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-extrabold text-[#A84A32]">
                        R$ {prod.price.toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="px-3 py-1 rounded-full bg-[#FDF4F1] hover:bg-[#A84A32] text-[#A84A32] hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
