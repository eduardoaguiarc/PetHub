import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppRole,
  TutorTab,
  PetProfile,
  ProductItem,
  PartnerStore,
  CartItem,
  ScheduledGrooming,
  HybridOrder,
  DeliveryMethod,
  BaySlotBooking,
  ClinicalTriageChecklist,
  ProductDeliveryStep,
  GroomingLiveStep,
  CategoryId,
  PetSize,
} from '../types/pethub';
import {
  INITIAL_PETS,
  PARTNER_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_BAY_SLOTS,
} from '../data/mockData';
import { supabase } from '../lib/supabase';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export type SupabaseConnectionState = 'connecting' | 'connected_db' | 'ready_fallback';

interface PetHubContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  tutorTab: TutorTab;
  setTutorTab: (tab: TutorTab) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  quickDemoLogin: (targetRole: AppRole) => Promise<void>;

  // Supabase status
  supabaseStatus: SupabaseConnectionState;
  refreshFromSupabase: () => Promise<void>;

  // User & Pets
  userAddress: string;
  setUserAddress: (addr: string) => void;
  pets: PetProfile[];
  activePetId: string;
  setActivePetId: (id: string) => void;
  activePet: PetProfile;
  addPet: (pet: Omit<PetProfile, 'id'>) => void;
  cashbackBalance: number;
  clubPoints: number;

  // Stores & Catalog
  stores: PartnerStore[];
  products: ProductItem[];
  toggleProductPause: (productId: string) => void;
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;

  // Hybrid Cart (Products + Grooming in a single Order)
  cartItems: CartItem[];
  cartGrooming: ScheduledGrooming | null;
  addToCart: (product: ProductItem, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  setCartGrooming: (grooming: ScheduledGrooming | null) => void;
  clearCart: () => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeHybridOrder: (options: {
    deliveryMethod: DeliveryMethod;
    useCashback: boolean;
    paymentMethod: string;
  }) => HybridOrder;

  // Live Orders & Cross-selling
  orders: HybridOrder[];
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  advanceProductStep: (orderId: string, step?: ProductDeliveryStep) => void;
  advanceGroomingStep: (orderId: string, step?: GroomingLiveStep) => void;
  updateTriageChecklist: (orderId: string, patch: Partial<ClinicalTriageChecklist>) => void;
  triggerCrossSell: (
    orderId: string,
    proposal?: { title: string; clinicalNote: string; price: number }
  ) => void;
  respondCrossSell: (orderId: string, approve: boolean) => void;
  submitOrderReview: (orderId: string, rating: number, comment: string) => void;

  // Grooming Bays & No-Show
  baySlots: BaySlotBooking[];
  registerBayNoShow: (bayId: string) => void;

  // Finance & Flash Timer
  flashTimerSeconds: number;
  anticipatedD1: boolean;
  requestD1Anticipation: () => void;

  // Toast feedback
  toasts: ToastNotification[];
  pushToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const PetHubContext = createContext<PetHubContextType | undefined>(undefined);

export const PetHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('tutor');
  const [tutorTab, setTutorTab] = useState<TutorTab>('inicio');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] =
    useState<SupabaseConnectionState>('connecting');

  const [userAddress, setUserAddress] = useState<string>('Rua das Palmeiras, 14');
  const [pets, setPets] = useState<PetProfile[]>(INITIAL_PETS);
  const [activePetId, setActivePetId] = useState<string>(INITIAL_PETS[0].id);
  const [cashbackBalance, setCashbackBalance] = useState<number>(42.8);
  const [clubPoints, setClubPoints] = useState<number>(2450);

  const [stores, setStores] = useState<PartnerStore[]>(PARTNER_STORES);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartGrooming, setCartGroomingState] = useState<ScheduledGrooming | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const [orders, setOrders] = useState<HybridOrder[]>(INITIAL_ORDERS);
  const [baySlots, setBaySlots] = useState<BaySlotBooking[]>(INITIAL_BAY_SLOTS);

  // 02:44:17 in seconds = 9857
  const [flashTimerSeconds, setFlashTimerSeconds] = useState<number>(9857);
  const [anticipatedD1, setAnticipatedD1] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  const pushToast = useCallback(
    (
      title: string,
      message: string,
      type: 'success' | 'info' | 'warning' = 'success'
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load & Sync data from Supabase tables (profiles, pets, stores, catalog_items, orders, order_items, bay_bookings, clinical_triage_and_reviews)
  const refreshFromSupabase = useCallback(async () => {
    try {
      const [
        profilesRes,
        petsRes,
        storesRes,
        catalogRes,
        ordersRes,
        orderItemsRes,
        triageRes,
        baysRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('pets').select('*').order('created_at', { ascending: true }),
        supabase.from('stores').select('*').order('distance_km', { ascending: true }),
        supabase.from('catalog_items').select('*').eq('item_type', 'product'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('order_items').select('*'),
        supabase.from('clinical_triage_and_reviews').select('*'),
        supabase.from('bay_bookings').select('*').order('slot_time', { ascending: true }),
      ]);

      // If schema is not created yet in Supabase SQL Editor, stay in ready_fallback without crashing
      if (storesRes.error || catalogRes.error) {
        setSupabaseStatus('ready_fallback');
        return;
      }

      setSupabaseStatus('connected_db');

      // 1. Tutor Profile
      if (profilesRes.data && profilesRes.data.length > 0) {
        const tutorProf = profilesRes.data.find((p) => p.role === 'tutor') || profilesRes.data[0];
        if (tutorProf) {
          if (tutorProf.address) setUserAddress(tutorProf.address);
          if (tutorProf.cashback_balance !== undefined)
            setCashbackBalance(Number(tutorProf.cashback_balance));
          if (tutorProf.club_points !== undefined)
            setClubPoints(Number(tutorProf.club_points));
        }
      }

      // 2. Pets
      if (petsRes.data && petsRes.data.length > 0) {
        const mappedPets: PetProfile[] = petsRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          species: row.species,
          breed: row.breed,
          age: row.age,
          weight: row.weight,
          size: row.size as PetSize,
          avatar: row.avatar_url,
          badgeText: row.badge_text,
          badgeStatus: row.badge_status,
          dewormingNext: row.deworming_next,
          notes: row.notes || '',
          vaccines: Array.isArray(row.vaccines) ? row.vaccines : [],
        }));
        setPets(mappedPets);
      }

      // 3. Stores
      if (storesRes.data && storesRes.data.length > 0) {
        const mappedStores: PartnerStore[] = storesRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          subtitle: row.subtitle,
          distanceKm: Number(row.distance_km),
          rating: Number(row.rating),
          reviewCount: Number(row.review_count),
          etaMinutes: row.eta_minutes,
          deliveryFee: Number(row.delivery_fee),
          nextBathSlot: row.next_bath_slot,
          isPro: Boolean(row.is_pro),
          address: row.address,
          image: row.image_url,
          activeInPilot: Boolean(row.active_in_pilot),
        }));
        setStores(mappedStores);
        const vilaPet = storesRes.data.find((s: any) => s.id === 'store-vila-pet');
        if (vilaPet && vilaPet.anticipated_d1 !== undefined) {
          setAnticipatedD1(Boolean(vilaPet.anticipated_d1));
        }
      }

      // 4. Catalog Items
      if (catalogRes.data && catalogRes.data.length > 0) {
        const mappedProducts: ProductItem[] = catalogRes.data.map((row: any) => ({
          id: row.id,
          storeId: row.store_id,
          storeName: row.store_name,
          name: row.name,
          description: row.description,
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : undefined,
          discountTag: row.discount_tag || undefined,
          category: row.category as CategoryId,
          image: row.image_url,
          stock: Number(row.stock),
          paused: Boolean(row.paused),
          isFlashOffer: Boolean(row.is_flash_offer),
          petTarget: row.pet_target || 'all',
        }));
        setProducts(mappedProducts);
      }

      // 5. Orders + Order Items + Clinical Triage & Reviews
      if (ordersRes.data && ordersRes.data.length > 0) {
        const allItems = orderItemsRes.data || [];
        const allTriages = triageRes.data || [];

        const mappedOrders: HybridOrder[] = ordersRes.data.map((row: any) => {
          const itemsForOrder = allItems
            .filter((i: any) => i.order_id === row.id && i.item_type === 'product')
            .map((i: any) => ({
              productId: i.catalog_item_id || i.id,
              name: i.name,
              quantity: Number(i.quantity),
              unitPrice: Number(i.unit_price),
            }));

          const tr = allTriages.find((t: any) => t.order_id === row.id);

          return {
            id: row.id,
            code: row.code,
            storeId: row.store_id,
            storeName: row.store_name,
            customerName: row.customer_name,
            customerWhatsapp: row.customer_whatsapp,
            customerAddress: row.customer_address,
            createdAt: row.created_label || 'Hoje',
            slaRemainingSeconds: Number(row.sla_remaining_seconds ?? 900),
            status: row.status,
            rejectionReason: row.rejection_reason || undefined,
            items: itemsForOrder,
            grooming: row.grooming_payload || undefined,
            deliveryMethod: row.delivery_method,
            deliveryFee: Number(row.delivery_fee || 0),
            cashbackUsed: Number(row.cashback_used || 0),
            subtotal: Number(row.subtotal),
            total: Number(row.total),
            productStep: (Number(row.product_step) || 1) as ProductDeliveryStep,
            groomingStep: (Number(row.grooming_step) || 1) as GroomingLiveStep,
            crossSell:
              tr && tr.cross_sell_title
                ? {
                    id: tr.id,
                    title: tr.cross_sell_title,
                    clinicalNote: tr.cross_sell_note || '',
                    price: Number(tr.cross_sell_price || 35),
                    status: tr.cross_sell_status || 'pending',
                    createdAt: 'Ao vivo',
                  }
                : undefined,
            triageChecklist: {
              skinAndCoatChecked: Boolean(tr?.skin_and_coat_checked),
              earsCleaned: Boolean(tr?.ears_cleaned),
              parasitesDetected: Boolean(tr?.parasites_detected),
              nailsTrimmed: Boolean(tr?.nails_trimmed),
              notes: tr?.triage_notes || '',
            },
            rating: tr?.rating ? Number(tr.rating) : undefined,
            reviewComment: tr?.review_comment || undefined,
          };
        });

        setOrders(mappedOrders);
      }

      // 6. Bay Bookings
      if (baysRes.data && baysRes.data.length > 0) {
        const mappedBays: BaySlotBooking[] = baysRes.data.map((row: any) => ({
          id: row.id,
          bayGroup: row.bay_group,
          bayLabel: row.bay_label,
          time: row.slot_time,
          petName: row.pet_name || undefined,
          petBreed: row.pet_breed || undefined,
          tutorName: row.tutor_name || undefined,
          tutorPhone: row.tutor_phone || undefined,
          serviceName: row.service_name || undefined,
          serviceValue: row.service_value ? Number(row.service_value) : undefined,
          status: row.status,
          minutesLate: row.minutes_late ? Number(row.minutes_late) : undefined,
          noShowPenaltyApplied: row.no_show_penalty_applied
            ? Number(row.no_show_penalty_applied)
            : undefined,
        }));
        setBaySlots(mappedBays);
      }
    } catch {
      setSupabaseStatus('ready_fallback');
    }
  }, []);

  // Initial load + URL query parameter support (?store=store-vila-pet) + Supabase Realtime Subscription
  useEffect(() => {
    refreshFromSupabase();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const storeParam = params.get('store');
      if (storeParam) {
        setSelectedStoreId(storeParam);
      }
    }

    const channel = supabase
      .channel('pethub-realtime-b2b2c')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => refreshFromSupabase()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'catalog_items' },
        () => refreshFromSupabase()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bay_bookings' },
        () => refreshFromSupabase()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clinical_triage_and_reviews' },
        () => refreshFromSupabase()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromSupabase]);

  // Global interval for Flash Offer Countdown & Merchant 15-min SLA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTimerSeconds((prev) => (prev > 0 ? prev - 1 : 9857));
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === 'pending_sla' && order.slaRemainingSeconds > 0) {
            return { ...order, slaRemainingSeconds: order.slaRemainingSeconds - 1 };
          }
          return order;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick Demo Login (Tutor, Lojista, Admin) connected to Supabase profiles
  const quickDemoLogin = async (targetRole: AppRole) => {
    setRole(targetRole);
    setIsAuthenticated(true);
    setShowAuthModal(false);

    const profileIdMap: Record<AppRole, string> = {
      tutor: 'prof-tutor-eduardo',
      merchant: 'prof-merchant-vilapet',
      admin: 'prof-admin-pethub',
    };

    try {
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileIdMap[targetRole])
        .maybeSingle();
    } catch {
      // Ignore if table not migrated yet
    }

    const roleTitles: Record<AppRole, { title: string; msg: string }> = {
      tutor: {
        title: 'Login Rápido Demo: Tutor (Eduardo Silva)',
        msg: 'Sessão Mobile PWA 390px autenticada com Thor, Mia e PetHub Pay.',
      },
      merchant: {
        title: 'Login Rápido Demo: Lojista (Vila Pet & Banho Spa)',
        msg: 'Painel de Pedidos SLA 15 min, Baias P/M e G, Catálogo e Split 90/10 ativo.',
      },
      admin: {
        title: 'Login Rápido Demo: Super Admin (Control Tower)',
        msg: 'Visão executiva do piloto (25 lojas, R$ 45k GMV, No-Show < 5%) liberada.',
      },
    };

    pushToast(roleTitles[targetRole].title, roleTitles[targetRole].msg, 'info');
  };

  const addPet = (newPet: Omit<PetProfile, 'id'>) => {
    const id = `pet-${Date.now()}`;
    const created: PetProfile = {
      ...newPet,
      id,
    };
    setPets((prev) => [...prev, created]);
    setActivePetId(created.id);
    pushToast('Novo Pet Cadastrado', `${created.name} agora faz parte do PetHub Club!`);

    // Persist in Supabase pets table
    supabase
      .from('pets')
      .insert({
        id,
        tutor_id: 'prof-tutor-eduardo',
        name: created.name,
        species: created.species,
        breed: created.breed,
        age: created.age,
        weight: created.weight,
        size: created.size,
        avatar_url: created.avatar,
        badge_text: created.badgeText,
        badge_status: created.badgeStatus,
        deworming_next: created.dewormingNext,
        notes: created.notes || '',
        vaccines: created.vaccines,
      })
      .then(() => {});
  };

  const toggleProductPause = (productId: string) => {
    let nextPausedState = false;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          nextPausedState = !p.paused;
          pushToast(
            nextPausedState ? 'Produto Pausado (Supabase Sync)' : 'Produto Ativado (Supabase Sync)',
            `${p.name} foi ${
              nextPausedState ? 'ocultado da vitrine do tutor' : 'reativado para venda imediata'
            }.`,
            nextPausedState ? 'warning' : 'success'
          );
          return { ...p, paused: nextPausedState };
        }
        return p;
      })
    );

    supabase
      .from('catalog_items')
      .update({ paused: nextPausedState })
      .eq('id', productId)
      .then(() => {});
  };

  const addToCart = (product: ProductItem, qty = 1) => {
    if (product.paused) {
      pushToast('Indisponível no momento', 'Este item foi pausado pela loja.', 'warning');
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    pushToast('Adicionado à sacola', `${qty}x ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const setCartGrooming = (grooming: ScheduledGrooming | null) => {
    setCartGroomingState(grooming);
    if (grooming) {
      pushToast(
        'Banho agendado na comanda!',
        `${grooming.serviceName} para ${grooming.petName} (${grooming.date} às ${grooming.time})`,
        'info'
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartGroomingState(null);
  };

  const placeHybridOrder = ({
    deliveryMethod,
    useCashback,
  }: {
    deliveryMethod: DeliveryMethod;
    useCashback: boolean;
    paymentMethod: string;
  }): HybridOrder => {
    const productsSubtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const groomingSubtotal = cartGrooming ? cartGrooming.price : 0;
    const subtotal = productsSubtotal + groomingSubtotal;
    const deliveryFee = 0;
    const cashbackApplied = useCashback ? Math.min(cashbackBalance, subtotal * 0.5) : 0;
    const total = Math.max(0, subtotal + deliveryFee - cashbackApplied);

    const orderId = `ord-${Date.now()}`;
    const newCode = `#${Math.floor(4825 + Math.random() * 70)}`;
    const newOrder: HybridOrder = {
      id: orderId,
      code: newCode,
      storeId: 'store-vila-pet',
      storeName: 'Vila Pet & Banho Spa',
      customerName: 'Eduardo Silva',
      customerWhatsapp: '(11) 99812-4410',
      customerAddress: `${userAddress} • Moema`,
      createdAt: 'Agora mesmo',
      slaRemainingSeconds: 900, // 15:00 exact SLA countdown
      status: 'pending_sla',
      items: cartItems.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
      })),
      grooming: cartGrooming || undefined,
      deliveryMethod,
      deliveryFee,
      cashbackUsed: cashbackApplied,
      subtotal,
      total,
      productStep: 1,
      groomingStep: 1,
      triageChecklist: {
        skinAndCoatChecked: false,
        earsCleaned: false,
        parasitesDetected: false,
        nailsTrimmed: false,
        notes: '',
      },
    };

    const nextCashback = Number(
      (cashbackBalance - cashbackApplied + total * 0.03).toFixed(2)
    );
    const nextPoints = clubPoints + Math.round(total);
    setCashbackBalance(nextCashback);
    setClubPoints(nextPoints);

    // Persist in Supabase orders, order_items, clinical_triage_and_reviews, and bay_bookings
    supabase
      .from('orders')
      .insert({
        id: orderId,
        code: newCode,
        store_id: 'store-vila-pet',
        store_name: 'Vila Pet & Banho Spa',
        tutor_id: 'prof-tutor-eduardo',
        customer_name: 'Eduardo Silva',
        customer_whatsapp: '(11) 99812-4410',
        customer_address: `${userAddress} • Moema`,
        status: 'pending_sla',
        sla_remaining_seconds: 900,
        delivery_method: deliveryMethod,
        delivery_fee: deliveryFee,
        cashback_used: cashbackApplied,
        subtotal,
        total,
        take_rate_pct: 10,
        take_rate_amount: Number((total * 0.1).toFixed(2)),
        merchant_net_amount: Number((total * 0.9).toFixed(2)),
        product_step: 1,
        grooming_step: 1,
        grooming_payload: cartGrooming || null,
        created_label: 'Agora mesmo',
      })
      .then(async () => {
        if (newOrder.items.length > 0) {
          await supabase.from('order_items').insert(
            newOrder.items.map((it, idx) => ({
              id: `oi-${orderId}-${idx}`,
              order_id: orderId,
              catalog_item_id: it.productId,
              item_type: 'product',
              name: it.name,
              quantity: it.quantity,
              unit_price: it.unitPrice,
            }))
          );
        }
        await supabase.from('clinical_triage_and_reviews').insert({
          id: `ctr-${orderId}`,
          order_id: orderId,
          skin_and_coat_checked: false,
          ears_cleaned: false,
          parasites_detected: false,
          nails_trimmed: false,
          triage_notes: '',
        });
      });

    supabase
      .from('profiles')
      .update({ cashback_balance: nextCashback, club_points: nextPoints })
      .eq('id', 'prof-tutor-eduardo')
      .then(() => {});

    if (cartGrooming) {
      const bayBookingId = `bay-${Date.now()}`;
      const newBaySlot: BaySlotBooking = {
        id: bayBookingId,
        bayGroup: cartGrooming.size === 'G' ? 'G' : 'PM',
        bayLabel:
          cartGrooming.size === 'G'
            ? 'Baia 03 (Porte Grande - Dupla Secagem)'
            : 'Baia 02 (Porte P/M)',
        time: cartGrooming.time,
        petName: cartGrooming.petName,
        petBreed: `${cartGrooming.petBreed} (${cartGrooming.size})`,
        tutorName: 'Eduardo Silva',
        tutorPhone: '(11) 99812-4410',
        serviceName: cartGrooming.serviceName,
        serviceValue: cartGrooming.price,
        status: 'occupied',
      };
      setBaySlots((prev) => [...prev, newBaySlot]);

      supabase
        .from('bay_bookings')
        .insert({
          id: bayBookingId,
          store_id: 'store-vila-pet',
          bay_id: cartGrooming.size === 'G' ? 'sb-g-03' : 'sb-pm-02',
          order_id: orderId,
          bay_group: newBaySlot.bayGroup,
          bay_label: newBaySlot.bayLabel,
          slot_time: newBaySlot.time,
          pet_name: newBaySlot.petName,
          pet_breed: newBaySlot.petBreed,
          tutor_name: newBaySlot.tutorName,
          tutor_phone: newBaySlot.tutorPhone,
          service_name: newBaySlot.serviceName,
          service_value: newBaySlot.serviceValue,
          status: 'occupied',
        })
        .then(() => {});
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setSelectedStoreId(null);
    setTutorTab('pedidos');

    pushToast(
      `Comanda ${newCode} enviada ao Supabase!`,
      'Aguardando aceite do lojista (SLA 15 min). Split 90/10 e +3% cashback registrados!'
    );

    return newOrder;
  };

  const acceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'accepted',
              productStep: o.items.length > 0 ? 2 : 1,
              groomingStep: o.grooming ? 1 : 1,
            }
          : o
      )
    );
    supabase
      .from('orders')
      .update({ status: 'accepted', product_step: 2 })
      .eq('id', orderId)
      .then(() => {});
    pushToast('Pedido Aceito dentro do SLA!', 'Comanda movida para produção e baia confirmada.');
  };

  const rejectOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'rejected', rejectionReason: reason } : o
      )
    );
    supabase
      .from('orders')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', orderId)
      .then(() => {});
    pushToast(
      'Pedido Recusado',
      `Justificativa enviada ao tutor via WhatsApp: "${reason}"`,
      'warning'
    );
  };

  const advanceProductStep = (orderId: string, explicitStep?: ProductDeliveryStep) => {
    let nextStepValue: ProductDeliveryStep = 2;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        nextStepValue = explicitStep || (Math.min(4, o.productStep + 1) as ProductDeliveryStep);
        return { ...o, productStep: nextStepValue };
      })
    );
    supabase
      .from('orders')
      .update({ product_step: nextStepValue })
      .eq('id', orderId)
      .then(() => {});
    pushToast('Status da Entrega Atualizado', 'O tutor recebeu a atualização em tempo real.');
  };

  const advanceGroomingStep = (orderId: string, explicitStep?: GroomingLiveStep) => {
    let nextStepValue: GroomingLiveStep = 2;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        nextStepValue = explicitStep || (Math.min(4, o.groomingStep + 1) as GroomingLiveStep);
        return { ...o, groomingStep: nextStepValue };
      })
    );
    supabase
      .from('orders')
      .update({ grooming_step: nextStepValue })
      .eq('id', orderId)
      .then(() => {});
    pushToast('Etapa do Banho Atualizada', 'Rastreamento do pet ao vivo atualizado para o tutor.');
  };

  const updateTriageChecklist = (orderId: string, patch: Partial<ClinicalTriageChecklist>) => {
    let updatedChecklist: ClinicalTriageChecklist | null = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          updatedChecklist = { ...o.triageChecklist, ...patch };
          return { ...o, triageChecklist: updatedChecklist };
        }
        return o;
      })
    );

    if (updatedChecklist) {
      const c = updatedChecklist as ClinicalTriageChecklist;
      supabase
        .from('clinical_triage_and_reviews')
        .upsert(
          {
            order_id: orderId,
            skin_and_coat_checked: c.skinAndCoatChecked,
            ears_cleaned: c.earsCleaned,
            parasites_detected: c.parasitesDetected,
            nails_trimmed: c.nailsTrimmed,
            triage_notes: c.notes,
          },
          { onConflict: 'order_id' }
        )
        .then(() => {});
    }
  };

  const triggerCrossSell = (
    orderId: string,
    proposal = {
      title: 'Banho Terapêutico Antipulgas + Máscara Calmante Aveia',
      clinicalNote:
        'Durante a triagem clínica na baia, identificamos leve irritação cutânea e presença de 2 pulgas no dorso. Recomendamos upgrade imediato.',
      price: 35.0,
    }
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              triageChecklist: {
                ...o.triageChecklist,
                skinAndCoatChecked: true,
                parasitesDetected: true,
              },
              crossSell: {
                id: `cs-${Date.now()}`,
                title: proposal.title,
                clinicalNote: proposal.clinicalNote,
                price: proposal.price,
                status: 'pending',
                createdAt: 'Agora mesmo',
              },
            }
          : o
      )
    );

    supabase
      .from('clinical_triage_and_reviews')
      .upsert(
        {
          order_id: orderId,
          skin_and_coat_checked: true,
          parasites_detected: true,
          cross_sell_title: proposal.title,
          cross_sell_note: proposal.clinicalNote,
          cross_sell_price: proposal.price,
          cross_sell_status: 'pending',
        },
        { onConflict: 'order_id' }
      )
      .then(() => {});

    pushToast(
      'Alerta de Triagem & Cross-Selling!',
      'Recomendação clínica enviada para aprovação em 1 clique do tutor.',
      'info'
    );
  };

  const respondCrossSell = (orderId: string, approve: boolean) => {
    let nextSubtotal = 0;
    let nextTotal = 0;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || !o.crossSell) return o;
        const addedPrice = approve ? o.crossSell.price : 0;
        nextSubtotal = Number((o.subtotal + addedPrice).toFixed(2));
        nextTotal = Number((o.total + addedPrice).toFixed(2));
        return {
          ...o,
          subtotal: nextSubtotal,
          total: nextTotal,
          crossSell: {
            ...o.crossSell,
            status: approve ? 'approved' : 'declined',
          },
        };
      })
    );

    supabase
      .from('clinical_triage_and_reviews')
      .update({ cross_sell_status: approve ? 'approved' : 'declined' })
      .eq('order_id', orderId)
      .then(() => {});

    if (approve && nextTotal > 0) {
      supabase
        .from('orders')
        .update({
          subtotal: nextSubtotal,
          total: nextTotal,
          take_rate_amount: Number((nextTotal * 0.1).toFixed(2)),
          merchant_net_amount: Number((nextTotal * 0.9).toFixed(2)),
        })
        .eq('id', orderId)
        .then(() => {});
    }

    if (approve) {
      pushToast(
        'Adicional Aprovado com 1 Clique!',
        'O serviço terapêutico foi incluído na comanda e recalculado no Split 90/10.'
      );
    } else {
      pushToast('Adicional Recusado', 'O banho seguirá apenas com o pacote padrão.', 'info');
    }
  };

  const submitOrderReview = (orderId: string, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating, reviewComment: comment } : o))
    );
    setClubPoints((prev) => prev + 50);

    supabase
      .from('clinical_triage_and_reviews')
      .upsert(
        {
          order_id: orderId,
          rating,
          review_comment: comment,
        },
        { onConflict: 'order_id' }
      )
      .then(() => {});

    pushToast(
      'Avaliação Salva no Supabase!',
      `Obrigado pelas ${rating} estrelas! Você ganhou +50 pts no PetHub Club.`
    );
  };

  const registerBayNoShow = (bayId: string) => {
    let penaltyAmount = 16.0;
    setBaySlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== bayId) return slot;
        penaltyAmount = Number(((slot.serviceValue || 80) * 0.2).toFixed(2));
        pushToast(
          'No-Show Registrado (Multa 20%)',
          `Baia liberada para encaixe imediato. Retenção compensatória de R$ ${penaltyAmount
            .toFixed(2)
            .replace('.', ',')} creditada ao lojista.`,
          'warning'
        );
        return {
          ...slot,
          status: 'no_show_freed',
          noShowPenaltyApplied: penaltyAmount,
        };
      })
    );

    supabase
      .from('bay_bookings')
      .update({
        status: 'no_show_freed',
        no_show_penalty_applied: penaltyAmount,
      })
      .eq('id', bayId)
      .then(() => {});
  };

  const requestD1Anticipation = () => {
    setAnticipatedD1(true);
    supabase
      .from('stores')
      .update({ anticipated_d1: true })
      .eq('id', 'store-vila-pet')
      .then(() => {});
    pushToast(
      'Antecipação D+1 Solicitada!',
      'Repasse líquido (90% Split PetHub Pay) agendado para depósito via Pix amanhã às 09h.'
    );
  };

  return (
    <PetHubContext.Provider
      value={{
        role,
        setRole,
        tutorTab,
        setTutorTab,
        isAuthenticated,
        setIsAuthenticated,
        showAuthModal,
        setShowAuthModal,
        quickDemoLogin,
        supabaseStatus,
        refreshFromSupabase,
        userAddress,
        setUserAddress,
        pets,
        activePetId,
        setActivePetId,
        activePet,
        addPet,
        cashbackBalance,
        clubPoints,
        stores,
        products,
        toggleProductPause,
        selectedStoreId,
        setSelectedStoreId,
        cartItems,
        cartGrooming,
        addToCart,
        removeFromCart,
        updateCartQty,
        setCartGrooming,
        clearCart,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeHybridOrder,
        orders,
        acceptOrder,
        rejectOrder,
        advanceProductStep,
        advanceGroomingStep,
        updateTriageChecklist,
        triggerCrossSell,
        respondCrossSell,
        submitOrderReview,
        baySlots,
        registerBayNoShow,
        flashTimerSeconds,
        anticipatedD1,
        requestD1Anticipation,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      {children}
    </PetHubContext.Provider>
  );
};

export const usePetHub = () => {
  const ctx = useContext(PetHubContext);
  if (!ctx) throw new Error('usePetHub must be used within PetHubProvider');
  return ctx;
};
