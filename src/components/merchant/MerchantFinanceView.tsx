import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  PieChart,
  CalendarClock,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

export const MerchantFinanceView: React.FC = () => {
  const { orders, baySlots, anticipatedD1, requestD1Anticipation } = usePetHub();

  // Base weekly revenue + dynamic orders from state
  const liveOrdersGmv = orders
    .filter((o) => o.status !== 'rejected')
    .reduce((acc, o) => acc + o.total, 0);

  const noShowCompensations = baySlots
    .filter((b) => b.status === 'no_show_freed')
    .reduce((acc, b) => acc + (b.noShowPenaltyApplied || 0), 0);

  const grossGmv = 12450.0 + liveOrdersGmv + noShowCompensations;
  const takeRate10 = Number((grossGmv * 0.1).toFixed(2));
  const netMerchant90 = Number((grossGmv * 0.9).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Split 90/10 Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Bruto 100% */}
        <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A6660]">
              Faturamento Bruto (Ciclo Semanal)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF5F2] text-[#2D1E1A] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2D1E1A]">
            R$ {grossGmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#7A6660]">
            Inclui comandas híbridas ao vivo + R${' '}
            {noShowCompensations.toFixed(2).replace('.', ',')} de multas No-Show
          </p>
        </div>

        {/* Card 2: Retenção Automática 10% (Take-rate PetHub) */}
        <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A84A32]">
              Retenção Automática (10% Take-Rate)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#A84A32]">
            - R$ {takeRate10.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#7A6660]">
            Taxa única de intermediação (Split na fonte via PetHub Pay)
          </p>
        </div>

        {/* Card 3: Saldo Líquido Lojista (90% Split) + D+7 / Antecipação D+1 */}
        <div className="bg-[#2D1E1A] text-white rounded-3xl p-5 shadow-clean-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F4E8E2]">
              Saldo Líquido Lojista (90% Split)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
              {anticipatedD1 ? 'Agendado D+1 (Pix)' : 'Ciclo Padrão D+7'}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-white">
            R$ {netMerchant90.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>

          {anticipatedD1 ? (
            <div className="py-2 px-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Antecipação D+1 confirmada! Depósito amanhã às 09:00.</span>
            </div>
          ) : (
            <button
              onClick={requestD1Anticipation}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Zap className="w-4 h-4" />
              <span>Antecipar Saldo para D+1 (Receber Amanhã)</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Split 90/10 Bar */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#2D1E1A]">
              Arquitetura de Split Financeiro Automático (90% Lojista / 10% PetHub)
            </h3>
            <p className="text-xs text-[#7A6660]">
              Liquidação transparente em cada comanda híbrida sem bitributação
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
            <ShieldCheck className="w-4 h-4" /> Conciliação Automática
          </span>
        </div>

        <div className="w-full h-5 rounded-full overflow-hidden flex bg-[#FAF5F2] border border-[#E8DDD8]">
          <div
            style={{ width: '90%' }}
            className="bg-emerald-600 text-white text-[10px] font-extrabold flex items-center justify-center"
          >
            90% Repasse Líquido Vila Pet & Banho Spa (R${' '}
            {netMerchant90.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
          </div>
          <div
            style={{ width: '10%' }}
            className="bg-[#A84A32] text-white text-[10px] font-extrabold flex items-center justify-center"
          >
            10%
          </div>
        </div>
      </div>

      {/* Extrato Detalhado por Comanda */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#2D1E1A]">
            Extrato em Tempo Real das Comandas Híbridas
          </h3>
          <span className="text-xs text-[#7A6660] flex items-center gap-1">
            <CalendarClock className="w-4 h-4 text-[#A84A32]" />
            Repasse {anticipatedD1 ? 'D+1 Ativo' : 'D+7 Padrão'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8DDD8] text-[#7A6660] uppercase text-[10px]">
                <th className="py-2.5 px-3">Comanda</th>
                <th className="py-2.5 px-3">Tutor</th>
                <th className="py-2.5 px-3">Composição Híbrida</th>
                <th className="py-2.5 px-3">Bruto (100%)</th>
                <th className="py-2.5 px-3">Take-Rate (10%)</th>
                <th className="py-2.5 px-3">Líquido Lojista (90%)</th>
                <th className="py-2.5 px-3">Status Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF5F2]">
              {orders.map((ord) => {
                const take10 = ord.total * 0.1;
                const net90 = ord.total * 0.9;
                return (
                  <tr key={ord.id} className="hover:bg-[#FAF5F2]/60">
                    <td className="py-3 px-3 font-extrabold text-[#2D1E1A]">{ord.code}</td>
                    <td className="py-3 px-3">{ord.customerName}</td>
                    <td className="py-3 px-3 text-[#7A6660]">
                      {ord.items.length} prod(s){' '}
                      {ord.grooming ? `+ Banho (${ord.grooming.petName})` : ''}
                      {ord.crossSell?.status === 'approved' ? ' + Adicional Clínico' : ''}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      R$ {ord.total.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3 text-[#A84A32] font-bold">
                      - R$ {take10.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">
                      R$ {net90.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {anticipatedD1 ? 'D+1 Agendado' : 'D+7 Garantido'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
