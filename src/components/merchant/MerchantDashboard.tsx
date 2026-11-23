import React, { useState } from 'react';
import {
  ClipboardList,
  Bath,
  Package,
  Wallet,
  Store,
  Smartphone,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { OrdersSlaBoard } from './OrdersSlaBoard';
import { GroomingBaysGrid } from './GroomingBaysGrid';
import { CatalogStockView } from './CatalogStockView';
import { MerchantFinanceView } from './MerchantFinanceView';
import { QrCodePromoTab } from '../shared/QrCodePromoTab';

type MerchantSection = 'orders' | 'bays' | 'catalog' | 'finance' | 'qrcode';

export const MerchantDashboard: React.FC = () => {
  const { orders, products, baySlots, quickDemoLogin } = usePetHub();
  const [section, setSection] = useState<MerchantSection>('orders');

  const pendingSlaCount = orders.filter((o) => o.status === 'pending_sla').length;
  const lateBaysCount = baySlots.filter((b) => b.status === 'late_tolerance').length;
  const pausedProductsCount = products.filter((p) => p.paused).length;

  return (
    <div className="min-h-[calc(100vh-48px)] bg-[#FAF5F2] text-[#2D1E1A]">
      {/* Merchant Top Header & Navigation Tabs */}
      <div className="bg-white border-b border-[#E8DDD8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF4F1] border border-[#A84A32]/30 flex items-center justify-center text-[#A84A32]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#2D1E1A]">
                  Vila Pet & Banho Spa • Painel Lojista Parceiro
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                  ● Loja Aberta • Raio 3 km
                </span>
              </div>
              <p className="text-xs text-[#7A6660]">
                Al. dos Nhambiquaras, 410 (Moema) • Operação Híbrida (Produtos + Baias de Estética)
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
              onClick={() => quickDemoLogin('admin')}
              className="px-3.5 py-2 rounded-xl bg-[#FAF5F2] hover:bg-[#F4E8E2] border border-[#E8DDD8] text-xs font-bold text-[#2D1E1A] flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#A84A32]" />
              <span>Login Demo Admin</span>
            </button>
          </div>
        </div>

        {/* 5 Navigation Tabs (including QR Code & Divulgação) */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#FAF5F2]">
          <button
            onClick={() => setSection('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              section === 'orders'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FAF5F2] text-[#7A6660] hover:text-[#2D1E1A]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Pedidos & Cronômetro SLA (15 min)</span>
            {pendingSlaCount > 0 && (
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                  section === 'orders'
                    ? 'bg-white text-[#A84A32]'
                    : 'bg-red-600 text-white'
                }`}
              >
                {pendingSlaCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSection('bays')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              section === 'bays'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FAF5F2] text-[#7A6660] hover:text-[#2D1E1A]'
            }`}
          >
            <Bath className="w-4 h-4" />
            <span>Agenda de Baias por Porte (P/M e G)</span>
            {lateBaysCount > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-amber-400 text-[#2D1E1A] text-[10px] font-black">
                {lateBaysCount} Atraso
              </span>
            )}
          </button>

          <button
            onClick={() => setSection('catalog')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              section === 'catalog'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FAF5F2] text-[#7A6660] hover:text-[#2D1E1A]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catálogo & Estoque (Pausar Produto)</span>
            {pausedProductsCount > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-black">
                {pausedProductsCount} Pausado
              </span>
            )}
          </button>

          <button
            onClick={() => setSection('finance')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              section === 'finance'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FAF5F2] text-[#7A6660] hover:text-[#2D1E1A]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Financeiro (Split 90/10 & D+1)</span>
          </button>

          <button
            onClick={() => setSection('qrcode')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
              section === 'qrcode'
                ? 'bg-[#A84A32] text-white shadow-sm'
                : 'bg-[#FDF4F1] text-[#A84A32] border border-[#A84A32]/30 hover:bg-[#A84A32] hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code & Divulgação</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {section === 'orders' && <OrdersSlaBoard />}
        {section === 'bays' && <GroomingBaysGrid />}
        {section === 'catalog' && <CatalogStockView />}
        {section === 'finance' && <MerchantFinanceView />}
        {section === 'qrcode' && <QrCodePromoTab contextMode="merchant" />}
      </main>
    </div>
  );
};
