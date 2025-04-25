import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CreditCard, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';
import { formatCurrency } from '../utils/format';
import { showToast } from '../components/UI/Toast';

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Calculate shipping cost (free over $35)
  const shippingCost = cartTotal >= 35 ? 0 : 5.99;
  
  // Calculate tax (assume 8%)
  const taxAmount = cartTotal * 0.08;
  
  // Calculate order total
  const orderTotal = cartTotal + shippingCost + taxAmount;
  
  // Check if cart is empty on mount
  useEffect(() => {
    if (cart.length === 0 && currentStep !== 'confirmation') {
      navigate('/cart');
      showToast('Your cart is empty', 'info');
    }
  }, [cart, navigate, currentStep]);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && currentStep !== 'confirmation') {
      navigate('/profile?tab=login');
      showToast('Please sign in to continue with checkout', 'info');
    }
  }, [isAuthenticated, navigate, currentStep]);
  
  // Pre-fill shipping info if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.name,
      }));
    }
  }, [isAuthenticated, user]);
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
    window.scrollTo(0, 0);
  };
  
  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      
      // Convert cart items to order items
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price
      }));
      
      // Create order
      const order = await createOrder(
        user?.id || 'guest',
        orderItems,
        shippingAddress,
        paymentMethod
      );
      
      // Save order ID
      setOrderId(order.id);
      
      // Clear cart
      clearCart();
      
      // Show success message
      showToast('Order placed successfully!', 'success');
      
      // Move to confirmation step
      setCurrentStep('confirmation');
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/cart" className="text-primary-600 hover:text-primary-800 flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Back to Cart
          </Link>
        </div>
        
        {/* Checkout Steps */}
        {currentStep !== 'confirmation' && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
              
              <div className={`flex flex-col items-center ${
                currentStep === 'shipping' ? 'text-primary-600' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep === 'shipping' 
                    ? 'bg-primary-600 text-white' 
                    : currentStep === 'payment' || currentStep === 'review'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep === 'payment' || currentStep === 'review' ? <Check size={16} /> : '1'}
                </div>
                <span className="text-sm font-medium">Shipping</span>
              </div>
              
              <div className={`flex flex-col items-center ${
                currentStep === 'payment' ? 'text-primary-600' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep === 'payment' 
                    ? 'bg-primary-600 text-white' 
                    : currentStep === 'review'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep === 'review' ? <Check size={16} /> : '2'}
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
              
              <div className={`flex flex-col items-center ${
                currentStep === 'review' ? 'text-primary-600' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep === 'review' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium">Review</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>
                
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        required
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.streetAddress}
                        onChange={(e) => setShippingAddress({...shippingAddress, streetAddress: e.target.value})}
                        required
                        className="input"
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                        className="input"
                        placeholder="New York"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        required
                        className="input"
                        placeholder="NY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        required
                        className="input"
                        placeholder="10001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                        required
                        className="input"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        required
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link to="/cart" className="btn btn-secondary">
                      Back to Cart
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6">Payment Method</h2>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'credit-card'}
                          onChange={() => setPaymentMethod('credit-card')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span>Credit Card</span>
                      </label>
                      
                      {paymentMethod === 'credit-card' && (
                        <div className="mt-4 ml-7 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              required
                              className="input"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                required
                                className="input"
                                placeholder="MM/YY"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                required
                                className="input"
                                placeholder="123"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              required
                              className="input"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span>PayPal</span>
                      </label>
                      
                      {paymentMethod === 'paypal' && (
                        <div className="mt-4 ml-7">
                          <p className="text-gray-600 text-sm mb-4">
                            You will be redirected to PayPal to complete your purchase securely.
                          </p>
                          <div className="bg-gray-100 p-3 rounded flex items-center justify-center">
                            <CreditCard size={24} className="text-primary-600 mr-2" />
                            <span className="font-medium">PayPal</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep('shipping')}
                      className="btn btn-secondary"
                    >
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Continue to Review
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6">Review Your Order</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Shipping Information</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.streetAddress}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                      <p>{shippingAddress.country}</p>
                      <p className="mt-1">Phone: {shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded flex items-center">
                      <CreditCard size={20} className="text-primary-600 mr-2" />
                      <span>
                        {paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="divide-y border rounded">
                      {cart.map(item => (
                        <div key={item.product.id} className="p-4 flex">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="ml-4 font-medium">
                            {formatCurrency(
                              (item.product.discountPrice || item.product.price) * item.quantity
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep('payment')}
                    className="btn btn-secondary"
                  >
                    Back to Payment
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="btn btn-primary"
                  >
                    {isPlacingOrder ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Confirmation Step */}
            {currentStep === 'confirmation' && orderId && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-success-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
                <p className="text-gray-600 mb-6">
                  Your order #{orderId} has been placed successfully.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email to <span className="font-medium">{user?.email}</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to={`/order-tracking/${orderId}`} className="btn btn-primary">
                    Track Your Order
                  </Link>
                  <Link to="/medicines" className="btn btn-secondary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                
                <div className="max-h-64 overflow-y-auto mb-6">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center mb-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="ml-2 text-sm font-medium">
                        {formatCurrency(
                          (item.product.discountPrice || item.product.price) * item.quantity
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;