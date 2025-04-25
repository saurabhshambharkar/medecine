import React from 'react';
import { Check, Truck, Package, ShoppingBag, Clock, X } from 'lucide-react';
import { Order, OrderStatus as OrderStatusType } from '../../types';
import { formatDate } from '../../utils/format';

interface OrderStatusProps {
  order: Order;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const steps = [
    { status: 'pending', label: 'Order Placed', icon: ShoppingBag, date: order.createdAt },
    { status: 'confirmed', label: 'Order Confirmed', icon: Check },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Check },
  ];

  // Calculate the current step index
  const getCurrentStepIndex = () => {
    if (order.status === 'cancelled') return -1;
    
    const statusIndex = steps.findIndex(step => step.status === order.status);
    return statusIndex === -1 ? 0 : statusIndex;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Order Status</h3>
      
      {order.status === 'cancelled' ? (
        <div className="flex items-center justify-center py-6 text-error-600">
          <div className="bg-error-100 rounded-full p-3 mr-3">
            <X size={24} />
          </div>
          <div>
            <p className="font-medium">Order Cancelled</p>
            <p className="text-sm text-gray-500">
              {formatDate(order.updatedAt)}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="hidden sm:block w-full bg-gray-200 h-0.5 absolute top-6 left-0 right-0 z-0"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div 
                  key={step.status} 
                  className={`flex flex-row sm:flex-col items-center sm:items-center mb-4 sm:mb-0 ${
                    isCurrent ? 'animate-pulse' : ''
                  }`}
                >
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <step.icon size={20} />
                  </div>
                  <div className="ml-3 sm:ml-0 sm:mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary-600 sm:mt-1">
                        {index === 0 ? formatDate(step.date || '') : 'In Progress'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-6 border-t pt-4">
        <h4 className="font-medium mb-2">Shipping Details</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Delivery Address:</span>{' '}
            {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          {order.trackingNumber && (
            <p>
              <span className="font-medium">Tracking Number:</span>{' '}
              {order.trackingNumber}
            </p>
          )}
          <p>
            <span className="font-medium">Estimated Delivery:</span>{' '}
            {order.status === 'shipped' ? '2-3 business days' : 'To be determined'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-secondary">
          Contact Support
        </button>
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <button className="btn btn-secondary text-error-600 border-error-600 hover:bg-error-50">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;