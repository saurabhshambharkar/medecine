import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ChevronLeft } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { Order } from '../types';
import OrderStatus from '../components/OrderTracking/OrderStatus';
import { formatCurrency, formatDateWithTime } from '../utils/format';

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        
        // Update page title
        document.title = `Order #${orderId} | MediQuick`;
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
    
    // Reset title when unmounting
    return () => {
      document.title = 'MediQuick';
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package size={48} className="mx-auto text-error-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the order you're looking for.</p>
        <Link to="/profile?tab=orders" className="btn btn-primary">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/profile?tab=orders" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ChevronLeft size={16} className="mr-1" />
            Back to Orders
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <OrderStatus order={order} />
            
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Order Date:</span>
                  <span>{formatDateWithTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tracking Number:</span>
                    <span>{order.trackingNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Shipping Address</h4>
                <address className="not-italic text-gray-600">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.streetAddress}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                </address>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalAmount - 5.99)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(5.99)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-4">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link to="/profile?tab=orders" className="btn btn-primary w-full">
                  Back to My Orders
                </Link>
                <button className="btn btn-secondary w-full">
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;