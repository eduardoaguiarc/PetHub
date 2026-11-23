import React from 'react';
import {
  Smartphone,
  Store,
  ShieldCheck,
  KeyRound,
  BellRing,
  Database,
  RefreshCw,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

export const RoleSwitcherBar: React.FC = () => {
  const {
    role,
    quickDemoLogin,
    orders,
    showAuthModal,
    setShowAuthModal,
    supabaseStatus,
    refreshFromSupabase,
    toasts,
    dismissToast,
  } = usePetHub();

  const pendingSlaCount = orders.filter((o) => o.status === 'pending_sla').length;
  const pendingCrossSellCount = orders.filter((o) => o.crossSell?.status === 'pending').length;

  return (
    <>
      {/* Discreet Floating Top Switcher */}
      <header className="sticky top-0 z-50 w-full bg-[#2D1E1A]/95 backdrop-blur-md text-white border-b border-white/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Brand tag + Supabase Live Indicator */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#A84A32] flex items-center justify-center font-extrabold text-xs tracking-tight shadow-sm">
              PH
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">PetHub</span>
              <button
                onClick={refreshFromSupabase}
                title="Clique para sincronizar dados com o Supabase"
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold hover:bg-emerald-500/30 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Database className="w-3 h-3" />
                <span>
                  {supabaseStatus === 'connected_db'
                    ? 'Supabase Realtime'
                    : 'Supabase Cloud'}
                </span>
                <RefreshCw className="w-2.5 h-2.5 ml-0.5 opacity-80" />
              </button>
            </div>
          </div>

          {/* 3-Role Pill Switcher (Demo Quick Login) */}
          <div className="flex items-center bg-black/30 p-1 rounded-full border border-white/10">
            <button
              onClick={() => quickDemoLogin('tutor')}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'tutor'
                  ? 'bg-[#A84A32] text-white shadow-sm'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Tutor (Mobile PWA 390px)</span>
              {pendingCrossSellCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-[#2D1E1A] rounded-full text-[10px] font-extrabold animate-pulse">
                  1 Triagem
                </span>
              )}
            </button>

            <button
              onClick={() => quickDemoLogin('merchant')}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'merchant'
                  ? 'bg-[#A84A32] text-white shadow-sm'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Painel Lojista (Desktop)</span>
              {pendingSlaCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                  {pendingSlaCount} SLA
                </span>
              )}
            </button>

            <button
              onClick={() => quickDemoLogin('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-[#A84A32] text-white shadow-sm'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin (Desktop)</span>
            </button>
          </div>

          {/* Right shortcut: Onboarding / Auth toggle when in Tutor */}
          <div className="flex items-center gap-2">
            {role === 'tutor' && (
              <button
                onClick={() => setShowAuthModal(!showAuthModal)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  showAuthModal
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                    : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{showAuthModal ? 'Voltar ao App' : 'Onboarding / Login Demo'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Toast Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              onClick={() => dismissToast(t.id)}
              className="pointer-events-auto cursor-pointer bg-[#2D1E1A] text-white p-3.5 rounded-2xl shadow-xl border border-white/10 flex items-start gap-3 transition-all"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  t.type === 'warning'
                    ? 'bg-amber-500/20 text-amber-300'
                    : t.type === 'info'
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'bg-[#A84A32] text-white'
                }`}
              >
                <BellRing className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">{t.title}</p>
                <p className="text-[11px] text-white/80 leading-snug mt-0.5">{t.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
