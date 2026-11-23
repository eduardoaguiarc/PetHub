# PetHub — Marketplace Local Pet B2B2C On-Demand 🐾

Protótipo MVP operacional de alta fidelidade do **PetHub** — plataforma B2B2C que unifica a compra de produtos físicos (rações, farmácia, higiene) e o agendamento de **Banho & Tosa** em uma **única Comanda Híbrida**, integrado ao **Supabase (PostgreSQL + Realtime)** e pronto para deploy na **Vercel**.

---

## ✨ Principais Funcionalidades

### 1. App Tutor (Mobile-First PWA • 390px)
- **Onboarding & Login PetHub Club:** Splash screen, login social/e-mail, cadastro com WhatsApp para alertas de SLA, medidor de força de senha e botões de **Login Rápido Demo (`Tutor`, `Lojista`, `Admin`)**.
- **Início Contextual:** Endereço hiperlocal, seletor de pets ativos (`Thor - Golden` e `Mia - Siamês`), banner *"Quarta do Banho Cheiroso"*, recompra em 1 clique, grid de 8 categorias e *Ofertas Relâmpago* com cronômetro regressivo.
- **Busca Hiperlocal & Comanda Híbrida:** Vitrine da loja (`Vila Pet & Banho Spa • 1.2 km`) permitindo adicionar produtos físicos à sacola e agendar Banho/Tosa por porte (`P`, `M`, `G`) com bloqueio automático de horários com menos de 2h de antecedência. Checkout unificado com opção de **Entrega Própria do Petshop** ou **Retirada no Balcão**.
- **Pedidos ao Vivo (Rastreamento Duplo):** Acompanhamento simultâneo da entrega do motoboy e das etapas do banho na baia, com aprovação em **1 clique de Cross-selling / Triagem Clínica** e avaliação pós-serviço de 1 a 5 estrelas.
- **Perfil & PetHub Pay:** Clube PetHub Ouro, **Carteirinha Sanitária Digital** (vacinas e vermífugo), saldo de cashback (`R$ 42,80`) e cartões.

### 2. Painel Lojista & Super Admin (Web Desktop)
- **Pedidos & Cronômetro SLA (15 min):** Fila em tempo real com contagem regressiva de `15:00`, botões **Aceitar Pedido** e **Recusar com Justificativa**, checklist de triagem clínica e disparo de adicional (cross-selling).
- **Agenda de Baias por Porte (`P/M` e `G`):** Grade visual horária com tolerância de 15 min de atraso e botão **Registrar No-Show (Multa 20% e liberar baia)**.
- **Catálogo & Estoque:** Switch instantâneo **Pausar Produto** anti-ruptura.
- **Financeiro (Split 90/10) & Super Admin:** Retenção automática de 10% (take-rate), repasse líquido de 90% (`D+7` ou antecipação `D+1`) e painel executivo das metas do piloto (**25 lojas**, **R$ 45k GMV**, **No-Show < 5%**).
- **QR Code & Divulgação (`qrcode.react`):** Geração automática de QR Code apontando para `window.location.origin` com download em **PNG de alta resolução**.

---

## 🚀 Como Rodar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` (baseado em `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://kzdxuzqzjatrvpeofogz.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica
   ```
3. (Opcional) No **SQL Editor** do Supabase, execute os scripts:
   - [`supabase/schema.sql`](./supabase/schema.sql)
   - [`supabase/seed.sql`](./supabase/seed.sql)
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Gere o build de produção:
   ```bash
   npm run build
   ```
