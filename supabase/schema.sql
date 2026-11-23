-- ============================================================================
-- PETHUB B2B2C MARKETPLACE — SUPABASE SCHEMA (MVP PRODUÇÃO)
-- Tabelas: profiles, pets, stores, store_bays, catalog_items, orders,
--          order_items, bay_bookings, clinical_triage_and_reviews
-- Regras: SLA 15 min, Split 90/10 automático, Triagem Clínica 1-Click, Realtime
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. PROFILES (Tutores, Lojistas e Super Admins)
create table if not exists public.profiles (
  id text primary key,
  role text not null check (role in ('tutor', 'merchant', 'admin')) default 'tutor',
  full_name text not null,
  email text unique not null,
  whatsapp text not null,
  address text default 'Rua das Palmeiras, 14',
  cashback_balance numeric(10,2) not null default 42.80,
  club_points integer not null default 2450,
  club_tier text not null default 'Ouro VIP',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 2. PETS (Vinculados ao Tutor + Carteirinha Sanitária JSONB)
create table if not exists public.pets (
  id text primary key,
  tutor_id text not null references public.profiles(id) on delete cascade,
  name text not null,
  species text not null check (species in ('dog', 'cat')),
  breed text not null,
  age text not null,
  weight text not null,
  size text not null check (size in ('P', 'M', 'G')),
  avatar_url text not null,
  badge_text text not null default 'Vacinas em dia',
  badge_status text not null check (badge_status in ('ok', 'warning')) default 'ok',
  deworming_next text not null default 'Em dia',
  notes text,
  vaccines jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 3. STORES (Petshops Parceiros Hiperlocais)
create table if not exists public.stores (
  id text primary key,
  merchant_id text references public.profiles(id) on delete set null,
  name text not null,
  subtitle text not null,
  distance_km numeric(4,1) not null default 1.2,
  rating numeric(3,2) not null default 4.90,
  review_count integer not null default 340,
  eta_minutes text not null default '25–35 min',
  delivery_fee numeric(10,2) not null default 0.00,
  next_bath_slot text not null default 'Banho hoje às 16:00',
  is_pro boolean not null default true,
  address text not null,
  image_url text not null,
  active_in_pilot boolean not null default true,
  anticipated_d1 boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4. STORE_BAYS (Baias Físicas de Estética separadas por Porte P/M e G)
create table if not exists public.store_bays (
  id text primary key,
  store_id text not null references public.stores(id) on delete cascade,
  bay_group text not null check (bay_group in ('PM', 'G')),
  bay_label text not null,
  tolerance_minutes integer not null default 15,
  no_show_penalty_pct numeric(5,2) not null default 20.00,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. CATALOG_ITEMS (Produtos Físicos & Serviços de Banho/Tosa c/ Switch Anti-Ruptura)
create table if not exists public.catalog_items (
  id text primary key,
  store_id text not null references public.stores(id) on delete cascade,
  store_name text not null,
  item_type text not null check (item_type in ('product', 'service')) default 'product',
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  discount_tag text,
  category text not null,
  image_url text not null,
  stock integer not null default 15,
  paused boolean not null default false,
  is_flash_offer boolean not null default false,
  pet_target text check (pet_target in ('dog', 'cat', 'all')) default 'all',
  price_by_size jsonb,
  duration_minutes integer,
  created_at timestamptz not null default now()
);

-- 6. ORDERS (Comanda Híbrida Unificada: Produtos + Banho & Tosa + SLA 15 min + Split 90/10)
create table if not exists public.orders (
  id text primary key,
  code text not null,
  store_id text not null references public.stores(id) on delete cascade,
  store_name text not null,
  tutor_id text references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_whatsapp text not null,
  customer_address text not null,
  status text not null check (status in ('pending_sla', 'accepted', 'completed', 'rejected')) default 'pending_sla',
  rejection_reason text,
  sla_remaining_seconds integer not null default 900,
  sla_deadline_at timestamptz not null default (now() + interval '15 minutes'),
  delivery_method text not null check (delivery_method in ('delivery', 'pickup')) default 'delivery',
  delivery_fee numeric(10,2) not null default 0.00,
  cashback_used numeric(10,2) not null default 0.00,
  subtotal numeric(10,2) not null default 0.00,
  total numeric(10,2) not null default 0.00,
  take_rate_pct numeric(5,2) not null default 10.00,
  take_rate_amount numeric(10,2) not null default 0.00,
  merchant_net_amount numeric(10,2) not null default 0.00,
  settlement_cycle text not null check (settlement_cycle in ('D+7', 'D+1')) default 'D+7',
  product_step smallint not null default 1 check (product_step between 1 and 4),
  grooming_step smallint not null default 1 check (grooming_step between 1 and 4),
  grooming_payload jsonb,
  created_label text not null default 'Agora mesmo',
  created_at timestamptz not null default now()
);

-- Trigger para calcular automaticamente o Split 90/10 (10% Take-Rate PetHub / 90% Líquido Lojista)
create or replace function public.fn_calculate_order_split()
returns trigger
language plpgsql
as $$
begin
  new.take_rate_amount := round(coalesce(new.total, 0) * (coalesce(new.take_rate_pct, 10.0) / 100.0), 2);
  new.merchant_net_amount := round(coalesce(new.total, 0) - new.take_rate_amount, 2);
  return new;
end;
$$;

drop trigger if exists trg_calculate_order_split on public.orders;
create trigger trg_calculate_order_split
before insert or update of total, take_rate_pct on public.orders
for each row execute function public.fn_calculate_order_split();

-- 7. ORDER_ITEMS (Itens Físicos e Serviços da Comanda Híbrida)
create table if not exists public.order_items (
  id text primary key default ('oi-' || gen_random_uuid()::text),
  order_id text not null references public.orders(id) on delete cascade,
  catalog_item_id text references public.catalog_items(id) on delete set null,
  item_type text not null check (item_type in ('product', 'grooming', 'cross_sell')) default 'product',
  name text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 8. BAY_BOOKINGS (Grade Horária de Baias por Porte P/M e G + Regra No-Show Multa 20%)
create table if not exists public.bay_bookings (
  id text primary key,
  store_id text not null references public.stores(id) on delete cascade,
  bay_id text references public.store_bays(id) on delete set null,
  order_id text references public.orders(id) on delete set null,
  bay_group text not null check (bay_group in ('PM', 'G')),
  bay_label text not null,
  slot_time text not null,
  pet_name text,
  pet_breed text,
  tutor_name text,
  tutor_phone text,
  service_name text,
  service_value numeric(10,2) default 0.00,
  status text not null check (status in ('free', 'occupied', 'late_tolerance', 'no_show_freed')) default 'free',
  minutes_late integer default 0,
  no_show_penalty_applied numeric(10,2) default 0.00,
  created_at timestamptz not null default now()
);

-- 9. CLINICAL_TRIAGE_AND_REVIEWS (Checklist de Triagem Clínica, Cross-Selling 1-Click e Avaliação 1-5 Estrelas)
create table if not exists public.clinical_triage_and_reviews (
  id text primary key default ('ctr-' || gen_random_uuid()::text),
  order_id text not null unique references public.orders(id) on delete cascade,
  skin_and_coat_checked boolean not null default false,
  ears_cleaned boolean not null default false,
  parasites_detected boolean not null default false,
  nails_trimmed boolean not null default false,
  triage_notes text default '',
  cross_sell_title text,
  cross_sell_note text,
  cross_sell_price numeric(10,2),
  cross_sell_status text check (cross_sell_status in ('pending', 'approved', 'declined')),
  rating smallint check (rating between 1 and 5),
  review_comment text,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — MVP DEMO + PRODUÇÃO
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.stores enable row level security;
alter table public.store_bays enable row level security;
alter table public.catalog_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.bay_bookings enable row level security;
alter table public.clinical_triage_and_reviews enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles',
    'pets',
    'stores',
    'store_bays',
    'catalog_items',
    'orders',
    'order_items',
    'bay_bookings',
    'clinical_triage_and_reviews'
  ]
  loop
    execute format('drop policy if exists "mvp_public_all_%I" on public.%I;', t, t);
    execute format(
      'create policy "mvp_public_all_%I" on public.%I for all to anon, authenticated using (true) with check (true);',
      t, t
    );
  end loop;
end $$;

-- ============================================================================
-- HABILITAR SUPABASE REALTIME NAS TABELAS OPERACIONAIS
-- ============================================================================
do $$
begin
  begin
    alter publication supabase_realtime add table public.orders;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.order_items;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.catalog_items;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.bay_bookings;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.clinical_triage_and_reviews;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.pets;
  exception when duplicate_object then null;
  end;
end $$;
