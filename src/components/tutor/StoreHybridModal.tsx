import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Bath,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Lock,
  Calendar,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { GROOMING_SERVICES, GROOMING_TIME_SLOTS } from '../../data/mockData';
import { PetSize } from '../../types/pethub';

export const StoreHybridModal: React.FC = () => {
  const {
    selectedStoreId,
    setSelectedStoreId,
    stores,
    products,
    pets,
    activePet,
    cartItems,
    cartGrooming,
    addToCart,
    updateCartQty,
    setCartGrooming,
    setIsCheckoutOpen,
  } = usePetHub();

  const store = stores.find((s) => s.id === selectedStoreId) || stores[0];
  const [activeSection, setActiveSection] = useState<'hybrid' | 'products' | 'grooming'>('hybrid');

  // Grooming booking state
  const [selectedPetId, setSelectedPetId] = useState<string>(activePet.id);
  const selectedPet = pets.find((p) => p.id === selectedPetId) || activePet;
  const [selectedSize, setSelectedSize] = useState<PetSize>(selectedPet.size);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(GROOMING_SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState<string>('Hoje (Quarta)');
  const [selectedTime, setSelectedTime] = useState<string>('16:00');

  if (!selectedStoreId) return null;

  const selectedService =
    GROOMING_SERVICES.find((s) => s.id === selectedServiceId) || GROOMING_SERVICES[0];
  const currentServicePrice = selectedService.basePriceBySize[selectedSize];

  const handleConfirmGroomingInOrder = () => {
    setCartGrooming({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      petId: selectedPet.id,
      petName: selectedPet.name,
      petBreed: selectedPet.breed,
      size: selectedSize,
      date: selectedDate,
      time: selectedTime,
      price: currentServicePrice,
    });
  };

  const getCartQty = (productId: string) =>
    cartItems.find((i) => i.product.id === productId)?.quantity || 0;

  const productsTotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const groomingTotal = cartGrooming ? cartGrooming.price : 0;
  const hybridTotal = productsTotal + groomingTotal;
  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0) + (cartGrooming ? 1 : 0);

  return (
    <div className="absolute inset-0 z-30 bg-[#FAF5F2] flex flex-col overflow-hidden">
      {/* Top Store Header */}
      <div className="bg-white border-b border-[#E8DDD8] px-4 pt-3.5 pb-3 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <button
            onClick={() => setSelectedStoreId(null)}
            className="w-8 h-8 rounded-full bg-[#FAF5F2] border border-[#E8DDD8] flex items-center justify-center text-[#2D1E1A] hover:border-[#A84A32]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-extrabold">
            Comanda Híbrida (Produto + Serviço)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={store.image}
            alt={store.name}
            className="w-12 h-12 rounded-2xl object-cover border border-[#E8DDD8]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#2D1E1A] truncate">{store.name}</h2>
              <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-[#A84A32]">
                <Star className="w-3.5 h-3.5 fill-[#A84A32]" />
                {store.rating}
              </span>
            </div>
            <p className="text-[11px] text-[#7A6660] flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-[#A84A32]" /> {store.distanceKm} km
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-[#A84A32]" /> {store.etaMinutes}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Frete Grátis</span>
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#FAF5F2] p-1 rounded-2xl mt-3 border border-[#E8DDD8]">
          <button
            onClick={() => setActiveSection('hybrid')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition ${
              activeSection === 'hybrid'
                ? 'bg-white text-[#A84A32] shadow-xs'
                : 'text-[#7A6660]'
            }`}
          >
            Tudo (Híbrido)
          </button>
          <button
            onClick={() => setActiveSection('grooming')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition ${
              activeSection === 'grooming'
                ? 'bg-white text-[#A84A32] shadow-xs'
                : 'text-[#7A6660]'
            }`}
          >
            🛁 Banho & Tosa
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition ${
              activeSection === 'products'
                ? 'bg-white text-[#A84A32] shadow-xs'
                : 'text-[#7A6660]'
            }`}
          >
            🛍️ Produtos
          </button>
        </div>
      </div>

      {/* Scrollable Store Body */}
      <div className="flex-1 overflow-y-auto clean-scrollbar px-4 py-3.5 space-y-5 pb-28">
        {/* 1. AGENDAMENTO DE BANHO E TOSA (Porte P, M, G + bloqueio <2h) */}
        {(activeSection === 'hybrid' || activeSection === 'grooming') && (
          <div className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
                  <Bath className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                    Agendar Banho & Tosa
                  </h3>
                  <p className="text-[10px] text-[#7A6660]">
                    Reserva de baia em tempo real na mesma comanda
                  </p>
                </div>
              </div>
              {cartGrooming && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  ✓ Na Comanda
                </span>
              )}
            </div>

            {/* Pet & Size (P, M, G) Selector */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6660] mb-1">
                  1. Qual Pet?
                </label>
                <div className="flex gap-1.5">
                  {pets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPetId(p.id);
                        setSelectedSize(p.size);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                        selectedPetId === p.id
                          ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                          : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#7A6660]'
                      }`}
                    >
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6660] mb-1">
                  2. Porte (Baia)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['P', 'M', 'G'] as PetSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-1.5 rounded-xl border text-xs font-extrabold transition ${
                        selectedSize === sz
                          ? 'bg-[#A84A32] border-[#A84A32] text-white'
                          : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grooming Service Options */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#7A6660] mb-1.5">
                3. Escolha o Pacote de Estética
              </label>
              <div className="space-y-2">
                {GROOMING_SERVICES.map((srv) => {
                  const isSelected = srv.id === selectedServiceId;
                  const price = srv.basePriceBySize[selectedSize];
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`w-full text-left p-2.5 rounded-2xl border transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#FDF4F1]/70 border-[#A84A32]'
                          : 'bg-[#FAF5F2]/60 border-[#E8DDD8] hover:border-[#A84A32]/40'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#2D1E1A]">{srv.name}</span>
                        </div>
                        <p className="text-[10px] text-[#7A6660] mt-0.5 line-clamp-2">
                          {srv.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-extrabold text-[#A84A32]">
                          R$ {price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[9px] text-[#7A6660]">Porte {selectedSize}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Slots (Blocking slots < 2h advance notice) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase text-[#7A6660] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#A84A32]" />
                  <span>4. Data & Horário Livre</span>
                </label>
                <span className="text-[10px] text-[#A84A32] font-semibold">
                  Trava mín. 2h antecedência
                </span>
              </div>

              {/* Date pills */}
              <div className="flex gap-1.5 mb-2.5">
                {['Hoje (Quarta)', 'Amanhã (Quinta)', 'Sexta, 25/11'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                      selectedDate === d
                        ? 'bg-[#2D1E1A] text-white border-[#2D1E1A]'
                        : 'bg-[#FAF5F2] text-[#7A6660] border-[#E8DDD8]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Time slots grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {GROOMING_TIME_SLOTS.map((slot) => {
                  const isLocked = slot.blockedLessThan2h && selectedDate.startsWith('Hoje');
                  const isChosen = selectedTime === slot.time && !isLocked;
                  return (
                    <button
                      key={slot.time}
                      disabled={isLocked}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-1 rounded-xl border text-center transition relative ${
                        isLocked
                          ? 'bg-[#F4E8E2]/60 border-[#E8DDD8] text-[#7A6660]/50 cursor-not-allowed'
                          : isChosen
                          ? 'bg-[#A84A32] border-[#A84A32] text-white font-extrabold shadow-xs'
                          : 'bg-white border-[#E8DDD8] text-[#2D1E1A] hover:border-[#A84A32] font-bold'
                      }`}
                      title={
                        isLocked
                          ? 'Bloqueado: Menos de 2h de antecedência para preparação da baia'
                          : 'Horário disponível'
                      }
                    >
                      <div className="flex items-center justify-center gap-1 text-xs">
                        {isLocked && <Lock className="w-3 h-3" />}
                        <span>{slot.time}</span>
                      </div>
                      <span className="block text-[9px] opacity-80">
                        {isLocked ? '< 2h bloq.' : `Baia ${slot.bayType}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#7A6660] bg-[#FAF5F2] px-2.5 py-1.5 rounded-xl border border-[#E8DDD8]">
                <AlertCircle className="w-3.5 h-3.5 text-[#A84A32] shrink-0" />
                <span>
                  Horários até 15:30 estão bloqueados (regra de 2h de antecedência mínima).
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmGroomingInOrder}
              className="w-full py-2.5 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {cartGrooming
                  ? `Atualizar Banho na Comanda (R$ ${currentServicePrice
                      .toFixed(2)
                      .replace('.', ',')})`
                  : `Incluir Banho na Comanda (+ R$ ${currentServicePrice
                      .toFixed(2)
                      .replace('.', ',')})`}
              </span>
            </button>
          </div>
        )}

        {/* 2. CATÁLOGO DE PRODUTOS FÍSICOS DA LOJA */}
        {(activeSection === 'hybrid' || activeSection === 'products') && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#A84A32]" />
                <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                  Adicionar Produtos Físicos à Comanda
                </h3>
              </div>
              <span className="text-[10px] text-[#7A6660]">Entrega junto ou no balcão</span>
            </div>

            {products.map((prod) => {
              const qty = getCartQty(prod.id);
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border p-3 flex items-center gap-3 shadow-clean transition ${
                    prod.paused
                      ? 'border-[#E8DDD8] opacity-60 bg-[#FAF5F2]'
                      : qty > 0
                      ? 'border-[#A84A32]'
                      : 'border-[#E8DDD8]'
                  }`}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#FAF5F2] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {prod.discountTag && (
                        <span className="px-1.5 py-0.2 rounded bg-[#FDF4F1] text-[#A84A32] text-[9px] font-extrabold">
                          {prod.discountTag}
                        </span>
                      )}
                      {prod.paused && (
                        <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 text-[9px] font-extrabold">
                          Pausado pelo Lojista
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-[#2D1E1A] line-clamp-1 mt-0.5">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-[#7A6660] line-clamp-1 mt-0.5">
                      {prod.description}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-[#7A6660] line-through mr-1.5">
                            R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                        <span className="text-xs font-extrabold text-[#A84A32]">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {prod.paused ? (
                        <span className="text-[10px] font-bold text-red-600">Esgotado</span>
                      ) : qty > 0 ? (
                        <div className="flex items-center gap-2 bg-[#FDF4F1] border border-[#A84A32]/30 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateCartQty(prod.id, -1)}
                            className="w-5 h-5 rounded-full bg-white text-[#A84A32] flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold text-[#2D1E1A]">{qty}</span>
                          <button
                            onClick={() => updateCartQty(prod.id, 1)}
                            className="w-5 h-5 rounded-full bg-[#A84A32] text-white flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="px-3 py-1 rounded-full bg-[#FDF4F1] hover:bg-[#A84A32] text-[#A84A32] hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Adicionar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Hybrid Comanda Bar */}
      {totalCount > 0 && (
        <div className="absolute bottom-3 inset-x-3 z-40">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-[#A84A32] hover:bg-[#8E3B26] text-white p-3.5 rounded-2xl shadow-floating flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-xs font-extrabold">
                {totalCount}
              </div>
              <div className="text-left">
                <span className="block text-xs font-extrabold">
                  Ver Comanda Híbrida Unificada
                </span>
                <span className="block text-[10px] text-white/85">
                  {cartItems.length} prod(s) {cartGrooming ? `+ Banho (${cartGrooming.petName})` : ''}
                </span>
              </div>
            </div>
            <span className="text-sm font-extrabold">
              R$ {hybridTotal.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
