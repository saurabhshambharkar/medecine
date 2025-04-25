export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  requiresPrescription: boolean;
  inStock: boolean;
  dosage?: string;
  sideEffects?: string[];
  usage?: string;
  activeIngredients?: string[];
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  paymentMethod: string;
  totalAmount: number;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Prescription {
  id: string;
  userId: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
  expiresAt?: string;
}