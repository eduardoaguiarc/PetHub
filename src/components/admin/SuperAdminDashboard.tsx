import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Store,
  Percent,
  CheckCircle2,
  Clock,
  Activity,
  Award,
  ArrowUpRight,
  AlertTriangle,
  QrCode,
  LayoutDashboard,
  Smartphone,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { QrCodePromoTab } from '../shared/QrCodePromoTab';

type AdminTab = 'overview' | 'qrcode';

export const SuperAdminDashboard: React.FC = () => {
  const { orders, baySlots, stores, pushToast, quickDemoLogin } = usePetHub();
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Dynamic GMV & KPI calculations based on shared live state
  const liveOrdersSum = orders
    .filter((o) => o.status !== 'rejected')
    .reduce((acc, o) => acc + o.total, 0);

  const pilotGmvCurrent = 44230.0 + liveOrdersSum;
  const pilotGmvTarget = 45000.0;
  const gmvProgressPct = Math.min(100, Math.round((pilotGmvCurrent / pilotGmvTarget) * 100));

  const platformTakeRateRevenue = Number((pilotGmvCurrent * 0.1).toFixed(2));
  const merchantSplitPayout = Number((pilotGmvCurrent * 0.9).toFixed(2));

  const noShowCount = baySlots.filter((b) => b.status === 'no_show_freed').length;
  const noShowRate = Number((((3 + noShowCount) / 125) * 100).toFixed(1));

  const approvedCrossSells = orders.filter((o) => o.crossSell?.status === 'approved').length;

  return (
    <div className="min-h-[calc(100vh-48px)] bg-[#FAF5F2] text-[#2D1E1A]">
      {/* Top Executive Header */}
      <div className="bg-white border-b border-[#E8DDD8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2D1E1A] text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#A84A32]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#2D1E1A]">
                  PetHub Super Admin • Control Tower (Operação Piloto B2B2C)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-xs font-extrabold">
                  Cluster Moema & Jardins
                </span>
              </div>
              <p className="text-xs text-[#7A6660]">
                Monitoramento em tempo real das Metas do Piloto: 25 Lojas Parceiras • R$ 45k GMV •
                Take-rate 10% • Taxa de No-Show &lt; 5%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => quickDemoLogin('tutor')}
              className="px-3.5 py-2 rounded-xl bg-[#FAF5F2] hover:bg-[#F4E8E2] border border-[#E8DDD8] text-xs font-bold text-[#2D1E1A] flex items-center gap-1.5 transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#A84A32]" />
              <span>Login Demo Tutor</span>
            </button>
            <button
              onClick={() => quickDemoLogin('merchant')}
              className="px-3.5 py-2 rounded-xl bg-[#FAF5F2] hover:bg-[#F4E8E2] border border-[#E8DDD8] text-xs font-bold text-[#2D1E1A] flex items-center gap-1.5 transition"
            >
              <Store className="w-3.5 h-3.5 text-[#A84A32]" />
              <span>Login Demo Lojista</span>
            </button>
            <button
              onClick={() =>
                pushToast(
                  'Relatório Executivo Exportado',
                  'Snapshot das 25 lojas do piloto e conciliação Split 90/10 gerado com sucesso.'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
            >
              <Award className="w-4 h-4" />
              <span>Exportar Fechamento</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Visão Executiva & QR Code & Divulgação */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#FAF5F2]">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              adminTab === 'overview'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FAF5F2] text-[#7A6660] hover:text-[#2D1E1A]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Metas do Piloto & Governança Split 90/10</span>
          </button>

          <button
            onClick={() => setAdminTab('qrcode')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              adminTab === 'qrcode'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FDF4F1] text-[#A84A32] border border-[#A84A32]/30 hover:bg-[#A84A32] hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code & Divulgação</span>
          </button>
        </div>
      </div>

      {/* Main Executive Grid or QR Code Tab */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {adminTab === 'qrcode' ? (
          <QrCodePromoTab contextMode="admin" />
        ) : (
          <>
            {/* 4 PILOT KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* KPI 1: Meta 25 Lojas */}
              <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6660]">
                    Meta 1 • Lojas Ativas no Piloto
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#2D1E1A]">25 / 25</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    100% Meta Atingida
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF5F2] overflow-hidden">
                  <div className="h-full bg-emerald-600 w-full rounded-full" />
                </div>
                <p className="text-[11px] text-[#7A6660]">
                  25 petshops independentes operando com agenda de baias integrada
                </p>
              </div>

              {/* KPI 2: Meta R$ 45k GMV */}
              <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6660]">
                    Meta 2 • GMV Total (Meta R$ 45k)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#2D1E1A]">
                    R$ {pilotGmvCurrent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-extrabold text-[#A84A32] bg-[#FDF4F1] px-2 py-0.5 rounded-full">
                    {gmvProgressPct}% da Meta
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF5F2] overflow-hidden">
                  <div
                    style={{ width: `${gmvProgressPct}%` }}
                    className="h-full bg-[#A84A32] rounded-full transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#7A6660]">
                  Ticket médio híbrido: <strong>R$ 256,40</strong> (+38% vs pedido avulso)
                </p>
              </div>

              {/* KPI 3: Taxa de No-Show < 5% */}
              <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6660]">
                    Meta 3 • Taxa de No-Show (&lt; 5%)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-700">{noShowRate}%</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Abaixo do Teto (5%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF5F2] overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (noShowRate / 5) * 100)}%` }}
                    className="h-full bg-emerald-600 rounded-full"
                  />
                </div>
                <p className="text-[11px] text-[#7A6660]">
                  Trava de 2h + Multa de 20% reduziu ociosidade de baias em 71%
                </p>
              </div>

              {/* KPI 4: Receita Líquida PetHub (10% Take-rate) */}
              <div className="bg-[#2D1E1A] text-white rounded-3xl p-5 shadow-clean-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4E8E2]">
                    Receita PetHub (10% Take-Rate)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#A84A32] text-white text-[10px] font-extrabold">
                    Split 90/10
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white">
                    R${' '}
                    {platformTakeRateRevenue.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-[11px] text-white/80">
                  Repasse líquido 90% aos lojistas:{' '}
                  <strong className="text-emerald-300">
                    R$ {merchantSplitPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </p>
                <div className="text-[10px] text-[#F4E8E2] pt-1 border-t border-white/10 flex items-center justify-between">
                  <span>Cross-sells aprovados hoje:</span>
                  <strong className="text-amber-300">{approvedCrossSells + 14} upgrades</strong>
                </div>
              </div>
            </div>

            {/* Second Row: Live Governance & Store Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Store Network Performance Table */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#2D1E1A]">
                      Top Petshops Parceiros do Piloto (25 Lojas Conectadas)
                    </h2>
                    <p className="text-xs text-[#7A6660]">
                      Auditoria de SLA de Aceite (&lt;15 min), Conversão de Comanda Híbrida e
                      No-Show
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold">
                    SLA Global: 98.4%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E8DDD8] text-[#7A6660] uppercase text-[10px]">
                        <th className="py-2.5 px-2.5">Petshop Parceiro</th>
                        <th className="py-2.5 px-2.5">Raio</th>
                        <th className="py-2.5 px-2.5">SLA Médio</th>
                        <th className="py-2.5 px-2.5">No-Show</th>
                        <th className="py-2.5 px-2.5">GMV (Split 90/10)</th>
                        <th className="py-2.5 px-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FAF5F2]">
                      {stores.map((st, idx) => (
                        <tr key={st.id} className="hover:bg-[#FAF5F2]/70">
                          <td className="py-3 px-2.5 font-extrabold text-[#2D1E1A]">
                            {idx + 1}. {st.name}
                          </td>
                          <td className="py-3 px-2.5 text-[#7A6660]">{st.distanceKm} km</td>
                          <td className="py-3 px-2.5 font-mono font-bold text-emerald-700">
                            0{idx + 2}m 1{idx * 3}s
                          </td>
                          <td className="py-3 px-2.5 font-bold text-[#2D1E1A]">
                            {(2.1 + idx * 0.4).toFixed(1)}%
                          </td>
                          <td className="py-3 px-2.5 font-extrabold text-[#A84A32]">
                            R${' '}
                            {(12963 - idx * 2450).toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                              Ativo • PRO
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#FAF5F2]/50 text-[#7A6660]">
                        <td className="py-2.5 px-2.5 font-bold">
                          + 22 Petshops de Bairro (Cluster SP)
                        </td>
                        <td className="py-2.5 px-2.5">0.8–3.5 km</td>
                        <td className="py-2.5 px-2.5 font-mono font-bold text-emerald-700">
                          03m 42s
                        </td>
                        <td className="py-2.5 px-2.5 font-bold">2.6%</td>
                        <td className="py-2.5 px-2.5 font-extrabold text-[#2D1E1A]">
                          R$ 13.791,00
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-extrabold">
                            100% Online
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 5 Cols: Operational Rules & Live B2B2C Audit Feed */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#A84A32]" />
                    <h2 className="text-sm font-extrabold text-[#2D1E1A]">
                      Governança & Regras de Negócio Ativas
                    </h2>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-[#A84A32]">
                    Tempo Real
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#A84A32] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-[#2D1E1A]">
                        Trava de Antecedência Mínima (2h) + SLA 15 min
                      </h4>
                      <p className="text-[11px] text-[#7A6660] mt-0.5">
                        Bloqueia agendamentos de última hora sem preparo de baia e exige aceite do
                        lojista em até 15:00 com alerta via WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-[#2D1E1A]">
                        Triagem Clínica & Cross-selling 1-Click
                      </h4>
                      <p className="text-[11px] text-[#7A6660] mt-0.5">
                        Aumenta o ticket médio das baias em +R$ 35,00 por atendimento com aprovação
                        instantânea no rastreamento duplo do tutor.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-[#2D1E1A]">
                        Proteção Anti No-Show (Tolerância 15 min + Multa 20%)
                      </h4>
                      <p className="text-[11px] text-[#7A6660] mt-0.5">
                        Garante compensação imediata ao petshop parceiro e libera o slot de porte
                        P/M ou G para novos encaixes.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FDF4F1] border border-[#A84A32]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#A84A32] block">
                        Liquidação PetHub Pay
                      </span>
                      <span className="font-extrabold text-[#2D1E1A]">
                        Split 90/10 Automático • D+7 ou Antecipação D+1
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#A84A32]" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
