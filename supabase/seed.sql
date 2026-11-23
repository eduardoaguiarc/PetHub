-- ============================================================================
-- PETHUB B2B2C MARKETPLACE — SUPABASE SEED DATA (PILOTO MOEMA & JARDINS)
-- ============================================================================

-- 1. PROFILES (Contas Demo: Tutor, Lojista e Super Admin)
insert into public.profiles (id, role, full_name, email, whatsapp, address, cashback_balance, club_points, club_tier, avatar_url)
values
  ('prof-tutor-eduardo', 'tutor', 'Eduardo Silva', 'eduardo.silva@exemplo.com', '(11) 99812-4410', 'Rua das Palmeiras, 14', 42.80, 2450, 'Ouro VIP', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
  ('prof-merchant-vilapet', 'merchant', 'Vila Pet & Banho Spa (Gerência)', 'lojista@vilapet.com.br', '(11) 98110-2200', 'Al. dos Nhambiquaras, 410 • Moema', 0.00, 0, 'Parceiro PRO', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=250&q=80'),
  ('prof-admin-pethub', 'admin', 'Super Admin PetHub (Control Tower)', 'admin@pethub.com.br', '(11) 99999-0000', 'Av. Paulista, 1000 • São Paulo', 0.00, 0, 'Staff', null)
on conflict (id) do update set
  full_name = excluded.full_name,
  cashback_balance = excluded.cashback_balance,
  club_points = excluded.club_points;

-- 2. PETS (Thor - Golden & Mia - Siamês)
insert into public.pets (id, tutor_id, name, species, breed, age, weight, size, avatar_url, badge_text, badge_status, deworming_next, notes, vaccines)
values
  (
    'pet-thor',
    'prof-tutor-eduardo',
    'Thor',
    'dog',
    'Golden Retriever',
    '3 anos',
    '28kg',
    'G',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
    'Vacinas em dia',
    'ok',
    'Em dia (próx. 18/01)',
    'Pele sensível na região dorsal. Gosta de água morna.',
    '[{"id":"v1","name":"V10 Polivalente (Importada)","date":"14/08/2026","nextDue":"14/08/2027","status":"ok"},{"id":"v2","name":"Antirrábica Dose Anual","date":"14/08/2026","nextDue":"14/08/2027","status":"ok"},{"id":"v3","name":"Gripe Canina (BronchiGuard)","date":"02/05/2026","nextDue":"02/05/2027","status":"ok"}]'::jsonb
  ),
  (
    'pet-mia',
    'prof-tutor-eduardo',
    'Mia',
    'cat',
    'Siamês',
    '2 anos',
    '3.8kg',
    'P',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
    'Vermífugo em 4d',
    'warning',
    'Vence em 4 dias (Milbemax Gatos)',
    'Prefere secador silencioso e escovação suave.',
    '[{"id":"v4","name":"Quádrupla Felina (V4)","date":"10/03/2026","nextDue":"10/03/2027","status":"ok"},{"id":"v5","name":"Antirrábica Felina","date":"10/03/2026","nextDue":"10/03/2027","status":"ok"},{"id":"v6","name":"Vermífugo Milbemax","date":"27/08/2026","nextDue":"Em 4 dias","status":"warning"}]'::jsonb
  )
on conflict (id) do update set
  badge_text = excluded.badge_text,
  avatar_url = excluded.avatar_url,
  vaccines = excluded.vaccines;

-- 3. STORES (Lojas Hiperlocais do Piloto)
insert into public.stores (id, merchant_id, name, subtitle, distance_km, rating, review_count, eta_minutes, delivery_fee, next_bath_slot, is_pro, address, image_url, active_in_pilot)
values
  ('store-vila-pet', 'prof-merchant-vilapet', 'Vila Pet & Banho Spa', 'Pet Shop & Grooming • Especialista Cães & Gatos', 1.2, 4.90, 340, '25–35 min', 0.00, 'Banho hoje às 16:00', true, 'Al. dos Nhambiquaras, 410 • Moema', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80', true),
  ('store-pet-cia', 'prof-merchant-vilapet', 'Pet & Cia Jardins', 'Rações Super Premium & Farmácia 24h', 1.8, 4.80, 215, '15–25 min', 4.90, 'Banho hoje às 17:00', true, 'Rua Oscar Freire, 1180 • Jardins', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80', true),
  ('store-petz-nobre', 'prof-merchant-vilapet', 'Petz Bairro Nobre', 'Clínica Veterinária, Spa & Megastore', 2.4, 4.70, 512, '30–40 min', 4.90, 'Amanhã às 09:00', false, 'Av. Ibirapuera, 2315 • Moema', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&q=80', true)
on conflict (id) do update set
  name = excluded.name,
  rating = excluded.rating;

-- 4. STORE_BAYS (Baias Físicas por Porte P/M e G)
insert into public.store_bays (id, store_id, bay_group, bay_label, tolerance_minutes, no_show_penalty_pct)
values
  ('sb-pm-01', 'store-vila-pet', 'PM', 'Baia 01 (Porte P/M)', 15, 20.00),
  ('sb-pm-02', 'store-vila-pet', 'PM', 'Baia 02 (Porte P/M)', 15, 20.00),
  ('sb-g-03', 'store-vila-pet', 'G', 'Baia 03 (Porte Grande - Dupla Secagem)', 15, 20.00)
on conflict (id) do nothing;

-- 5. CATALOG_ITEMS (Produtos Físicos)
insert into public.catalog_items (id, store_id, store_name, item_type, name, description, price, original_price, discount_tag, category, image_url, stock, paused, is_flash_offer, pet_target)
values
  ('prod-simparic', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Antipulgas Simparic 20 a 40kg (3 Comprimidos)', 'Proteção rápida contra pulgas, carrapatos e sarnas por até 35 dias.', 164.90, 219.90, '-25% OFF', 'farmacia', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', 18, false, true, 'dog'),
  ('prod-pipicat', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Areia Higiênica Pipicat Perfumada 4kg', 'Grãos finos com controle superior de odores e torrão firme instantâneo.', 24.90, 35.90, '-30% OFF', 'higiene', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', 32, false, true, 'cat'),
  ('prod-premier-15kg', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Ração Premier Fórmula Cães Adultos Raças Grandes 15kg', 'Sabor Frango, suporte articular com condroitina e glicosamina para Golden.', 239.90, 269.90, 'Recorrente', 'racoes', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80', 12, false, false, 'dog'),
  ('prod-golden-15kg', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Ração Golden Fórmula Cães Adultos Frango & Arroz 15kg', 'Alimento Premium Especial sem corantes artificiais e equilíbrio intestinal.', 149.90, 199.90, '-25% OFF', 'racoes', 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=400&q=80', 9, false, true, 'dog'),
  ('prod-churu', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Petisco Cremoso Inaba Churu Atum & Salmão (4 Tubos)', 'Hidratação saudável e irresistível para gatos exigentes, sem grãos.', 27.90, 34.90, 'Leve 3 Pague 2', 'petiscos', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80', 25, false, true, 'cat'),
  ('prod-tapete-50un', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Tapete Higiênico Super Secão Ultra Absorvente 50un', 'Gel superabsorvente com atrativo canino e fitas adesivas.', 89.90, 109.90, '-18% OFF', 'higiene', 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80', 14, false, false, 'dog'),
  ('prod-kong-classic', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Brinquedo Mordedor Kong Classic Red Recheável Tam. G', 'Borracha natural ultra resistente para enriquecimento ambiental.', 94.90, 112.00, null, 'brinquedos', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80', 7, false, false, 'dog'),
  ('prod-dental-care', 'store-vila-pet', 'Vila Pet & Banho Spa', 'product', 'Petisco Dental Care Cuidado Bucal Anti-Tártaro 7 unid', 'Textura porosa que limpa até a linha da gengiva e refresca o hálito.', 28.90, null, null, 'petiscos', 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=400&q=80', 20, false, false, 'dog')
on conflict (id) do update set
  price = excluded.price,
  paused = excluded.paused;

-- 6. ORDERS (Comandas Híbridas Iniciais)
insert into public.orders (
  id, code, store_id, store_name, tutor_id, customer_name, customer_whatsapp, customer_address,
  status, sla_remaining_seconds, delivery_method, delivery_fee, cashback_used, subtotal, total,
  product_step, grooming_step, grooming_payload, created_label
)
values
  (
    'ord-4819',
    '#4819',
    'store-vila-pet',
    'Vila Pet & Banho Spa',
    'prof-tutor-eduardo',
    'Eduardo Silva',
    '(11) 99812-4410',
    'Rua das Palmeiras, 14 • Moema',
    'accepted',
    845,
    'delivery',
    0.00,
    0.00,
    268.70,
    268.70,
    3,
    2,
    '{"serviceId":"srv-banho-hidratacao","serviceName":"Combo Spa: Banho + Hidratação + Corte de Unhas","petId":"pet-thor","petName":"Thor","petBreed":"Golden Retriever","size":"G","date":"Hoje","time":"16:00","price":89.9}'::jsonb,
    'Hoje, 14:40'
  ),
  (
    'ord-4822',
    '#4822',
    'store-vila-pet',
    'Vila Pet & Banho Spa',
    null,
    'Mariana Costa (Bairro Moema)',
    '(11) 99104-8821',
    'Av. Pavão, 312 • Apto 82',
    'pending_sla',
    892,
    'pickup',
    0.00,
    0.00,
    244.80,
    244.80,
    1,
    1,
    '{"serviceId":"srv-banho-tosa-higienica","serviceName":"Banho Premium + Tosa Higiênica","petId":"pet-bento","petName":"Bento","petBreed":"Spitz Alemão","size":"P","date":"Hoje","time":"17:00","price":79.9}'::jsonb,
    'Agora mesmo'
  )
on conflict (id) do nothing;

-- 7. ORDER_ITEMS
insert into public.order_items (id, order_id, catalog_item_id, item_type, name, quantity, unit_price)
values
  ('oi-4819-1', 'ord-4819', 'prod-golden-15kg', 'product', 'Ração Golden Cães Adultos Frango & Arroz 15kg', 1, 149.90),
  ('oi-4819-2', 'ord-4819', 'prod-dental-care', 'product', 'Petisco Dental Care Cuidado Bucal 7 unid', 1, 28.90),
  ('oi-4822-1', 'ord-4822', 'prod-simparic', 'product', 'Antipulgas Simparic 20 a 40kg (3 Comprimidos)', 1, 164.90)
on conflict (id) do nothing;

-- 8. CLINICAL_TRIAGE_AND_REVIEWS
insert into public.clinical_triage_and_reviews (
  id, order_id, skin_and_coat_checked, ears_cleaned, parasites_detected, nails_trimmed, triage_notes
)
values
  ('ctr-4819', 'ord-4819', true, true, false, false, 'Pelagem densa com leve ressecamento lombar. Check-in realizado no horário.'),
  ('ctr-4822', 'ord-4822', false, false, false, false, '')
on conflict (order_id) do nothing;

-- 9. BAY_BOOKINGS (Grade Horária de Baias P/M e G)
insert into public.bay_bookings (
  id, store_id, bay_id, order_id, bay_group, bay_label, slot_time, pet_name, pet_breed, tutor_name, tutor_phone, service_name, service_value, status, minutes_late, no_show_penalty_applied
)
values
  ('bay-pm-1400', 'store-vila-pet', 'sb-pm-01', null, 'PM', 'Baia 01 (Porte P/M)', '14:00', 'Mel', 'Shih-tzu (5kg)', 'Camila Rocha', '(11) 98842-1190', 'Banho + Tosa Bebê', 85.00, 'occupied', 0, 0.00),
  ('bay-pm-1500', 'store-vila-pet', 'sb-pm-01', null, 'PM', 'Baia 01 (Porte P/M)', '15:00', 'Lola', 'Yorkshire (3.4kg)', 'Rafael Mendes', '(11) 97211-0092', 'Combo Spa + Hidratação', 75.00, 'late_tolerance', 17, 0.00),
  ('bay-pm-1630', 'store-vila-pet', 'sb-pm-02', null, 'PM', 'Baia 02 (Porte P/M)', '16:30', null, null, null, null, null, 0.00, 'free', 0, 0.00),
  ('bay-pm-1700', 'store-vila-pet', 'sb-pm-01', 'ord-4822', 'PM', 'Baia 01 (Porte P/M)', '17:00', 'Bento', 'Spitz Alemão (4.5kg)', 'Mariana Costa', '(11) 99104-8821', 'Banho Premium + Tosa Higiênica', 79.90, 'occupied', 0, 0.00),
  ('bay-g-1400', 'store-vila-pet', 'sb-g-03', null, 'G', 'Baia 03 (Porte Grande - Dupla Secagem)', '14:00', 'Apollo', 'Labrador (32kg)', 'Fernando Alves', '(11) 98410-3321', 'Banho Desembolo + Unhas', 110.00, 'occupied', 0, 0.00),
  ('bay-g-1500', 'store-vila-pet', 'sb-g-03', null, 'G', 'Baia 03 (Porte Grande - Dupla Secagem)', '15:00', 'Zeus', 'Pastor Alemão (36kg)', 'Lucas Tavares', '(11) 99311-5520', 'Banho Terapêutico Porte G', 120.00, 'late_tolerance', 19, 0.00),
  ('bay-g-1600', 'store-vila-pet', 'sb-g-03', 'ord-4819', 'G', 'Baia 03 (Porte Grande - Dupla Secagem)', '16:00', 'Thor', 'Golden Retriever (28kg)', 'Eduardo Silva', '(11) 99812-4410', 'Combo Spa: Banho + Hidratação', 89.90, 'occupied', 0, 0.00),
  ('bay-g-1700', 'store-vila-pet', 'sb-g-03', null, 'G', 'Baia 03 (Porte Grande - Dupla Secagem)', '17:00', null, null, null, null, null, 0.00, 'free', 0, 0.00)
on conflict (id) do nothing;
