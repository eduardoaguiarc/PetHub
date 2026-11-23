import React from 'react';
import {
  Home,
  Search,
  Tag,
  ShoppingBag,
  PawPrint,
  Sparkles,
  Store,
  ArrowRight,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { AuthOnboarding } from './AuthOnboarding';
import { HomeTab } from './HomeTab';
import { SearchTab } from './SearchTab';
import { OffersTab } from './OffersTab';
import { OrdersTab } from './OrdersTab';
import { ProfileTab } from './ProfileTab';
import { StoreHybridModal } from './StoreHybridModal';
import { CheckoutModal } from './CheckoutModal';
import { TutorTab } from '../../types/pethub';

export const TutorAppFrame: React.FC = () => {
  const {
    tutorTab,
    setTutorTab,
    showAuthModal,
    orders,
    cartItems,
    cartGrooming,
    setIsCheckoutOpen,
    selectedStoreId,
    setRole,
  } = usePetHub();

  const activeOrdersCount = orders.filter(
    (o) => o.customerName.includes('Eduardo') && o.status !== 'rejected'
  ).length;
  const hasPendingCrossSell = orders.some((o) => o.crossSell?.status === 'pending');

  const cartCount =
    cartItems.reduce((sum, i) => sum + i.quantity, 0) + (cartGrooming ? 1 : 0);
  const cartTotal =
    cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0) +
    (cartGrooming ? cartGrooming.price : 0);

  const NAV_ITEMS: {
    id: TutorTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    dot?: boolean;
  }[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'busca', label: 'Busca', icon: Search },
    { id: 'ofertas', label: 'Ofertas', icon: Tag, dot: true },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: ShoppingBag,
      badge: activeOrdersCount,
    },
    { id: 'perfil', label: 'Perfil', icon: PawPrint },
  ];

  return (
    <div className="min-h-[calc(100vh-48px)] bg-[#F4E8E2]/60 py-6 px-4 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
      {/* MOBILE PWA 390px FRAME */}
      <div className="w-full max-w-[390px] bg-[#FAF5F2] rounded-[38px] border-[6px] border-[#2D1E1A] shadow-2xl overflow-hidden relative flex flex-col min-h-[780px] max-h-[840px]">
        {showAuthModal ? (
          <div className="flex-1 overflow-y-auto clean-scrollbar">
            <AuthOnboarding />
          </div>
        ) : (
          <>
            {/* Main Tab Content */}
            <main className="flex-1 overflow-y-auto clean-scrollbar relative">
              {tutorTab === 'inicio' && <HomeTab />}
              {tutorTab === 'busca' && <SearchTab />}
              {tutorTab === 'ofertas' && <OffersTab />}
              {tutorTab === 'pedidos' && <OrdersTab />}
              {tutorTab === 'perfil' && <ProfileTab />}
            </main>

            {/* Floating Cart Pill (iFood style) when items in bag and store modal closed */}
            {cartCount > 0 && !selectedStoreId && (
              <div className="absolute bottom-[68px] inset-x-3 z-20">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#A84A32] hover:bg-[#8E3B26] text-white px-4 py-3 rounded-2xl shadow-floating flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/20 text-xs font-extrabold flex items-center justify-center">
                      {cartCount}
                    </span>
                    <div className="text-left">
                      <span className="text-xs font-extrabold block">
                        Ver Sacola Híbrida
                      </span>
                      <span className="text-[10px] text-white/85 block">
                        {cartGrooming
                          ? `Inclui Banho (${cartGrooming.petName})`
                          : 'Vila Pet & Banho Spa'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </button>
              </div>
            )}

            {/* Store Hybrid Page Overlay */}
            <StoreHybridModal />

            {/* Unified Checkout Overlay */}
            <CheckoutModal />

            {/* Fixed Bottom Navigation Bar */}
            <nav className="bg-white/95 backdrop-blur-md border-t border-[#E8DDD8] px-2 py-2 shrink-0 z-20">
              <div className="grid grid-cols-5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = tutorTab === item.id && !selectedStoreId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTutorTab(item.id);
                      }}
                      className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition ${
                        isActive
                          ? 'text-[#A84A32] font-extrabold'
                          : 'text-[#7A6660] hover:text-[#2D1E1A] font-medium'
                      }`}
                    >
                      <div className="relative">
                        <Icon className="w-5 h-5" />
                        {item.dot && (
                          <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#A84A32]" />
                        )}
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white ${
                              hasPendingCrossSell
                                ? 'bg-amber-500 animate-bounce'
                                : 'bg-[#A84A32]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] mt-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </>
        )}
      </div>

      {/* Desktop Side Interactive Guide (visible on large screens to highlight B2B2C integration) */}
      <aside className="hidden xl:flex flex-col gap-3 w-80 pt-4">
        <div className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold text-[#2D1E1A]">
              Fluxos B2B2C Sincronizados
            </h3>
          </div>
          <p className="text-[11px] text-[#7A6660] leading-relaxed">
            Tudo o que você faz neste <strong>App Tutor (390px)</strong> reflete instantaneamente no{' '}
            <strong>Painel Lojista</strong> e no <strong>Super Admin</strong>:
          </p>
          <ul className="text-[11px] text-[#2D1E1A] space-y-2 pt-1">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FDF4F1] text-[#A84A32] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                Abra <strong>Vila Pet & Banho Spa</strong> para montar uma{' '}
                <strong>Comanda Híbrida</strong> (Ração + Banho c/ trava de 2h).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FDF4F1] text-[#A84A32] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                Em <strong>Pedidos</strong>, clique em <em>Simular Triagem</em> para aprovar um{' '}
                <strong>Cross-selling Clínico em 1 clique</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FDF4F1] text-[#A84A32] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                Alterne para o <strong>Painel Lojista</strong> para aceitar pedidos com cronômetro
                SLA de 15:00 ou pausar produtos.
              </span>
            </li>
          </ul>

          <button
            onClick={() => setRole('merchant')}
            className="w-full mt-2 py-2.5 rounded-2xl bg-[#2D1E1A] hover:bg-[#A84A32] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Ir para Painel Lojista</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
};
