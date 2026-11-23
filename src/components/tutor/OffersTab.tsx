import React, { useState } from 'react';
import {
  PiggyBank,
  Search,
  SlidersHorizontal,
  ArrowRight,
  PawPrint,
  Bath,
  Pill,
  Cookie,
  Truck,
  Layers,
  Check,
  BadgeCheck,
  Plus,
  Calendar,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

export const OffersTab: React.FC = () => {
  const {
    products,
    addToCart,
    setSelectedStoreId,
    setCartGrooming,
    activePet,
    pushToast,
  } = usePetHub();

  const [freeShippingOnly, setFreeShippingOnly] = useState(true);
  const [selectedOfferFilter, setSelectedOfferFilter] = useState<string>('all');
  const [searchOffer, setSearchOffer] = useState('');

  const offerProducts = products.filter((p) => {
    if (p.paused) return false;
    if (selectedOfferFilter === 'racoes' && p.category !== 'racoes') return false;
    if (selectedOfferFilter === 'farmacia' && p.category !== 'farmacia') return false;
    if (selectedOfferFilter === 'petiscos' && p.category !== 'petiscos') return false;
    if (searchOffer.trim() && !p.name.toLowerCase().includes(searchOffer.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleQuickComboSpa = () => {
    setCartGrooming({
      serviceId: 'srv-banho-hidratacao',
      serviceName: 'Combo Spa: Banho + Tosa + Unhas (Oferta 33% OFF)',
      petId: activePet.id,
      petName: activePet.name,
      petBreed: activePet.breed,
      size: activePet.size,
      date: 'Hoje',
      time: '16:30',
      price: 79.9,
    });
    setSelectedStoreId('store-vila-pet');
  };

  return (
    <div className="pb-24 px-4 pt-3.5 space-y-4">
      {/* Top Economy Pill Card */}
      <div
        onClick={() =>
          pushToast('Clube PetHub Ouro', 'Você economizou R$ 184,50 em fretes e cupons neste mês!')
        }
        className="cursor-pointer rounded-2xl bg-gradient-to-r from-[#A84A32] to-[#C86D52] text-white p-3.5 shadow-clean flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-white/85">
              Economia Acumulada
            </span>
            <p className="text-xs font-bold">
              Você já economizou{' '}
              <strong className="underline font-extrabold">R$ 184,50</strong> este mês 🐾
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-white/80 shrink-0" />
      </div>

      {/* Search Offers */}
      <div className="flex items-center gap-2 bg-white border border-[#E8DDD8] rounded-2xl px-3.5 py-2.5 shadow-clean">
        <Search className="w-4 h-4 text-[#A84A32] shrink-0" />
        <input
          type="text"
          value={searchOffer}
          onChange={(e) => setSearchOffer(e.target.value)}
          placeholder="Buscar promoções, cupons ou lojas com frete..."
          className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none placeholder:text-[#7A6660]"
        />
        <SlidersHorizontal className="w-4 h-4 text-[#A84A32] shrink-0" />
      </div>

      {/* Banner: Festival Pet Hits */}
      <div className="rounded-3xl bg-[#A84A32] text-white overflow-hidden shadow-clean grid grid-cols-12">
        <div className="col-span-7 p-4 flex flex-col justify-between space-y-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#A84A32] text-[9px] font-extrabold w-fit">
            🔥 FESTIVAL PET HITS
          </span>
          <h2 className="text-base font-extrabold leading-tight">
            Rações e Banho a partir de R$ 19,90
          </h2>
          <p className="text-[10px] text-white/85">🛵 + Entrega Grátis até 18h</p>
          <button
            onClick={() => setSelectedStoreId('store-vila-pet')}
            className="mt-1 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-[#A84A32] text-[11px] font-extrabold w-fit shadow-xs"
          >
            <span>Aproveitar Agora</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="col-span-5 relative">
          <img
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80"
            alt="Festival Pet Hits"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Explorar por Oferta */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-extrabold text-[#2D1E1A]">Explorar por Oferta</h3>
          <span className="text-[11px] font-bold text-[#A84A32]">Descontos Reais</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Tudo', icon: Layers },
            { id: 'racoes', label: 'Rações 20%+', icon: PawPrint },
            { id: 'banho', label: 'Banho & Tosa', icon: Bath },
            { id: 'farmacia', label: 'Farmácia Pet', icon: Pill },
            { id: 'petiscos', label: 'Sachês 3x2', icon: Cookie },
            { id: 'frete', label: 'Frete Grátis', icon: Truck },
          ].map((item) => {
            const Icon = item.icon;
            const active = selectedOfferFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'banho') {
                    setSelectedStoreId('store-vila-pet');
                  } else {
                    setSelectedOfferFilter(item.id);
                  }
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition border ${
                    active
                      ? 'bg-[#A84A32] text-white border-[#A84A32]'
                      : 'bg-[#F4E8E2]/80 text-[#A84A32] border-[#E8DDD8] group-hover:border-[#A84A32]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#2D1E1A] text-center max-w-[60px] leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedOfferFilter('all')}
          className="px-3 py-1.5 rounded-full bg-white border border-[#E8DDD8] text-[11px] font-bold text-[#2D1E1A]"
        >
          Ordenar por ▾
        </button>
        <button
          onClick={() => pushToast('Filtro aplicado', 'Mostrando ofertas até R$ 180,00')}
          className="px-3 py-1.5 rounded-full bg-white border border-[#E8DDD8] text-[11px] font-bold text-[#2D1E1A]"
        >
          Preço máximo ▾
        </button>
        <button
          onClick={() => setFreeShippingOnly(!freeShippingOnly)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 border transition ${
            freeShippingOnly
              ? 'bg-[#A84A32] text-white border-[#A84A32]'
              : 'bg-white text-[#2D1E1A] border-[#E8DDD8]'
          }`}
        >
          {freeShippingOnly && <Check className="w-3 h-3" />}
          <span>Frete Grátis</span>
        </button>
      </div>

      {/* PetHub Indica (2-column grid matching tela_oferta.jpg) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">PetHub Indica</h3>
              <BadgeCheck className="w-4 h-4 text-[#A84A32]" />
            </div>
            <p className="text-[11px] text-[#7A6660]">
              Os melhores achados e combos híbridos no precinho
            </p>
          </div>
          <button
            onClick={() => setSelectedStoreId('store-vila-pet')}
            className="text-xs font-bold text-[#A84A32]"
          >
            Ver mais
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Special Grooming Combo Offer */}
          <div className="bg-white rounded-2xl border border-[#E8DDD8] p-2.5 shadow-clean flex flex-col justify-between">
            <div>
              <div className="relative h-28 rounded-xl overflow-hidden bg-[#FAF5F2] mb-2">
                <img
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80"
                  alt="Combo Spa"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#A84A32] text-white text-[9px] font-extrabold">
                  33% OFF
                </span>
                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-white/95 text-[#A84A32] text-[9px] font-extrabold shadow-xs">
                  Hoje
                </span>
              </div>
              <span className="text-[10px] text-[#7A6660] block">Spa Vila Pet • 800m</span>
              <h4 className="text-xs font-bold text-[#2D1E1A] line-clamp-2 mt-0.5">
                Combo Spa: Banho + Tosa + Unhas
              </h4>
            </div>

            <div className="flex items-end justify-between mt-2.5 pt-2 border-t border-[#FAF5F2]">
              <div>
                <span className="block text-[10px] text-[#7A6660] line-through">R$ 120,00</span>
                <span className="text-sm font-extrabold text-[#A84A32]">R$ 79,90</span>
              </div>
              <button
                onClick={handleQuickComboSpa}
                className="w-8 h-8 rounded-full bg-[#A84A32] hover:bg-[#8E3B26] text-white flex items-center justify-center shadow-xs transition"
                title="Agendar Combo Spa"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Offer Cards */}
          {offerProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-[#E8DDD8] p-2.5 shadow-clean flex flex-col justify-between"
            >
              <div>
                <div className="relative h-28 rounded-xl overflow-hidden bg-[#FAF5F2] mb-2">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  {prod.discountTag && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#A84A32] text-white text-[9px] font-extrabold">
                      {prod.discountTag}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#7A6660] block">
                  {prod.storeName} • Grátis
                </span>
                <h4 className="text-xs font-bold text-[#2D1E1A] line-clamp-2 mt-0.5">
                  {prod.name}
                </h4>
              </div>

              <div className="flex items-end justify-between mt-2.5 pt-2 border-t border-[#FAF5F2]">
                <div>
                  {prod.originalPrice && (
                    <span className="block text-[10px] text-[#7A6660] line-through">
                      R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="text-sm font-extrabold text-[#A84A32]">
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(prod, 1)}
                  className="w-8 h-8 rounded-full bg-[#FDF4F1] hover:bg-[#A84A32] text-[#A84A32] hover:text-white flex items-center justify-center transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
