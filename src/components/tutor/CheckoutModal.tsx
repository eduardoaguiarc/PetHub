import React, { useState } from 'react';
import {
  X,
  Truck,
  Store,
  Bath,
  ShoppingBag,
  CreditCard,
  Wallet,
  Trash2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { DeliveryMethod } from '../../types/pethub';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    cartGrooming,
    setCartGrooming,
    updateCartQty,
    cashbackBalance,
    userAddress,
    placeHybridOrder,
  } = usePetHub();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [useCashback, setUseCashback] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');

  if (!isCheckoutOpen) return null;

  const productsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const groomingSubtotal = cartGrooming ? cartGrooming.price : 0;
  const subtotal = productsSubtotal + groomingSubtotal;
  const cashbackDiscount = useCashback ? Math.min(cashbackBalance, subtotal * 0.5) : 0;
  const finalTotal = Math.max(0, subtotal - cashbackDiscount);

  const handleFinishOrder = () => {
    if (cartItems.length === 0 && !cartGrooming) return;
    placeHybridOrder({
      deliveryMethod,
      useCashback,
      paymentMethod: paymentMethod === 'card' ? 'Mastercard •••• 8492' : 'Pix Instantâneo',
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
      <div className="bg-[#FAF5F2] rounded-t-3xl border-t border-[#E8DDD8] max-h-[90%] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-white px-4 py-3.5 border-b border-[#E8DDD8] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-extrabold text-[#2D1E1A]">
              Checkout • Comanda Híbrida
            </h2>
            <p className="text-[11px] text-[#7A6660]">
              Vila Pet & Banho Spa • 1.2 km
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-[#FAF5F2] flex items-center justify-center text-[#7A6660] hover:text-[#2D1E1A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto clean-scrollbar p-4 space-y-4">
          {/* 1. Escolha de Logística: Entrega Própria do Petshop vs Retirada no Balcão */}
          <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A6660] mb-2">
              Modalidade de Entrega / Recebimento
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  deliveryMethod === 'delivery'
                    ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                    : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Truck className="w-4 h-4 text-[#A84A32]" />
                  <span className="text-[10px] font-extrabold text-emerald-700">Grátis</span>
                </div>
                <span className="text-xs font-extrabold block">
                  Entrega Própria do Petshop
                </span>
                <span className="text-[10px] text-[#7A6660] mt-0.5 block">
                  Motoboy / Táxi Dog em 25–35 min
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  deliveryMethod === 'pickup'
                    ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                    : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Store className="w-4 h-4 text-[#A84A32]" />
                  <span className="text-[10px] font-extrabold text-[#A84A32]">Sem Taxa</span>
                </div>
                <span className="text-xs font-extrabold block">Retirada no Balcão</span>
                <span className="text-[10px] text-[#7A6660] mt-0.5 block">
                  Retire ao levar o pet p/ o banho
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#7A6660] mt-2 pt-2 border-t border-[#FAF5F2]">
              {deliveryMethod === 'delivery'
                ? `📍 Entregar em: ${userAddress} (Moema)`
                : '🏪 Retirar em: Al. dos Nhambiquaras, 410 (Vila Pet & Banho Spa)'}
            </p>
          </div>

          {/* 2. Resumo dos Itens Híbridos (Serviço de Banho + Produtos) */}
          <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean space-y-3">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A6660]">
              Itens na Comanda Única
            </span>

            {/* Scheduled Grooming Item */}
            {cartGrooming && (
              <div className="p-2.5 rounded-xl bg-[#FDF4F1] border border-[#A84A32]/30 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#A84A32] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bath className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#A84A32]">
                      Agendamento de Estética • Porte {cartGrooming.size}
                    </span>
                    <h4 className="text-xs font-bold text-[#2D1E1A]">
                      {cartGrooming.serviceName}
                    </h4>
                    <p className="text-[10px] text-[#7A6660]">
                      Pet: <strong>{cartGrooming.petName}</strong> • {cartGrooming.date} às{' '}
                      <strong>{cartGrooming.time}</strong>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-xs font-extrabold text-[#A84A32]">
                    R$ {cartGrooming.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => setCartGrooming(null)}
                    className="text-[10px] text-red-600 hover:underline inline-flex items-center gap-0.5 mt-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remover
                  </button>
                </div>
              </div>
            )}

            {/* Physical Product Items */}
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-2 py-1.5 border-b border-[#FAF5F2] last:border-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF5F2] flex items-center justify-center text-[#A84A32] shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#2D1E1A] truncate">
                      {item.quantity}x {item.product.name}
                    </h4>
                    <span className="text-[10px] text-[#7A6660]">
                      R$ {item.product.price.toFixed(2).replace('.', ',')} un.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-extrabold text-[#2D1E1A]">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.product.id, -1)}
                    className="text-[10px] text-red-600 font-bold px-1.5 py-0.5 rounded bg-red-50"
                  >
                    -1
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Pagamento & PetHub Pay Cashback */}
          <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#A84A32]" />
                <div>
                  <span className="text-xs font-extrabold text-[#2D1E1A] block">
                    Usar Saldo Cashback PetHub Pay
                  </span>
                  <span className="text-[10px] text-[#7A6660]">
                    Saldo disponível: R$ {cashbackBalance.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useCashback}
                onChange={(e) => setUseCashback(e.target.checked)}
                className="w-4 h-4 accent-[#A84A32]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FAF5F2]">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  paymentMethod === 'card'
                    ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                    : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <div>
                  <span className="text-[11px] font-extrabold block">Mastercard •••• 8492</span>
                  <span className="text-[9px] text-[#7A6660]">1 clique (Padrão)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  paymentMethod === 'pix'
                    ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                    : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <div>
                  <span className="text-[11px] font-extrabold block">Pix Instantâneo</span>
                  <span className="text-[9px] text-[#7A6660]">Split Automático 90/10</span>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Resumo de Valores */}
          <div className="bg-white rounded-2xl border border-[#E8DDD8] p-3.5 shadow-clean text-xs space-y-1.5">
            <div className="flex justify-between text-[#7A6660]">
              <span>Subtotal da Comanda</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-[#7A6660]">
              <span>
                {deliveryMethod === 'delivery'
                  ? 'Entrega Própria do Petshop'
                  : 'Retirada no Balcão'}
              </span>
              <span className="text-emerald-700 font-bold">Grátis</span>
            </div>
            {cashbackDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Desconto Cashback PetHub Pay</span>
                <span>- R$ {cashbackDiscount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-[#2D1E1A] pt-2 border-t border-[#FAF5F2]">
              <span>Total a Pagar</span>
              <span className="text-[#A84A32]">
                R$ {finalTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="bg-white p-4 border-t border-[#E8DDD8] shrink-0">
          <button
            onClick={handleFinishOrder}
            className="w-full py-3.5 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Confirmar Comanda Híbrida • R$ {finalTotal.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
