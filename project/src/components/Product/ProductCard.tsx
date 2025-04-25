import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/format';
import { showToast } from '../UI/Toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.requiresPrescription) {
      showToast('This medicine requires a prescription. Please upload one in your profile.', 'info');
      return;
    }
    
    if (!product.inStock) {
      showToast('Sorry, this product is out of stock.', 'error');
      return;
    }
    
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast('Added to wishlist!', 'success');
  };
  
  return (
    <div className="group card h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discountPrice && (
              <span className="badge badge-discount animate-pulse">
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </span>
            )}
            
            {product.requiresPrescription && (
              <span className="badge badge-prescription">
                Prescription
              </span>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full shadow-md hover:bg-primary-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={18} className="text-primary-600" />
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          
          {/* Ratings */}
          <div className="flex items-center mt-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          
          {/* Availability */}
          <div className="mt-auto pt-2">
            {!product.inStock ? (
              <div className="text-error-600 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                Out of stock
              </div>
            ) : product.requiresPrescription ? (
              <div className="text-primary-600 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                Requires prescription
              </div>
            ) : null}
          </div>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="font-bold text-gray-900">{formatCurrency(product.discountPrice)}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(product.price)}</span>
                </div>
              ) : (
                <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`rounded-full p-2 transition-colors ${
                !product.inStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;