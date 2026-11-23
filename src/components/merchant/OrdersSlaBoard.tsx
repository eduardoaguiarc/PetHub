import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShoppingBag,
  Bath,
  Truck,
  Store,
  Phone,
  ClipboardCheck,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

export const OrdersSlaBoard: React.FC = () => {
  const {
    orders,
    acceptOrder,
    rejectOrder,
    advanceProductStep,
    advanceGroomingStep,
    updateTriageChecklist,
    triggerCrossSell,
  } = usePetHub();

  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>(
    'Ruptura pontual de estoque / Baia em higienização'
  );

  const formatSla = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending_sla');
  const activeOrders = orders.filter((o) => o.status === 'accepted');
  const rejectedOrders = orders.filter((o) => o.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Top SLA Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8DDD8] p-4 shadow-clean flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6660]">
              Fila Pendente (SLA 15 min)
            </span>
            <p className="text-2xl font-extrabold text-[#A84A32] mt-1">
              {pendingOrders.length} pedido(s)
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DDD8] p-4 shadow-clean flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6660]">
              Comandas Híbridas em Execução
            </span>
            <p className="text-2xl font-extrabold text-[#2D1E1A] mt-1">
              {activeOrders.length} ativa(s)
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DDD8] p-4 shadow-clean flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6660]">
              Tempo Médio de Aceite (Hoje)
            </span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">02m 14s</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold">
            Dentro da Meta (&lt;15m)
          </span>
        </div>
      </div>

      {/* Kanban / Two-Column Live Order Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA 1: PEDIDOS PENDENTES COM CRONÔMETRO SLA 15:00 AO VIVO */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2D1E1A]">
                Novos Pedidos • Cronômetro SLA (15:00)
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-xs font-extrabold">
              {pendingOrders.length} aguardando
            </span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DDD8] p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">
                Zero pedidos pendentes na fila SLA!
              </h3>
              <p className="text-xs text-[#7A6660]">
                Crie uma nova Comanda Híbrida na visão do Tutor para vê-la aparecer aqui em tempo
                real com cronômetro regressivo de 15:00.
              </p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border-2 border-[#A84A32] p-5 shadow-clean-md space-y-4"
              >
                {/* Top Row + Live 15:00 Countdown */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#A84A32] text-white text-xs font-extrabold">
                        Comanda {order.code}
                      </span>
                      <span className="text-xs font-bold text-[#7A6660]">
                        {order.createdAt}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#2D1E1A] mt-1">
                      {order.customerName}
                    </h3>
                    <p className="text-xs text-[#7A6660] flex items-center gap-2 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#A84A32]" />
                      <span>{order.customerWhatsapp}</span>
                      <span>•</span>
                      <span>
                        {order.deliveryMethod === 'pickup'
                          ? '🏪 Retirada no Balcão'
                          : '🛵 Entrega Própria'}
                      </span>
                    </p>
                  </div>

                  {/* Live SLA Countdown Box */}
                  <div className="bg-[#FDF4F1] border border-[#A84A32]/40 rounded-2xl px-3.5 py-2 text-center shrink-0">
                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#A84A32]">
                      SLA Restante
                    </span>
                    <span className="font-mono text-xl font-black text-[#A84A32]">
                      {formatSla(order.slaRemainingSeconds)}
                    </span>
                  </div>
                </div>

                {/* Items & Scheduled Grooming inside Pending Order */}
                <div className="bg-[#FAF5F2] rounded-2xl p-3.5 border border-[#E8DDD8] space-y-2.5">
                  {order.grooming && (
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8DDD8]">
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-[#A84A32]" />
                        <div>
                          <span className="text-xs font-extrabold text-[#2D1E1A] block">
                            {order.grooming.serviceName}
                          </span>
                          <span className="text-[11px] text-[#7A6660]">
                            Pet: <strong>{order.grooming.petName}</strong> ({order.grooming.petBreed}{' '}
                            • Porte {order.grooming.size}) •{' '}
                            <strong className="text-[#A84A32]">
                              {order.grooming.date} às {order.grooming.time}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#A84A32]">
                        R$ {order.grooming.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}

                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#7A6660]" />
                        <span className="font-bold text-[#2D1E1A]">
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-[#2D1E1A]">
                        R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8DDD8] text-xs font-extrabold">
                    <span>Total da Comanda Híbrida (Split 90/10)</span>
                    <span className="text-sm text-[#A84A32]">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Big Action Buttons: Aceitar Pedido & Recusar com Justificativa */}
                {rejectingOrderId === order.id ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 space-y-2.5">
                    <label className="block text-xs font-extrabold text-red-900">
                      Selecione ou digite a justificativa de recusa (enviada ao Tutor):
                    </label>
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#2D1E1A]"
                    >
                      <option value="Ruptura pontual de estoque / Baia em higienização">
                        Ruptura pontual de estoque / Baia em higienização
                      </option>
                      <option value="Banhista especialista em porte G indisponível no horário">
                        Banhista especialista em porte G indisponível no horário
                      </option>
                      <option value="Raio de entrega fora da área de cobertura expressa">
                        Raio de entrega fora da área de cobertura expressa
                      </option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          rejectOrder(order.id, rejectionReason);
                          setRejectingOrderId(null);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold"
                      >
                        Confirmar Recusa
                      </button>
                      <button
                        onClick={() => setRejectingOrderId(null)}
                        className="px-3 py-2.5 rounded-xl bg-white border border-[#E8DDD8] text-xs font-bold text-[#7A6660]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aceitar Pedido</span>
                    </button>

                    <button
                      onClick={() => setRejectingOrderId(order.id)}
                      className="py-3.5 px-4 rounded-2xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-extrabold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Recusar com Justificativa</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          {rejectedOrders.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-[#7A6660]">
                Pedidos Recusados ({rejectedOrders.length})
              </span>
              {rejectedOrders.map((ro) => (
                <div
                  key={ro.id}
                  className="text-xs flex items-center justify-between text-[#7A6660] bg-[#FAF5F2] px-3 py-2 rounded-xl"
                >
                  <span>
                    <strong>{ro.code}</strong> • {ro.customerName}
                  </span>
                  <span className="text-[11px] text-red-600 font-semibold">
                    {ro.rejectionReason}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA 2: COMANDAS ATIVAS • TRIAGEM CLÍNICA & CROSS-SELLING EM 1 CLIQUE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2D1E1A]">
              Comandas Ativas • Triagem Clínica & Cross-selling
            </h2>
            <span className="text-xs text-[#7A6660]">
              Sincronizado com Rastreamento Duplo do Tutor
            </span>
          </div>

          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#FAF5F2]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      Em Execução • {order.code}
                    </span>
                    <span className="text-xs font-bold text-[#2D1E1A]">
                      {order.customerName}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6660] mt-1">
                    {order.customerAddress} •{' '}
                    {order.deliveryMethod === 'delivery' ? (
                      <span className="text-[#A84A32] font-bold">
                        <Truck className="w-3.5 h-3.5 inline mr-1" />
                        Entrega Própria do Petshop
                      </span>
                    ) : (
                      <span className="text-[#2D1E1A] font-bold">
                        <Store className="w-3.5 h-3.5 inline mr-1" />
                        Retirada no Balcão
                      </span>
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#7A6660] block">
                    Valor da Comanda
                  </span>
                  <span className="text-lg font-extrabold text-[#A84A32]">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Dual Progress Controls (Products + Grooming) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Product Logistical Stage */}
                <div className="bg-[#FAF5F2] rounded-2xl p-3.5 border border-[#E8DDD8] flex flex-col justify-between space-y-2.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#7A6660] block">
                      Logística de Produtos ({order.items.length} itens)
                    </span>
                    <p className="text-xs font-extrabold text-[#2D1E1A] mt-0.5">
                      Etapa {order.productStep}/4 •{' '}
                      {order.productStep === 1 && 'Recebido'}
                      {order.productStep === 2 && 'Em Separação'}
                      {order.productStep === 3 && 'Saiu p/ Entrega (Motoboy)'}
                      {order.productStep === 4 && 'Entregue ao Tutor'}
                    </p>
                  </div>
                  <button
                    onClick={() => advanceProductStep(order.id)}
                    className="w-full py-2 rounded-xl bg-white hover:bg-[#FDF4F1] border border-[#E8DDD8] text-xs font-extrabold text-[#A84A32] flex items-center justify-center gap-1 transition"
                  >
                    <span>Avançar Etapa da Entrega</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grooming Live Stage */}
                {order.grooming && (
                  <div className="bg-[#FDF4F1]/70 rounded-2xl p-3.5 border border-[#A84A32]/25 flex flex-col justify-between space-y-2.5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#A84A32] block">
                        Baia • {order.grooming.petName} (Porte {order.grooming.size} às{' '}
                        {order.grooming.time})
                      </span>
                      <p className="text-xs font-extrabold text-[#2D1E1A] mt-0.5">
                        Etapa {order.groomingStep}/4 •{' '}
                        {order.groomingStep === 1 && 'Check-in & Triagem'}
                        {order.groomingStep === 2 && 'Banho & Hidratação'}
                        {order.groomingStep === 3 && 'Secagem & Unhas'}
                        {order.groomingStep === 4 && 'Pronto p/ Retorno'}
                      </p>
                    </div>
                    <button
                      onClick={() => advanceGroomingStep(order.id)}
                      className="w-full py-2 rounded-xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1 transition"
                    >
                      <span>Avançar Etapa do Banho</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Checklist de Triagem Clínica & Botão Cross-selling */}
              <div className="bg-[#FAF5F2] rounded-2xl p-4 border border-[#E8DDD8] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#2D1E1A] flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-[#A84A32]" />
                      <span>Checklist de Triagem Clínica na Baia</span>
                    </h4>
                    <p className="text-[11px] text-[#7A6660]">
                      Preencha na chegada do pet para liberar adicionais com 1 clique no app do tutor
                    </p>
                  </div>

                  {/* Launch Cross-selling button */}
                  <button
                    onClick={() => triggerCrossSell(order.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {order.crossSell
                        ? `Cross-sell (${
                            order.crossSell.status === 'approved'
                              ? 'Aprovado ✓'
                              : order.crossSell.status === 'pending'
                              ? 'Aguardando Tutor...'
                              : 'Recusado'
                          })`
                        : 'Lançar Adicional: Banho Antipulgas (+R$ 35)'}
                    </span>
                  </button>
                </div>

                {/* 4 Checkboxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#E8DDD8] cursor-pointer text-xs font-semibold text-[#2D1E1A]">
                    <input
                      type="checkbox"
                      checked={order.triageChecklist.skinAndCoatChecked}
                      onChange={(e) =>
                        updateTriageChecklist(order.id, {
                          skinAndCoatChecked: e.target.checked,
                        })
                      }
                      className="accent-[#A84A32]"
                    />
                    <span>Pele & Pelagem</span>
                  </label>

                  <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#E8DDD8] cursor-pointer text-xs font-semibold text-[#2D1E1A]">
                    <input
                      type="checkbox"
                      checked={order.triageChecklist.earsCleaned}
                      onChange={(e) =>
                        updateTriageChecklist(order.id, {
                          earsCleaned: e.target.checked,
                        })
                      }
                      className="accent-[#A84A32]"
                    />
                    <span>Ouvidos Limpos</span>
                  </label>

                  <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#E8DDD8] cursor-pointer text-xs font-semibold text-[#2D1E1A]">
                    <input
                      type="checkbox"
                      checked={order.triageChecklist.parasitesDetected}
                      onChange={(e) =>
                        updateTriageChecklist(order.id, {
                          parasitesDetected: e.target.checked,
                        })
                      }
                      className="accent-[#A84A32]"
                    />
                    <span className="text-amber-800 font-bold">Pulgas/Carrapatos</span>
                  </label>

                  <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#E8DDD8] cursor-pointer text-xs font-semibold text-[#2D1E1A]">
                    <input
                      type="checkbox"
                      checked={order.triageChecklist.nailsTrimmed}
                      onChange={(e) =>
                        updateTriageChecklist(order.id, {
                          nailsTrimmed: e.target.checked,
                        })
                      }
                      className="accent-[#A84A32]"
                    />
                    <span>Corte de Unhas</span>
                  </label>
                </div>

                {order.crossSell && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      order.crossSell.status === 'approved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : order.crossSell.status === 'pending'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-gray-100 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        <strong>Cross-selling enviado:</strong> {order.crossSell.title} (+R${' '}
                        {order.crossSell.price.toFixed(2).replace('.', ',')})
                      </span>
                    </div>
                    <span className="font-extrabold uppercase text-[10px]">
                      {order.crossSell.status === 'approved'
                        ? '✓ Aprovado pelo Tutor'
                        : order.crossSell.status === 'pending'
                        ? '⏳ Aguardando 1-Click do Tutor'
                        : '✕ Recusado'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
