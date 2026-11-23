import React from 'react';
import {
  Bath,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Sparkles,
  UserX,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { BaySlotBooking } from '../../types/pethub';

export const GroomingBaysGrid: React.FC = () => {
  const { baySlots, registerBayNoShow } = usePetHub();

  const pmSlots = baySlots.filter((s) => s.bayGroup === 'PM');
  const gSlots = baySlots.filter((s) => s.bayGroup === 'G');

  const renderSlotCard = (slot: BaySlotBooking) => {
    const isLate = slot.status === 'late_tolerance';
    const isNoShowFreed = slot.status === 'no_show_freed';
    const isFree = slot.status === 'free';

    return (
      <div
        key={slot.id}
        className={`rounded-2xl border p-4 transition shadow-clean ${
          isLate
            ? 'bg-amber-50/90 border-2 border-amber-400'
            : isNoShowFreed
            ? 'bg-emerald-50/60 border-emerald-300'
            : isFree
            ? 'bg-[#FAF5F2] border-dashed border-[#E8DDD8]'
            : 'bg-white border-[#E8DDD8]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-[#2D1E1A] text-white font-mono text-xs font-extrabold">
              {slot.time}
            </span>
            <span className="text-xs font-bold text-[#7A6660]">{slot.bayLabel}</span>
          </div>

          {isLate && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#2D1E1A] text-[10px] font-extrabold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Atraso {slot.minutesLate} min (&gt;15 min tolerância)
            </span>
          )}
          {slot.status === 'occupied' && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDF4F1] text-[#A84A32] text-[10px] font-extrabold">
              Ocupada • No Prazo
            </span>
          )}
          {isFree && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              Baia Livre
            </span>
          )}
          {isNoShowFreed && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
              Baia Liberada (No-Show 20%)
            </span>
          )}
        </div>

        {isFree ? (
          <div className="py-3 text-center">
            <p className="text-xs font-bold text-[#7A6660]">
              Horário disponível para encaixe imediato no App Tutor
            </p>
          </div>
        ) : isNoShowFreed ? (
          <div className="bg-white rounded-xl p-3 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                No-Show Registrado ({slot.petName})
              </span>
              <span className="font-extrabold text-emerald-700">
                + R$ {slot.noShowPenaltyApplied?.toFixed(2).replace('.', ',')} (Multa 20%)
              </span>
            </div>
            <p className="text-[11px] text-[#7A6660]">
              Baia reaberta automaticamente na vitrine hiperlocal e compensação de 20% creditada no
              Split do Lojista.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#2D1E1A]">
                  {slot.petName}{' '}
                  <span className="text-xs font-semibold text-[#7A6660]">
                    • {slot.petBreed}
                  </span>
                </h4>
                <p className="text-xs text-[#A84A32] font-bold mt-0.5">
                  {slot.serviceName}
                </p>
                <p className="text-[11px] text-[#7A6660] flex items-center gap-2 mt-1">
                  <span>Tutor: {slot.tutorName}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Phone className="w-3 h-3" /> {slot.tutorPhone}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-[#2D1E1A]">
                  R$ {(slot.serviceValue || 0).toFixed(2).replace('.', ',')}
                </span>
                <span className="block text-[10px] text-[#7A6660]">Tolerância: 15 min</span>
              </div>
            </div>

            {/* Action Button: Registrar No-Show (Multa 20% e liberar baia) */}
            <div className="pt-2 border-t border-[#E8DDD8]/70 flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#7A6660] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A84A32]" />
                {isLate
                  ? 'Tolerância de 15 min excedida!'
                  : 'Política de No-Show ativa após 15 min'}
              </span>

              <button
                onClick={() => registerBayNoShow(slot.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                  isLate
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    : 'bg-[#FAF5F2] hover:bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Registrar No-Show (Multa 20% e liberar baia)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
            <Bath className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#2D1E1A]">
              Grade Horária de Baias Separada por Porte (P/M e G)
            </h2>
            <p className="text-xs text-[#7A6660]">
              Regra de SLA: Trava automática de 2h de antecedência • Tolerância máxima de 15 min de
              atraso com retenção automática de 20% em caso de No-Show.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900">
            ⏱ Tolerância de Atraso: 15 min
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#FDF4F1] text-[#A84A32]">
            🛡 Proteção No-Show: 20% Retido
          </span>
        </div>
      </div>

      {/* Two Columns: Porte P/M vs Porte G */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUNA 1: BAIAS PORTE P / M */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-[#E8DDD8] px-4 py-3 shadow-clean">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
                Linha de Estética Compacta
              </span>
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">
                Baias Porte P / M (Até 15kg • Cães & Gatos)
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF5F2] border border-[#E8DDD8] text-xs font-extrabold text-[#2D1E1A]">
              {pmSlots.length} slots hoje
            </span>
          </div>

          <div className="space-y-3">{pmSlots.map(renderSlotCard)}</div>
        </div>

        {/* COLUNA 2: BAIAS PORTE G */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-[#E8DDD8] px-4 py-3 shadow-clean">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84A32]">
                Soprador Duplo & Banheira Rebaixada
              </span>
              <h3 className="text-sm font-extrabold text-[#2D1E1A]">
                Baias Porte G (Acima de 15kg • Golden, Pastor, Labrador)
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF5F2] border border-[#E8DDD8] text-xs font-extrabold text-[#2D1E1A]">
              {gSlots.length} slots hoje
            </span>
          </div>

          <div className="space-y-3">{gSlots.map(renderSlotCard)}</div>
        </div>
      </div>
    </div>
  );
};
