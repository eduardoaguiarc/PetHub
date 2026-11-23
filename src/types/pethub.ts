export type AppRole = 'tutor' | 'merchant' | 'admin';

export type TutorTab = 'inicio' | 'busca' | 'ofertas' | 'pedidos' | 'perfil';

export type PetSize = 'P' | 'M' | 'G';

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  status: 'ok' | 'warning' | 'urgent';
}

export interface PetProfile {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: string;
  weight: string;
  size: PetSize;
  avatar: string;
  badgeText: string;
  badgeStatus: 'ok' | 'warning';
  vaccines: VaccineRecord[];
  dewormingNext: string;
  notes?: string;
}

export type CategoryId =
  | 'banho-tosa'
  | 'racoes'
  | 'farmacia'
  | 'petiscos'
  | 'higiene'
  | 'brinquedos'
  | 'clinicas'
  | 'cupons';

export interface ProductItem {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountTag?: string;
  category: CategoryId;
  image: string;
  stock: number;
  paused: boolean;
  isFlashOffer?: boolean;
  petTarget?: 'dog' | 'cat' | 'all';
}

export interface GroomingServiceOption {
  id: string;
  storeId: string;
  name: string;
  description: string;
  basePriceBySize: Record<PetSize, number>;
  durationMinutes: number;
  includes: string[];
}

export interface GroomingTimeSlot {
  time: string;
  available: boolean;
  blockedLessThan2h?: boolean;
  bayType: 'PM' | 'G';
}

export interface ScheduledGrooming {
  serviceId: string;
  serviceName: string;
  petId: string;
  petName: string;
  petBreed: string;
  size: PetSize;
  date: string;
  time: string;
  price: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export type DeliveryMethod = 'delivery' | 'pickup';

export type ProductDeliveryStep = 1 | 2 | 3 | 4; // 1: Recebido, 2: Em separação, 3: Saiu p/ entrega (ou Pronto p/ retirada), 4: Entregue
export type GroomingLiveStep = 1 | 2 | 3 | 4; // 1: Check-in & Triagem, 2: Banho & Hidratação, 3: Secagem & Tosa/Unhas, 4: Pronto & Cheiroso

export interface CrossSellProposal {
  id: string;
  title: string;
  clinicalNote: string;
  price: number;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export interface ClinicalTriageChecklist {
  skinAndCoatChecked: boolean;
  earsCleaned: boolean;
  parasitesDetected: boolean;
  nailsTrimmed: boolean;
  notes: string;
}

export type OrderStatus = 'pending_sla' | 'accepted' | 'completed' | 'rejected';

export interface HybridOrder {
  id: string;
  code: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerWhatsapp: string;
  customerAddress: string;
  createdAt: string;
  slaRemainingSeconds: number; // 900s = 15:00
  status: OrderStatus;
  rejectionReason?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  grooming?: ScheduledGrooming;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  cashbackUsed: number;
  subtotal: number;
  total: number;
  productStep: ProductDeliveryStep;
  groomingStep: GroomingLiveStep;
  crossSell?: CrossSellProposal;
  triageChecklist: ClinicalTriageChecklist;
  rating?: number;
  reviewComment?: string;
}

export interface BaySlotBooking {
  id: string;
  bayGroup: 'PM' | 'G';
  bayLabel: string;
  time: string;
  petName?: string;
  petBreed?: string;
  tutorName?: string;
  tutorPhone?: string;
  serviceName?: string;
  serviceValue?: number;
  status: 'free' | 'occupied' | 'late_tolerance' | 'no_show_freed';
  minutesLate?: number;
  noShowPenaltyApplied?: number;
}

export interface PartnerStore {
  id: string;
  name: string;
  subtitle: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  etaMinutes: string;
  deliveryFee: number;
  nextBathSlot: string;
  isPro: boolean;
  address: string;
  image: string;
  activeInPilot: boolean;
}
