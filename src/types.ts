export type ScreenView =
  | 'welcome'
  | 'create-account'
  | 'home'
  | 'menu'
  | 'food-details'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'orders'
  | 'infaq'
  | 'infaq-confirmation'
  | 'profile';

export type DishCategory =
  | 'all'
  | 'signature-rice'
  | 'premium-specials'
  | 'chicken'
  | 'lamb'
  | 'catering'
  | 'infaq';

export interface PortionOption {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
  isDefault?: boolean;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
}

export interface IncludedComponent {
  icon: string;
  title: string;
  description: string;
}

export interface Dish {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  story?: string;
  price: number; // base price
  image: string;
  categories: DishCategory[];
  rating: number;
  reviewCount: number;
  badge?: string;
  availabilityTag: string;
  inStock: boolean;
  isLimited?: boolean;
  prepTimeMinutes?: number;
  portionOptions: PortionOption[];
  addonOptions: AddonOption[];
  includedComponents: IncludedComponent[];
  infaqSponsorshipOption?: {
    available: boolean;
    price: number;
    description: string;
  };
  allergensNotice?: string;
}

export interface CartItem {
  id: string;
  dishId: string;
  dishName: string;
  dishImage: string;
  selectedPortion: PortionOption;
  selectedAddons: AddonOption[];
  specialInstructions?: string;
  infaqPledgeSponsorship?: boolean;
  infaqPrice?: number;
  quantity: number;
  unitPrice: number;
  itemSubtotal: number;
}

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Preparing in Kitchen'
  | 'Ready for Collection'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type PaymentMethodType = 'paynow' | 'card';

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  timestamp: number;
  status: OrderStatus;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending Verification';
  paymentMethod: PaymentMethodType;
  paymentRef?: string;
  fulfillmentType: 'delivery' | 'pickup';
  dispatchDate: string;
  dispatchTimeSlot: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  driverNotes?: string;
  items: CartItem[];
  foodSubtotal: number;
  infaqSubtotal: number;
  deliveryFee: number;
  packagingFee: number;
  discountAmount: number;
  promoCode?: string;
  gstAmount: number;
  totalPayable: number;
}

export interface MosqueCampaign {
  id: string;
  name: string;
  address: string;
  currentSponsoredMeals: number;
  targetMeals: number;
  statusText: string;
  activeThisWeek: boolean;
  menuName: string;
  menuDetails: string;
  imageUrl: string;
  nextRotationNotice?: string;
  isLocked?: boolean;
}

export interface InfaqPackage {
  id: string;
  title: string;
  mealsCount: number;
  price: number;
  description: string;
  isPopular?: boolean;
}

export interface InfaqPledge {
  id: string;
  refCode: string;
  date: string;
  timestamp: number;
  mosqueName: string;
  mealsCount: number;
  totalAmount: number;
  donorName: string;
  isAnonymous: boolean;
  donorPhone: string;
  doaDedication?: string;
  sendWhatsAppProof: boolean;
  status: 'Pledged (Verified)' | 'Distributed with Mosque' | 'Completed';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberTier: string;
  memberLevel: number;
  totalOrders: number;
  totalInfaqMeals: number;
  avatarUrl: string;
  isDemoUser: boolean;
}

export interface RegisteredAccount {
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  createdAt: number;
}

export interface FirestoreOrderItem {
  foodId: string;
  foodName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  portionName?: string;
}

export interface FirestoreOrderDoc {
  id?: string;
  userId: string;
  orderId: string;
  items: FirestoreOrderItem[];
  customerName: string;
  customerPhone: string;
  fulfilmentMethod: string;
  deliveryAddress?: string;
  orderDate?: string;
  orderTime?: string;
  specialInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  gst: number;
  totalAmount: number;
  status: string;
  createdAt: any;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  bookingDate: string;
  bookingTime: string;
  serviceAddress: string;
  specialInstructions?: string;
  serviceFee: number;
  platformFee: number;
  gst: number;
  totalAmount: number;
  status: string;
  createdAt: any;
}

