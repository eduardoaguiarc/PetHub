import React, { useState } from 'react';
import {
  BadgeCheck,
  SlidersHorizontal,
  PawPrint,
  IdCard,
  ShieldCheck,
  AlertCircle,
  Wallet,
  CreditCard,
  Gift,
  HeartHandshake,
  MessageSquare,
  Bell,
  Calendar,
  MapPin,
  ChevronRight,
  Star,
  X,
  Check,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { PetProfile } from '../../types/pethub';

export const ProfileTab: React.FC = () => {
  const {
    pets,
    cashbackBalance,
    clubPoints,
    userAddress,
    orders,
    submitOrderReview,
    pushToast,
    setTutorTab,
  } = usePetHub();

  const [selectedPetCard, setSelectedPetCard] = useState<PetProfile | null>(null);
  const [showCardSwitcher, setShowCardSwitcher] = useState(false);
  const [activeCardLabel, setActiveCardLabel] = useState('Mastercard •••• 8492');
  const [quickRating, setQuickRating] = useState<number>(5);

  const latestOrder = orders[0];

  return (
    <div className="pb-24 px-4 pt-4 space-y-4">
      {/* Top User Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
              alt="Eduardo Silva"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#A84A32]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#A84A32] text-white text-xs flex items-center justify-center shadow">
              🏅
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-base font-extrabold text-[#2D1E1A]">Eduardo Silva</h1>
              <BadgeCheck className="w-4 h-4 text-[#A84A32]" />
            </div>
            <button
              onClick={() =>
                pushToast('Clube PetHub Ouro', 'Benefícios ativos: 3% Cashback + Táxi Dog Grátis.')
              }
              className="text-xs font-bold text-[#A84A32] flex items-center gap-0.5 hover:underline"
            >
              <span>Clube PetHub Ouro</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-extrabold">
                💎 {clubPoints.toLocaleString('pt-BR')} pts
              </span>
              <span className="text-[11px] text-[#7A6660] font-medium">Nível VIP</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => pushToast('Preferências', 'Notificações WhatsApp e FaceID ativados.')}
          className="w-9 h-9 rounded-full bg-white border border-[#E8DDD8] flex items-center justify-center text-[#2D1E1A]"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Meus Pets & Carteirinhas Sanitárias */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <PawPrint className="w-4 h-4 text-[#A84A32]" />
            <h2 className="text-sm font-extrabold text-[#2D1E1A]">Meus Pets</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F4E8E2] text-[#7A6660] text-[10px] font-bold">
              {pets.length} ativos
            </span>
          </div>

          <button
            onClick={() => setSelectedPetCard(pets[0])}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A84A32] hover:underline"
          >
            <span>Carteirinhas</span>
            <IdCard className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {pets.map((pet) => (
            <div
              key={pet.id}
              onClick={() => setSelectedPetCard(pet)}
              className="cursor-pointer w-56 shrink-0 bg-white rounded-2xl border border-[#E8DDD8] hover:border-[#A84A32] p-3 shadow-clean transition"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E8DDD8]"
                  />
                  <div>
                    <h3 className="text-xs font-extrabold text-[#2D1E1A]">{pet.name}</h3>
                    <p className="text-[10px] text-[#7A6660]">
                      {pet.breed} • {pet.weight}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-bold">
                  {pet.age}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#FAF5F2]">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-extrabold ${
                    pet.badgeStatus === 'ok' ? 'text-[#A84A32]' : 'text-amber-700'
                  }`}
                >
                  {pet.badgeStatus === 'ok' ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {pet.badgeText}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5F2] text-[#2D1E1A] text-[10px] font-bold">
                  Histórico
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PETHUB PAY: Carteira & Saldo Cashback (R$ 42,80) */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#A84A32]">
                PETHUB PAY
              </span>
              <h3 className="text-xs font-extrabold text-[#2D1E1A]">Carteira & Saldo</h3>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-[#7A6660]">Cashback</span>
            <span className="text-base font-extrabold text-[#A84A32]">
              R$ {cashbackBalance.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Saved Card Box */}
        <div className="bg-[#FAF5F2] rounded-2xl p-3 border border-[#E8DDD8]/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-[#2D1E1A]" />
            <div>
              <span className="text-xs font-extrabold text-[#2D1E1A] block">
                {activeCardLabel}
              </span>
              <span className="text-[10px] text-[#7A6660]">
                Padrão • Pix cadastrado
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCardSwitcher(!showCardSwitcher)}
            className="text-xs font-bold text-[#A84A32] hover:underline"
          >
            Trocar
          </button>
        </div>

        {showCardSwitcher && (
          <div className="bg-[#FAF5F2] rounded-2xl p-2 border border-[#E8DDD8] space-y-1 text-xs">
            {['Mastercard •••• 8492', 'Visa Infinite •••• 3104', 'Apple Pay / Pix Automático'].map(
              (card) => (
                <button
                  key={card}
                  onClick={() => {
                    setActiveCardLabel(card);
                    setShowCardSwitcher(false);
                    pushToast('Método atualizado', `${card} definido como padrão.`);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white flex items-center justify-between font-semibold"
                >
                  <span>{card}</span>
                  {activeCardLabel === card && <Check className="w-3.5 h-3.5 text-[#A84A32]" />}
                </button>
              )
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A84A32]" />
            <span>
              <strong className="text-[#2D1E1A]">PetHub Prime Ativo:</strong>{' '}
              <span className="text-[#7A6660]">15% OFF + Frete Grátis</span>
            </span>
          </div>
          <button
            onClick={() => pushToast('PetHub Prime', 'Sua assinatura está ativa e renova dia 15.')}
            className="font-bold text-[#A84A32] hover:underline"
          >
            Gerenciar
          </button>
        </div>
      </div>

      {/* Avaliação Rápida 1–5 Estrelas Pós-Serviço */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-3.5 shadow-clean">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
              Avaliação Pós-Serviço
            </span>
            <h3 className="text-xs font-extrabold text-[#2D1E1A]">
              Como foi a experiência no Vila Pet & Banho Spa?
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700">+50 pts</span>
        </div>

        <div className="flex items-center justify-between bg-[#FAF5F2] rounded-2xl px-3 py-2 border border-[#E8DDD8]">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setQuickRating(star);
                  if (latestOrder) {
                    submitOrderReview(latestOrder.id, star, 'Avaliação rápida pelo perfil');
                  }
                }}
                className="p-0.5 hover:scale-110 transition"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= quickRating
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-[#E8DDD8]'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-extrabold text-[#A84A32]">
            {quickRating} estrelas
          </span>
        </div>
      </div>

      {/* Abrir Recompensas Card */}
      <button
        onClick={() => setTutorTab('ofertas')}
        className="w-full text-left bg-gradient-to-r from-[#FDF4F1] to-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8DDD8] flex items-center justify-center text-[#A84A32]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#2D1E1A]">
              Abrir Recompensas 🎁
            </h3>
            <p className="text-[11px] text-[#7A6660]">
              4 cupons disponíveis para ativar hoje
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#7A6660]" />
      </button>

      {/* Indique outro tutor */}
      <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#2D1E1A]">Indique outro tutor</h3>
            <p className="text-[11px] text-[#7A6660]">
              Ganhe R$ 20 em ração ou banho
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            pushToast('Link Copiado!', 'Código EDUARDO20 copiado para compartilhar no WhatsApp.')
          }
          className="px-3.5 py-1.5 rounded-full bg-[#A84A32] text-white text-xs font-bold"
        >
          Indicar
        </button>
      </div>

      {/* Menu List matching tela_perfil.jpg */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] divide-y divide-[#FAF5F2] shadow-clean overflow-hidden">
        <button
          onClick={() =>
            pushToast('Conversas Ativas', '2 mensagens do Spa Vila Pet sobre a hidratação do Thor.')
          }
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FAF5F2] transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#2D1E1A]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#2D1E1A]">Conversas & Petshops</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#A84A32] text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
            <ChevronRight className="w-4 h-4 text-[#7A6660]" />
          </div>
        </button>

        <button
          onClick={() =>
            pushToast('Notificações', 'Lembrete sanitário: Vermífugo da Mia vence em 4 dias.')
          }
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FAF5F2] transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#2D1E1A]">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#2D1E1A]">Notificações e Avisos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#A84A32] text-white text-[10px] font-bold flex items-center justify-center">
              5
            </span>
            <ChevronRight className="w-4 h-4 text-[#7A6660]" />
          </div>
        </button>

        <button
          onClick={() => setTutorTab('pedidos')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FAF5F2] transition"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#2D1E1A]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#2D1E1A] block">
                Agendamentos (Spa & Banho)
              </span>
              <span className="text-[10px] text-[#A84A32] font-semibold">
                Hoje às 16:00 • Thor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-bold">
              Confirmado
            </span>
            <ChevronRight className="w-4 h-4 text-[#7A6660]" />
          </div>
        </button>

        <button
          onClick={() => pushToast('Endereço Principal', `${userAddress} • Moema, São Paulo`)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-[#FAF5F2] transition"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#2D1E1A]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#2D1E1A] block">
                Endereços de Entrega
              </span>
              <span className="text-[10px] text-[#7A6660]">
                {userAddress} (Principal)
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7A6660]" />
        </button>
      </div>

      {/* Modal Carteirinha Sanitária Digital do Pet (Vacinas & Vermífugo) */}
      {selectedPetCard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDD8] max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedPetCard.avatar}
                  alt={selectedPetCard.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#A84A32]"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
                    Carteirinha Sanitária Digital
                  </span>
                  <h3 className="text-sm font-extrabold text-[#2D1E1A]">
                    {selectedPetCard.name} ({selectedPetCard.breed})
                  </h3>
                  <p className="text-[11px] text-[#7A6660]">
                    {selectedPetCard.age} • {selectedPetCard.weight} • Porte {selectedPetCard.size}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPetCard(null)}
                className="w-8 h-8 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#7A6660]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Switch between pets inside modal */}
            <div className="flex gap-2">
              {pets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPetCard(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${
                    selectedPetCard.id === p.id
                      ? 'bg-[#A84A32] text-white border-[#A84A32]'
                      : 'bg-[#FAF5F2] text-[#7A6660] border-[#E8DDD8]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Vaccines List */}
            <div className="space-y-2">
              <span className="block text-[10px] font-extrabold uppercase text-[#7A6660]">
                Histórico de Vacinas & Vermífugo
              </span>
              {selectedPetCard.vaccines.map((vac) => (
                <div
                  key={vac.id}
                  className="p-2.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#2D1E1A]">{vac.name}</h4>
                    <span className="text-[10px] text-[#7A6660]">
                      Aplicada: {vac.date} • Próx: {vac.nextDue}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      vac.status === 'ok'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vac.status === 'ok' ? 'Em dia' : 'Em 4 dias'}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#FDF4F1] rounded-2xl p-3 border border-[#A84A32]/20 text-[11px] text-[#2D1E1A]">
              <strong>Observação Clínica para Banho:</strong> {selectedPetCard.notes}
            </div>

            <button
              onClick={() => setSelectedPetCard(null)}
              className="w-full py-2.5 rounded-2xl bg-[#A84A32] text-white text-xs font-bold"
            >
              Fechar Carteirinha
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
