import React, { useState } from 'react';
import {
  Package,
  Search,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';

export const CatalogStockView: React.FC = () => {
  const { products, toggleProductPause } = usePetHub();
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = products.filter((p) => !p.paused).length;
  const pausedCount = products.filter((p) => p.paused).length;

  return (
    <div className="space-y-6">
      {/* Top Summary & Search */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#2D1E1A]">
              Catálogo & Controle Anti-Ruptura em Tempo Real
            </h2>
            <p className="text-xs text-[#7A6660]">
              Acione o switch <strong>"Pausar Produto"</strong> para congelar imediatamente a venda
              na vitrine do App Tutor sem perder o histórico do SKU.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold">
            {activeCount} Ativos na Vitrine
          </span>
          <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-extrabold">
            {pausedCount} Pausados
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8DDD8] px-4 py-3 shadow-clean max-w-md">
        <Search className="w-4 h-4 text-[#A84A32]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar SKU por nome (ex: Simparic, Premier, Pipicat)..."
          className="bg-transparent text-xs text-[#2D1E1A] w-full focus:outline-none"
        />
      </div>

      {/* Product Cards Grid with Fast "Pausar Produto" Switch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className={`rounded-3xl border p-4 shadow-clean flex items-center justify-between gap-4 transition ${
              prod.paused
                ? 'bg-[#FAF5F2] border-red-200 opacity-85'
                : 'bg-white border-[#E8DDD8]'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={prod.image}
                alt={prod.name}
                className={`w-16 h-16 rounded-2xl object-cover border border-[#E8DDD8] shrink-0 ${
                  prod.paused ? 'grayscale' : ''
                }`}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
                    {prod.category}
                  </span>
                  {prod.paused ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold">
                      <AlertCircle className="w-3 h-3" /> Pausado no App Tutor
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      <CheckCircle2 className="w-3 h-3" /> Disponível
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-[#2D1E1A] truncate mt-0.5">
                  {prod.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="font-extrabold text-[#A84A32]">
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[#7A6660]">
                    Estoque físico: <strong>{prod.stock} un.</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Fast Toggle Switch: Pausar Produto */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button
                onClick={() => toggleProductPause(prod.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 border transition ${
                  prod.paused
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                    : 'bg-[#FAF5F2] hover:bg-red-50 text-[#2D1E1A] hover:text-red-700 border-[#E8DDD8] hover:border-red-200'
                }`}
              >
                {prod.paused ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Reativar Produto</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 text-[#A84A32]" />
                    <span>Pausar Produto</span>
                  </>
                )}
              </button>
              <span className="text-[10px] text-[#7A6660]">
                {prod.paused ? 'Oculto na vitrine' : 'Switch anti-ruptura'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
