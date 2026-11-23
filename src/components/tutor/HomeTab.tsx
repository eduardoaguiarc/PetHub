import React, { useState } from 'react';
import {
  ChevronDown,
  Bell,
  Check,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Bath,
  PawPrint,
  Pill,
  Cookie,
  Brush,
  ToyBrick,
  Stethoscope,
  TicketPercent,
  Timer,
  Zap,
  X,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { CategoryId } from '../../types/pethub';

const CATEGORIES: {
  id: CategoryId;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'banho-tosa', label: 'Banho/Tosa', badge: 'Hoje', icon: Bath },
  { id: 'racoes', label: 'Rações', icon: PawPrint },
  { id: 'farmacia', label: 'Farmácia', badge: 'Express', icon: Pill },
  { id: 'petiscos', label: 'Petiscos', icon: Cookie },
  { id: 'higiene', label: 'Higiene', icon: Brush },
  { id: 'brinquedos', label: 'Brinquedos', icon: ToyBrick },
  { id: 'clinicas', label: 'Clínicas', icon: Stethoscope },
  { id: 'cupons', label: 'Cupons', icon: TicketPercent },
];

export const HomeTab: React.FC = () => {
  const {
    userAddress,
    setUserAddress,
    pets,
    activePetId,
    setActivePetId,
    activePet,
    addPet,
    products,
    addToCart,
    setSelectedStoreId,
    setTutorTab,
    flashTimerSeconds,
    pushToast,
  } = usePetHub();

  const [showAddressMenu, setShowAddressMenu] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'dog' | 'cat'>('dog');

  // Format flash countdown
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  // Premier 15kg for Thor or Churu for Mia
  const quickReorderProduct =
    activePet.species === 'cat'
      ? products.find((p) => p.id === 'prod-churu') || products[0]
      : products.find((p) => p.id === 'prod-premier-15kg') || products[0];

  const flashProducts = products.filter((p) => p.isFlashOffer && !p.paused);

  const handleCategoryClick = (catId: CategoryId) => {
    if (catId === 'banho-tosa') {
      setSelectedStoreId('store-vila-pet');
      return;
    }
    if (catId === 'cupons') {
      setTutorTab('ofertas');
      return;
    }
    setTutorTab('busca');
  };

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;
    addPet({
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim() || (newPetSpecies === 'dog' ? 'SRD' : 'Felino'),
      age: '1 ano',
      weight: newPetSpecies === 'dog' ? '12kg' : '4kg',
      size: newPetSpecies === 'dog' ? 'M' : 'P',
      avatar:
        newPetSpecies === 'dog'
          ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      badgeText: 'Vacinas em dia',
      badgeStatus: 'ok',
      dewormingNext: 'Em dia',
      vaccines: [
        { id: 'vn1', name: 'Múltipla Anual', date: 'Hoje', nextDue: 'Nov/2027', status: 'ok' },
      ],
    });
    setNewPetName('');
    setNewPetBreed('');
    setShowAddPetModal(false);
  };

  return (
    <div className="pb-24">
      {/* Minimalist iFood-style Top Bar */}
      <div className="sticky top-0 z-20 bg-[#FAF5F2]/95 backdrop-blur-md px-4 pt-3.5 pb-2.5 border-b border-[#E8DDD8]/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
              PETHUB
            </span>
            <button
              onClick={() => setShowAddressMenu(!showAddressMenu)}
              className="flex items-center gap-1 text-left group"
            >
              <span className="text-sm font-extrabold text-[#2D1E1A] group-hover:text-[#A84A32] transition">
                {userAddress}
              </span>
              <ChevronDown className="w-4 h-4 text-[#A84A32]" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() =>
                pushToast('Central de Alertas', 'Thor tem banho agendado hoje às 16:00 no Spa Vila Pet.')
              }
              className="relative w-9 h-9 rounded-full bg-white border border-[#E8DDD8] flex items-center justify-center text-[#2D1E1A] hover:border-[#A84A32] transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#A84A32]" />
            </button>

            <button
              onClick={() => setTutorTab('perfil')}
              className="relative w-9 h-9 rounded-full border-2 border-[#A84A32] p-0.5 overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Tutor"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Address quick selector */}
        {showAddressMenu && (
          <div className="mt-2 bg-white rounded-2xl border border-[#E8DDD8] p-2 shadow-clean-md text-xs space-y-1">
            {['Rua das Palmeiras, 14', 'Av. Ibirapuera, 2315 • Escritório', 'Rua Oscar Freire, 440'].map(
              (addr) => (
                <button
                  key={addr}
                  onClick={() => {
                    setUserAddress(addr);
                    setShowAddressMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                    userAddress === addr
                      ? 'bg-[#FDF4F1] text-[#A84A32] font-bold'
                      : 'hover:bg-[#FAF5F2] text-[#2D1E1A]'
                  }`}
                >
                  <span>{addr}</span>
                  {userAddress === addr && <Check className="w-3.5 h-3.5 text-[#A84A32]" />}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className="px-4 pt-3 space-y-5">
        {/* Active Pet Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6660]">
              Personalizado para seu pet
            </span>
            <button
              onClick={() => setTutorTab('perfil')}
              className="text-[11px] font-bold text-[#A84A32] hover:underline"
            >
              Trocar perfil
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {pets.map((pet) => {
              const isSelected = pet.id === activePetId;
              return (
                <button
                  key={pet.id}
                  onClick={() => setActivePetId(pet.id)}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs transition shrink-0 border ${
                    isSelected
                      ? 'bg-[#A84A32] text-white border-[#A84A32] shadow-sm'
                      : 'bg-white text-[#2D1E1A] border-[#E8DDD8] hover:border-[#A84A32]/50'
                  }`}
                >
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/30"
                  />
                  <span className="font-bold">{pet.name}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-white/85' : 'text-[#7A6660]'}`}>
                    ({pet.breed.split(' ')[0]})
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              );
            })}

            <button
              onClick={() => setShowAddPetModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4E8E2] text-[#A84A32] border border-[#E8DDD8] hover:bg-[#EAD7CE] transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Pet</span>
            </button>
          </div>
        </div>

        {/* Clean Hero Banner: Quarta do Banho Cheiroso */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#A84A32] to-[#8F3A24] text-white p-4 shadow-clean overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 space-y-2 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-bold">
                🛁 Quarta Especial
              </span>
              <h2 className="text-lg font-extrabold leading-tight">
                Quarta do Banho Cheiroso
              </h2>
              <p className="text-[11px] text-white/90 leading-relaxed">
                Busca & leva grátis no seu bairro a partir de{' '}
                <strong className="font-extrabold text-white">R$ 39,90</strong>
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setSelectedStoreId('store-vila-pet')}
                  className="px-4 py-2 rounded-full bg-white text-[#A84A32] font-extrabold text-xs shadow-sm hover:bg-[#FAF5F2] transition"
                >
                  Agendar Agora
                </button>
              </div>
            </div>

            <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80"
                alt="Banho Cheiroso"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Quick Reorder Card: Peça de Novo para Thor / Mia */}
        <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-[#A84A32]" />
              <span className="text-xs font-extrabold text-[#2D1E1A]">
                Peça de Novo para {activePet.name}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-bold">
              <Zap className="w-3 h-3" /> 25–35 min
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={quickReorderProduct.image}
              alt={quickReorderProduct.name}
              className="w-14 h-14 rounded-xl object-cover bg-[#FAF5F2] border border-[#E8DDD8] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-[#2D1E1A] truncate">
                {quickReorderProduct.name}
              </h3>
              <p className="text-[11px] text-[#7A6660] truncate mt-0.5">
                Vila Pet & Banho Spa • Reposição mensal
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-extrabold text-[#A84A32]">
                  R$ {quickReorderProduct.price.toFixed(2).replace('.', ',')}
                </span>
                <button
                  onClick={() => addToCart(quickReorderProduct, 1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A84A32] hover:bg-[#8E3B26] text-white text-[11px] font-bold transition shadow-sm"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Repor</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Categories Grid (Clean iFood style) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-[#2D1E1A]">Categorias</h3>
            <button
              onClick={() => setTutorTab('busca')}
              className="text-xs font-bold text-[#A84A32] hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group relative flex flex-col items-center p-2.5 rounded-2xl bg-white border border-[#E8DDD8] hover:border-[#A84A32] transition shadow-clean"
                >
                  {cat.badge && (
                    <span
                      className={`absolute -top-1.5 px-2 py-0.2 rounded-full text-[9px] font-extrabold text-white shadow-sm ${
                        cat.badge === 'Express' ? 'bg-[#D97706]' : 'bg-[#2D1E1A]'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5F2] group-hover:bg-[#FDF4F1] flex items-center justify-center text-[#A84A32] mb-1.5 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#2D1E1A] text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ofertas Relâmpago with Live Countdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-[#A84A32]" />
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">Ofertas Relâmpago</h3>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#F4E8E2] text-[10px] font-bold text-[#A84A32] flex items-center gap-1">
              <span>Termina em</span>
              <span className="font-mono font-extrabold text-[#2D1E1A]">
                {formatTime(flashTimerSeconds)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {flashProducts.map((prod) => (
              <div
                key={prod.id}
                className="w-40 shrink-0 bg-white rounded-2xl border border-[#E8DDD8] p-2.5 shadow-clean flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-24 rounded-xl overflow-hidden bg-[#FAF5F2] mb-2">
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
                  <h4 className="text-xs font-bold text-[#2D1E1A] line-clamp-2 leading-snug">
                    {prod.name}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-[#FAF5F2] flex items-end justify-between">
                  <div>
                    {prod.originalPrice && (
                      <span className="block text-[10px] text-[#7A6660] line-through">
                        R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-xs font-extrabold text-[#A84A32]">
                      R$ {prod.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="w-7 h-7 rounded-full bg-[#FDF4F1] hover:bg-[#A84A32] text-[#A84A32] hover:text-white flex items-center justify-center transition"
                    title="Adicionar à sacola"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Store Card for Hybrid Order */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-extrabold text-[#2D1E1A]">Lojas perto de você</h3>
            <span className="text-[11px] text-[#7A6660]">Comanda Híbrida</span>
          </div>

          <button
            onClick={() => setSelectedStoreId('store-vila-pet')}
            className="w-full text-left bg-white rounded-2xl border border-[#E8DDD8] hover:border-[#A84A32] p-3 shadow-clean flex items-center gap-3 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=200&q=80"
              alt="Vila Pet & Banho Spa"
              className="w-14 h-14 rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#2D1E1A] truncate">
                  Vila Pet & Banho Spa
                </h4>
                <span className="text-[11px] font-bold text-[#A84A32]">★ 4.9</span>
              </div>
              <p className="text-[11px] text-[#7A6660] mt-0.5">
                Pet Shop & Grooming • 1.2 km • Grátis
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#FAF5F2] text-[#2D1E1A] text-[10px] font-semibold">
                  25–35 min
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-bold">
                  🛁 Banho livre hoje às 16:00
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDD8] max-w-xs w-full p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">Cadastrar Novo Pet</h3>
              <button
                onClick={() => setShowAddPetModal(false)}
                className="w-7 h-7 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#7A6660]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePet} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewPetSpecies('dog')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    newPetSpecies === 'dog'
                      ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                      : 'border-[#E8DDD8] text-[#7A6660]'
                  }`}
                >
                  🐶 Cachorro
                </button>
                <button
                  type="button"
                  onClick={() => setNewPetSpecies('cat')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    newPetSpecies === 'cat'
                      ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                      : 'border-[#E8DDD8] text-[#7A6660]'
                  }`}
                >
                  🐱 Gato
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="Nome do pet (ex: Luna)"
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F2] border border-[#E8DDD8] text-xs focus:outline-none focus:border-[#A84A32]"
              />
              <input
                type="text"
                placeholder="Raça (ex: Golden, SRD, Persa)"
                value={newPetBreed}
                onChange={(e) => setNewPetBreed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F2] border border-[#E8DDD8] text-xs focus:outline-none focus:border-[#A84A32]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#A84A32] text-white text-xs font-bold"
              >
                Salvar Pet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
