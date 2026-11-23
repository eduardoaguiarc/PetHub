import React, { useState } from 'react';
import {
  HelpCircle,
  Bike,
  Receipt,
  PawPrint,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShoppingBag,
  Clock,
  Store,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

const PRODUCT_STEP_LABELS: Record<number, string> = {
  1: 'Pedido recebido pelo petshop',
  2: 'Separando itens no estoque',
  3: 'Saiu para entrega com o motoboy',
  4: 'Produtos entregues com sucesso',
};

const GROOMING_STEP_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Check-in & Triagem Clínica na Baia',
    subtitle: 'Inspeção de pelagem, pele e ouvidos iniciada',
  },
  2: {
    title: 'Está no Banho & Hidratação 🫧',
    subtitle: 'Secagem e corte de unhas a seguir',
  },
  3: {
    title: 'Na Secagem, Escovação & Unhas ✨',
    subtitle: 'Finalização com perfume hipoalergênico',
  },
  4: {
    title: 'Pronto, Cheiroso & Finalizado! 🐾',
    subtitle: 'Aguardando Táxi Dog ou retirada no balcão',
  },
};

export const OrdersTab: React.FC = () => {
  const {
    orders,
    triggerCrossSell,
    respondCrossSell,
    advanceProductStep,
    advanceGroomingStep,
    submitOrderReview,
    products,
    addToCart,
    pushToast,
  } = usePetHub();

  const [tabMode, setTabMode] = useState<'active' | 'history'>('active');
  const [selectedRating, setSelectedRating] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState<Record<string, string>>({});

  // Tutor's orders (include Eduardo Silva's orders)
  const myOrders = orders.filter((o) => o.customerName.includes('Eduardo'));
  const activeOrder = myOrders[0] || orders[0];

  const premierProduct =
    products.find((p) => p.id === 'prod-premier-15kg') || products[0];

  return (
    <div className="pb-24 px-4 pt-3.5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-[#2D1E1A]">Meus Pedidos</h1>
        <button
          onClick={() =>
            pushToast('Suporte PetHub SLA', 'Atendimento prioritário via WhatsApp ativo.')
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4E8E2] text-[#A84A32] text-xs font-bold"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ajuda</span>
        </button>
      </div>

      {/* Switch Em andamento / Histórico */}
      <div className="grid grid-cols-2 bg-[#F4E8E2] p-1 rounded-full border border-[#E8DDD8]">
        <button
          onClick={() => setTabMode('active')}
          className={`py-2 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
            tabMode === 'active'
              ? 'bg-[#A84A32] text-white shadow-xs'
              : 'text-[#7A6660]'
          }`}
        >
          <span>Em andamento</span>
          <span
            className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
              tabMode === 'active'
                ? 'bg-white text-[#A84A32]'
                : 'bg-[#E8DDD8] text-[#2D1E1A]'
            }`}
          >
            {myOrders.length}
          </span>
        </button>

        <button
          onClick={() => setTabMode('history')}
          className={`py-2 rounded-full text-xs font-extrabold transition ${
            tabMode === 'history'
              ? 'bg-[#A84A32] text-white shadow-xs'
              : 'text-[#7A6660]'
          }`}
        >
          Histórico & Avaliar
        </button>
      </div>

      {/* Simulation Bar for Cross-selling / Clinical Triage 1-click */}
      {activeOrder && (
        <div className="bg-white rounded-2xl border border-dashed border-[#A84A32]/60 p-3 shadow-clean flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32] block">
              ⚡ Simulador B2B2C Ao Vivo
            </span>
            <p className="text-[11px] text-[#7A6660] leading-tight">
              Dispare uma recomendação clínica vinda da baia do lojista
            </p>
          </div>
          <button
            onClick={() => triggerCrossSell(activeOrder.id)}
            className="px-3 py-2 rounded-xl bg-[#FDF4F1] hover:bg-[#A84A32] text-[#A84A32] hover:text-white border border-[#A84A32]/30 text-[11px] font-extrabold shrink-0 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simular Triagem</span>
          </button>
        </div>
      )}

      {/* Cross-selling / Triagem Clínica Alert Card (1-click Approval) */}
      {activeOrder?.crossSell && activeOrder.crossSell.status === 'pending' && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-4 shadow-md space-y-3 animate-pulse">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#2D1E1A] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                  Recomendação da Triagem Clínica • Ao Vivo
                </span>
                <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                  {activeOrder.crossSell.title}
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white text-[#A84A32] font-extrabold text-xs border border-amber-300 shrink-0">
              + R$ {activeOrder.crossSell.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <p className="text-[11px] text-[#2D1E1A]/90 bg-white/80 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
            "{activeOrder.crossSell.clinicalNote}"
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => respondCrossSell(activeOrder.id, true)}
              className="flex-1 py-2.5 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprovar com 1 Clique (+R$ 35,00)</span>
            </button>
            <button
              onClick={() => respondCrossSell(activeOrder.id, false)}
              className="px-3 py-2.5 rounded-2xl bg-white border border-[#E8DDD8] text-[#7A6660] text-xs font-bold hover:text-[#2D1E1A]"
            >
              Recusar
            </button>
          </div>
        </div>
      )}

      {activeOrder?.crossSell && activeOrder.crossSell.status === 'approved' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              Adicional aprovado: {activeOrder.crossSell.title}
            </span>
          </div>
          <span className="font-extrabold">+R$ 35,00</span>
        </div>
      )}

      {tabMode === 'active' ? (
        <div className="space-y-4">
          {/* Live Indicator Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A84A32] animate-ping" />
              <h2 className="text-sm font-extrabold text-[#2D1E1A]">
                Atividades em tempo real
              </h2>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
              AO VIVO
            </span>
          </div>

          {myOrders.map((ord) => (
            <div key={ord.id} className="space-y-3.5">
              {/* Pending SLA badge if newly created */}
              {ord.status === 'pending_sla' && (
                <div className="bg-[#FDF4F1] border border-[#A84A32]/30 rounded-2xl px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A84A32]" />
                    <span className="text-xs font-bold text-[#2D1E1A]">
                      Aguardando aceite do Lojista (SLA 15 min)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[#A84A32]">
                    {Math.floor(ord.slaRemainingSeconds / 60)}:
                    {String(ord.slaRemainingSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* CARD 1: RASTREAMENTO DA ENTREGA DOS PRODUTOS */}
              {ord.items.length > 0 && (
                <div className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] flex items-center justify-center text-[#A84A32] font-extrabold text-xs">
                        🏪
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                          {ord.storeName}
                        </h3>
                        <p className="text-[11px] text-[#7A6660]">
                          Pedido {ord.code} • R$ {ord.total.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-extrabold">
                      {ord.deliveryMethod === 'pickup' ? '🏪 Balcão' : '🛵 15–25 min'}
                    </span>
                  </div>

                  {/* Stepper Box */}
                  <div className="bg-[#FAF5F2] rounded-2xl p-3 space-y-2 border border-[#E8DDD8]/60">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-extrabold text-[#A84A32]">
                        {ord.deliveryMethod === 'pickup' ? (
                          <Store className="w-4 h-4" />
                        ) : (
                          <Bike className="w-4 h-4" />
                        )}
                        <span>
                          {ord.deliveryMethod === 'pickup' && ord.productStep >= 3
                            ? 'Pronto para retirada no balcão'
                            : PRODUCT_STEP_LABELS[ord.productStep]}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#7A6660]">
                        Etapa {ord.productStep} de 4
                      </span>
                    </div>

                    {/* 4-segment progress bar */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full transition-all ${
                            step <= ord.productStep ? 'bg-[#A84A32]' : 'bg-[#E8DDD8]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Product Items List */}
                  <div className="space-y-1.5">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#2D1E1A]">
                        <span className="w-5 h-5 rounded-md bg-[#FAF5F2] border border-[#E8DDD8] text-[10px] font-extrabold flex items-center justify-center text-[#7A6660]">
                          {item.quantity}
                        </span>
                        <span className="font-medium truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => advanceProductStep(ord.id)}
                      className="flex-1 py-2.5 rounded-full bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <span>
                        {ord.productStep < 4
                          ? 'Acompanhar entrega (Avançar etapa)'
                          : 'Entrega Concluída ✓'}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        pushToast(
                          `Nota Fiscal • Pedido ${ord.code}`,
                          `Split 90/10 processado. Total: R$ ${ord.total
                            .toFixed(2)
                            .replace('.', ',')}`
                        )
                      }
                      className="w-10 h-10 rounded-full bg-[#F4E8E2] text-[#2D1E1A] flex items-center justify-center hover:bg-[#E8DDD8]"
                      title="Ver Comanda"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* CARD 2: RASTREAMENTO AO VIVO DO BANHO & TOSA DO PET */}
              {ord.grooming && (
                <div className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80"
                          alt={ord.grooming.petName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#A84A32]"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#A84A32] text-white text-[10px] flex items-center justify-center">
                          🛁
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                            Spa Vila Pet
                          </h3>
                          <span className="px-2 py-0.2 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[9px] font-extrabold">
                            Estética
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6660]">
                          Para <strong className="text-[#2D1E1A]">{ord.grooming.petName}</strong> (
                          {ord.grooming.petBreed})
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#FAF5F2] border border-[#E8DDD8] text-[#2D1E1A] text-[10px] font-extrabold">
                      Término 16:45
                    </span>
                  </div>

                  {/* Grooming Live Stage Box */}
                  <div className="bg-[#FDF4F1]/80 rounded-2xl p-3 border border-[#A84A32]/20 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-[#2D1E1A]">
                          {ord.grooming.petName} •{' '}
                          {GROOMING_STEP_LABELS[ord.groomingStep].title}
                        </h4>
                        <p className="text-[11px] text-[#7A6660] mt-0.5">
                          {GROOMING_STEP_LABELS[ord.groomingStep].subtitle}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#A84A32] shrink-0">
                        {ord.groomingStep}/4
                      </span>
                    </div>

                    {/* 4-step bath bar */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full transition-all ${
                            step <= ord.groomingStep ? 'bg-[#A84A32]' : 'bg-[#E8DDD8]'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-[10px] font-bold text-[#A84A32] pt-0.5">
                      🚗 Táxi Dog Leva & Traz agendado para retorno às 17:00
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => advanceGroomingStep(ord.id)}
                      className="flex-1 py-2.5 rounded-full bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <PawPrint className="w-3.5 h-3.5" />
                      <span>
                        {ord.groomingStep < 4
                          ? 'Ver status do pet ao vivo (Avançar)'
                          : 'Banho Concluído • Avaliar'}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        pushToast(
                          'Chat com Banhista (Baia 03)',
                          'Banhista Lucas: "O Thor está super tranquilo na hidratação!"'
                        )
                      }
                      className="w-10 h-10 rounded-full bg-[#F4E8E2] text-[#2D1E1A] flex items-center justify-center hover:bg-[#E8DDD8]"
                      title="Falar com a Baia"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Peça de novo section matching tela_pedido.jpg */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-[#2D1E1A]">Peça de novo</h3>
                <p className="text-[11px] text-[#7A6660]">
                  Seus favoritos com entrega rápida
                </p>
              </div>
              <span className="text-xs font-bold text-[#A84A32]">Ver todos</span>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8DDD8] p-3.5 shadow-clean space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4E8E2] text-[#A84A32] font-extrabold text-xs flex items-center justify-center">
                    Petz
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#2D1E1A]">
                      Petz Bairro Nobre
                    </h4>
                    <p className="text-[10px] text-[#7A6660]">
                      25–35 min • Entrega R$ 4,90
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5F2] border border-[#E8DDD8] text-[#A84A32] text-[10px] font-bold">
                  Recorrente
                </span>
              </div>

              <div className="bg-[#FAF5F2] rounded-2xl p-2.5 flex items-center gap-3">
                <img
                  src={premierProduct.image}
                  alt={premierProduct.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-[#2D1E1A] truncate">
                    Ração Premier Fórmula Cães 15kg
                  </h5>
                  <p className="text-[10px] text-[#7A6660]">
                    Pediu pela última vez há 28 dias
                  </p>
                  <span className="text-xs font-extrabold text-[#A84A32] mt-0.5 block">
                    R$ 239,90
                  </span>
                </div>
              </div>

              <button
                onClick={() => addToCart(premierProduct, 1)}
                className="w-full py-2.5 rounded-full bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Adicionar à sacola</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ABA HISTÓRICO & AVALIAÇÃO 1-5 ESTRELAS PÓS-SERVIÇO */
        <div className="space-y-3">
          {myOrders.map((ord) => {
            const currentRating = selectedRating[ord.id] ?? ord.rating ?? 5;
            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#A84A32] uppercase">
                      Comanda Híbrida {ord.code}
                    </span>
                    <h3 className="text-xs font-extrabold text-[#2D1E1A]">
                      {ord.storeName}
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold text-[#2D1E1A]">
                    R$ {ord.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* 1-5 Star Rating Post-Service */}
                <div className="bg-[#FAF5F2] rounded-2xl p-3 border border-[#E8DDD8] space-y-2">
                  <span className="block text-[11px] font-extrabold text-[#2D1E1A]">
                    Avalie o Banho & Entrega (1 a 5 estrelas):
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setSelectedRating((prev) => ({ ...prev, [ord.id]: star }))
                        }
                        className="p-1 rounded-lg hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= currentRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-[#E8DDD8]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-[#A84A32] ml-2">
                      {currentRating}.0 / 5.0
                    </span>
                  </div>

                  <input
                    type="text"
                    value={reviewText[ord.id] ?? ord.reviewComment ?? ''}
                    onChange={(e) =>
                      setReviewText((prev) => ({ ...prev, [ord.id]: e.target.value }))
                    }
                    placeholder="Como o Thor voltou do banho? Deixe seu elogio..."
                    className="w-full bg-white border border-[#E8DDD8] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A84A32]"
                  />

                  <button
                    onClick={() =>
                      submitOrderReview(
                        ord.id,
                        currentRating,
                        reviewText[ord.id] || 'Thor voltou super cheiroso e entrega no prazo!'
                      )
                    }
                    className="w-full py-2 rounded-xl bg-[#A84A32] text-white text-xs font-bold"
                  >
                    {ord.rating ? 'Atualizar Avaliação ✓' : 'Enviar Avaliação (+50 pts Club)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
