import { Order, OrderStatus } from '../types';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD12345',
    userId: '123',
    items: [
      { productId: '1', productName: 'Paracetamol 500mg Tablets', quantity: 2, price: 5.99 },
      { productId: '3', productName: 'Cetirizine 10mg Tablets', quantity: 1, price: 6.99 }
    ],
    status: 'delivered',
    createdAt: '2025-05-10T14:30:00Z',
    updatedAt: '2025-05-12T09:15:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Health St',
      city: 'Medical City',
      state: 'Wellness State',
      postalCode: '12345',
      country: 'United States',
      phone: '(555) 123-4567'
    },
    paymentMethod: 'Credit Card',
    totalAmount: 18.97,
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD12346',
    userId: '123',
    items: [
      { productId: '7', productName: 'Vitamin D3 1000IU Softgels', quantity: 1, price: 7.99 },
      { productId: '4', productName: 'Ibuprofen 200mg Tablets', quantity: 1, price: 7.29 }
    ],
    status: 'shipped',
    createdAt: '2025-05-20T10:22:00Z',
    updatedAt: '2025-05-21T12:30:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Health St',
      city: 'Medical City',
      state: 'Wellness State',
      postalCode: '12345',
      country: 'United States',
      phone: '(555) 123-4567'
    },
    paymentMethod: 'PayPal',
    totalAmount: 15.28,
    trackingNumber: 'TRK987654322'
  },
  {
    id: 'ORD12347',
    userId: '123',
    items: [
      { productId: '2', productName: 'Amoxicillin 250mg Capsules', quantity: 1, price: 12.99 }
    ],
    status: 'processing',
    createdAt: '2025-06-01T09:15:00Z',
    updatedAt: '2025-06-01T14:25:00Z',
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Health St',
      city: 'Medical City',
      state: 'Wellness State',
      postalCode: '12345',
      country: 'United States',
      phone: '(555) 123-4567'
    },
    paymentMethod: 'Credit Card',
    totalAmount: 12.99
  }
];

// Get all orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockOrders.filter(order => order.userId === userId);
};

// Get a single order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const order = mockOrders.find(order => order.id === orderId);
  return order || null;
};

// Create a new order
export const createOrder = async (
  userId: string,
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[],
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  },
  paymentMethod: string
): Promise<Order> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate total
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create new order
  const newOrder: Order = {
    id: `ORD${Math.floor(10000 + Math.random() * 90000)}`,
    userId,
    items,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shippingAddress,
    paymentMethod,
    totalAmount
  };
  
  // In a real app, you'd save this to the database
  // mockOrders.push(newOrder);
  
  return newOrder;
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus
): Promise<Order | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return null;
  
  const updatedOrder = {
    ...mockOrders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  // In a real app, you'd update this in the database
  // mockOrders[orderIndex] = updatedOrder;
  
  return updatedOrder;
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return false;
  
  // Can only cancel if not shipped or delivered
  if (['shipped', 'delivered'].includes(mockOrders[orderIndex].status)) {
    return false;
  }
  
  // In a real app, you'd update this in the database
  // mockOrders[orderIndex].status = 'cancelled';
  // mockOrders[orderIndex].updatedAt = new Date().toISOString();
  
  return true;
};