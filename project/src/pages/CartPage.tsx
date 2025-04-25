import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ChevronLeft, Plus, Minus, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/format';
import { showToast } from '../components/UI/Toast';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  
  // Calculate shipping cost (free over $35)
  const shippingCost = cartTotal >= 35 ? 0 : 5.99;
  
  // Calculate tax (assume 8%)
  const taxAmount = cartTotal * 0.08;
  
  // Calculate order total
  const orderTotal = cartTotal + shippingCost + taxAmount;
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    showToast('Item removed from cart', 'info');
  };
  
  const handleProceedToCheckout = () => {
    // Check if cart has prescription items without valid prescription
    const prescriptionItems = cart.filter(item => item.product.requiresPrescription);
    
    if (prescriptionItems.length > 0) {
      showToast('Your cart contains prescription medicines. Please upload a valid prescription before checkout.', 'info');
      navigate('/profile?tab=prescriptions');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <Link to="/medicines" className="text-primary-600 hover:text-primary-800 flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any medicines to your cart yet.
            </p>
            <Link to="/medicines" className="btn btn-primary">
              Browse Medicines
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Cart Items ({cart.length})</h2>
                  
                  <div className="divide-y">
                    {cart.map(item => (
                      <div key={item.product.id} className="py-4 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 sm:w-24 sm:h-24 mb-4 sm:mb-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="sm:ml-6 flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium">{item.product.name}</h3>
                              <p className="text-sm text-gray-600">{item.product.brand}</p>
                              {item.product.requiresPrescription && (
                                <div className="flex items-center mt-1 text-primary-600 text-xs">
                                  <AlertCircle size={14} className="mr-1" />
                                  Requires prescription
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(
                                  (item.product.discountPrice || item.product.price) * item.quantity
                                )}
                              </div>
                              {item.product.discountPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  {formatCurrency(item.product.price * item.quantity)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center border rounded">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                                disabled={item.quantity >= 10}
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-gray-500 hover:text-error-600"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                  
                  {cartTotal < 35 && (
                    <div className="text-sm text-primary-600 mt-2">
                      Add {formatCurrency(35 - cartTotal)} more to get free shipping!
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                  
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full btn btn-primary mt-6"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">We Accept</h3>
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;