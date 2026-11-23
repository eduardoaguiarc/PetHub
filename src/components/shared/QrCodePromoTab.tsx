import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Store,
  Smartphone,
  Share2,
  Printer,
  Database,
  RefreshCw,
} from 'lucide-react';
import { usePetHub } from '../../context/PetHubContext';
import { SUPABASE_URL } from '../../lib/supabase';

interface QrCodePromoTabProps {
  contextMode: 'merchant' | 'admin';
}

export const QrCodePromoTab: React.FC<QrCodePromoTabProps> = ({ contextMode }) => {
  const { pushToast, supabaseStatus, refreshFromSupabase, setRole } = usePetHub();
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [urlMode, setUrlMode] = useState<'origin' | 'store'>('origin');
  const [fgColor, setFgColor] = useState<'#A84A32' | '#2D1E1A'>('#2D1E1A');

  const originUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://pethub-ui.vercel.app';

  const targetUrl =
    urlMode === 'origin' ? originUrl : `${originUrl}/?store=store-vila-pet`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      pushToast('URL Copiada!', `${targetUrl} copiado para a área de transferência.`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      pushToast('URL de Produção', targetUrl, 'info');
    }
  };

  const handleDownloadPng = () => {
    const canvas = qrWrapperRef.current?.querySelector('canvas');
    if (!canvas) {
      pushToast('Erro ao gerar PNG', 'Canvas do QR Code não encontrado.', 'warning');
      return;
    }

    // Create high-resolution branded PNG card around the QR code canvas
    const exportCanvas = document.createElement('canvas');
    const width = 640;
    const height = 780;
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');

    if (ctx) {
      // Warm cream background
      ctx.fillStyle = '#FAF5F2';
      ctx.fillRect(0, 0, width, height);

      // Top Terracotta header banner
      ctx.fillStyle = '#A84A32';
      ctx.fillRect(0, 0, width, 150);

      // Brand Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PetHub • Comanda Híbrida', width / 2, 70);

      ctx.font = '500 18px sans-serif';
      ctx.fillStyle = '#F4E8E2';
      ctx.fillText(
        contextMode === 'merchant'
          ? 'Vila Pet & Banho Spa • Ração + Agendamento de Banho'
          : 'Marketplace Local Pet B2B2C • Acesse pelo Celular',
        width / 2,
        110
      );

      // White QR Card Box
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E8DDD8';
      ctx.lineWidth = 3;
      ctx.fillRect(90, 190, 460, 460);
      ctx.strokeRect(90, 190, 460, 460);

      // Draw QR code inside white box
      ctx.drawImage(canvas, 130, 230, 380, 380);

      // Footer URL
      ctx.fillStyle = '#2D1E1A';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Aponte a câmera do celular para pedir:', width / 2, 700);

      ctx.fillStyle = '#A84A32';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(targetUrl, width / 2, 735);

      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download =
        contextMode === 'merchant'
          ? 'qrcode-vilapet-pethub.png'
          : 'qrcode-pethub-producao.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Direct fallback to raw QR canvas
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'pethub-qrcode.png';
      link.href = dataUrl;
      link.click();
    }

    pushToast(
      'QR Code Baixado em PNG!',
      'Arquivo pronto para impressão de balcão, sacola delivery ou envio no WhatsApp.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF4F1] text-[#A84A32] flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#2D1E1A]">
                QR Code & Kit de Divulgação ({contextMode === 'merchant' ? 'Balcão & Sacola do Lojista' : 'Aquisição de Tutores & Lojas do Piloto'})
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                Pronto para Produção (Vercel)
              </span>
            </div>
            <p className="text-xs text-[#7A6660]">
              Gere e baixe o QR Code em PNG apontando dinamicamente para{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#FAF5F2] text-[#A84A32] font-bold">
                {originUrl}
              </code>{' '}
              (window.location.origin).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPng}
            className="px-4 py-2.5 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Baixar QR Code em PNG</span>
          </button>
        </div>
      </div>

      {/* Main Grid: QR Code Card + Customization & Marketing Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 5 COLS: Interactive Printable QR Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white rounded-[32px] border-2 border-[#E8DDD8] shadow-clean-md overflow-hidden">
            {/* Terracotta Top Header */}
            <div className="bg-[#A84A32] text-white p-5 text-center space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> PetHub Club • Sem Fila
              </span>
              <h3 className="text-lg font-extrabold">
                {contextMode === 'merchant'
                  ? 'Vila Pet & Banho Spa'
                  : 'PetHub Marketplace Pet'}
              </h3>
              <p className="text-xs text-white/85">
                Peça ração e agende banho & tosa na mesma comanda
              </p>
            </div>

            {/* QR Canvas Container */}
            <div className="p-6 flex flex-col items-center bg-white">
              <div
                ref={qrWrapperRef}
                className="p-4 rounded-3xl bg-[#FAF5F2] border-2 border-[#E8DDD8] shadow-inner flex items-center justify-center"
              >
                <QRCodeCanvas
                  value={targetUrl}
                  size={220}
                  bgColor="#FAF5F2"
                  fgColor={fgColor}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-4 text-center space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#A84A32] block">
                  Aponte a câmera do seu celular
                </span>
                <p className="text-xs font-mono font-bold text-[#2D1E1A] bg-[#FAF5F2] px-3 py-1.5 rounded-xl border border-[#E8DDD8] break-all">
                  {targetUrl}
                </p>
              </div>

              <div className="w-full grid grid-cols-2 gap-2.5 mt-5">
                <button
                  onClick={handleDownloadPng}
                  className="py-3 px-3 rounded-2xl bg-[#A84A32] hover:bg-[#8E3B26] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PNG</span>
                </button>

                <button
                  onClick={handleCopyUrl}
                  className="py-3 px-3 rounded-2xl bg-[#FAF5F2] hover:bg-[#F4E8E2] text-[#2D1E1A] border border-[#E8DDD8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#A84A32]" />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 7 COLS: Controls, Print Templates & Supabase Status */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Customização do Destino e Estilo */}
          <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-4">
            <h3 className="text-sm font-extrabold text-[#2D1E1A]">
              Configuração do Link Dinâmico (window.location.origin)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setUrlMode('origin')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  urlMode === 'origin'
                    ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                    : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Smartphone className="w-4 h-4 text-[#A84A32]" />
                  <span className="text-[10px] font-extrabold uppercase">Padrão Produção</span>
                </div>
                <span className="text-xs font-extrabold block">
                  URL Raiz (window.location.origin)
                </span>
                <span className="text-[11px] text-[#7A6660] truncate block mt-0.5">
                  {originUrl}
                </span>
              </button>

              <button
                onClick={() => setUrlMode('store')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  urlMode === 'store'
                    ? 'bg-[#FDF4F1] border-[#A84A32] text-[#A84A32]'
                    : 'bg-[#FAF5F2] border-[#E8DDD8] text-[#2D1E1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Store className="w-4 h-4 text-[#A84A32]" />
                  <span className="text-[10px] font-extrabold uppercase">Deep Link Loja</span>
                </div>
                <span className="text-xs font-extrabold block">
                  Vitrine Direta Vila Pet & Banho Spa
                </span>
                <span className="text-[11px] text-[#7A6660] truncate block mt-0.5">
                  {originUrl}/?store=store-vila-pet
                </span>
              </button>
            </div>

            {/* Color & Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FAF5F2]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7A6660]">Cor do QR Code:</span>
                <button
                  onClick={() => setFgColor('#2D1E1A')}
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    fgColor === '#2D1E1A'
                      ? 'bg-[#2D1E1A] text-white border-[#2D1E1A]'
                      : 'bg-white text-[#2D1E1A] border-[#E8DDD8]'
                  }`}
                >
                  Espresso (#2D1E1A)
                </button>
                <button
                  onClick={() => setFgColor('#A84A32')}
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    fgColor === '#A84A32'
                      ? 'bg-[#A84A32] text-white border-[#A84A32]'
                      : 'bg-white text-[#A84A32] border-[#E8DDD8]'
                  }`}
                >
                  Terracota (#A84A32)
                </button>
              </div>

              <button
                onClick={() => setRole('tutor')}
                className="text-xs font-extrabold text-[#A84A32] hover:underline flex items-center gap-1"
              >
                <span>Simular abertura pelo Tutor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Materiais de Ponto de Venda (PDV) & Divulgação */}
          <div className="bg-white rounded-3xl border border-[#E8DDD8] p-5 shadow-clean space-y-3">
            <h3 className="text-sm font-extrabold text-[#2D1E1A]">
              Formatos Recomendados de Divulgação Hiperlocal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] space-y-1.5">
                <Printer className="w-4 h-4 text-[#A84A32]" />
                <h4 className="font-extrabold text-[#2D1E1A]">1. Display de Balcão A5</h4>
                <p className="text-[11px] text-[#7A6660]">
                  Posicione no caixa e na recepção do banho para converter clientes presenciais em
                  recorrência digital.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] space-y-1.5">
                <Share2 className="w-4 h-4 text-[#A84A32]" />
                <h4 className="font-extrabold text-[#2D1E1A]">2. Adesivo na Sacola</h4>
                <p className="text-[11px] text-[#7A6660]">
                  Cole o QR Code nas sacolas de entrega própria com cupom de R$ 15 OFF no 1º banho
                  agendado pelo app.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5F2] border border-[#E8DDD8] space-y-1.5">
                <Smartphone className="w-4 h-4 text-[#A84A32]" />
                <h4 className="font-extrabold text-[#2D1E1A]">3. Disparo WhatsApp</h4>
                <p className="text-[11px] text-[#7A6660]">
                  Envie o card PNG baixado para a lista de transmissão do bairro nas terças e
                  quartas de manhã.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Conexão Supabase & Sincronização */}
          <div className="bg-white rounded-3xl border border-[#E8DDD8] p-4 shadow-clean flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#2D1E1A]">
                    Supabase Cloud Conectado
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    {supabaseStatus === 'connected_db'
                      ? 'Tabelas Sincronizadas (Realtime)'
                      : 'Cliente Ativo + Seed Híbrido'}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6660] font-mono">{SUPABASE_URL}</p>
              </div>
            </div>

            <button
              onClick={refreshFromSupabase}
              className="px-3.5 py-2 rounded-xl bg-[#FAF5F2] hover:bg-[#F4E8E2] border border-[#E8DDD8] text-xs font-extrabold text-[#2D1E1A] flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#A84A32]" />
              <span>Sincronizar Supabase</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
