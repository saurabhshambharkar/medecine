import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronRight, Clock, Truck, ShieldCheck, Star, AlertCircle } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { showToast } from '../components/UI/Toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Update page title
        if (productData) {
          document.title = `${productData.name} | MediQuick`;
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
    
    // Reset title when unmounting
    return () => {
      document.title = 'MediQuick';
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.requiresPrescription) {
      showToast('This medicine requires a prescription. Please upload one in your profile.', 'info');
      return;
    }
    
    if (!product.inStock) {
      showToast('Sorry, this product is out of stock.', 'error');
      return;
    }
    
    addToCart(product, quantity);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToWishlist = () => {
    showToast('Added to wishlist!', 'success');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle size={48} className="mx-auto text-error-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <Link to="/medicines" className="btn btn-primary">
          Back to Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/medicines" className="hover:text-primary-600">Medicines</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700">{product.name}</span>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.brand}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={`${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                {product.discountPrice ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">
                      {formatCurrency(product.discountPrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="ml-2 bg-accent-100 text-accent-800 text-xs font-medium px-2 py-1 rounded">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              
              {/* Availability */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="text-success-600 flex items-center">
                    <CheckCircle size={18} className="mr-2" />
                    In Stock
                  </div>
                ) : (
                  <div className="text-error-600 flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    Out of Stock
                  </div>
                )}
                
                {product.requiresPrescription && (
                  <div className="text-primary-600 flex items-center mt-2">
                    <AlertCircle size={18} className="mr-2" />
                    Requires Prescription
                  </div>
                )}
              </div>
              
              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              {/* Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Quantity */}
                <div className="flex items-center border rounded w-full sm:w-auto">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`btn flex items-center justify-center w-full sm:w-auto ${
                    !product.inStock || product.requiresPrescription
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {product.requiresPrescription
                    ? 'Upload Prescription'
                    : 'Add to Cart'
                  }
                </button>
                
                {/* Wishlist */}
                <button
                  onClick={handleAddToWishlist}
                  className="btn btn-secondary flex items-center justify-center w-full sm:w-auto"
                >
                  <Heart size={18} className="mr-2" />
                  Wishlist
                </button>
              </div>
              
              {/* Benefits */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock size={18} className="text-primary-600 mr-2" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck size={18} className="text-primary-600 mr-2" />
                  <span className="text-sm">Genuine Products</span>
                </div>
                <div className="flex items-center">
                  <Truck size={18} className="text-primary-600 mr-2" />
                  <span className="text-sm">Free Shipping on $35+</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-t mt-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 text-sm font-medium focus:outline-none ${
                  activeTab === 'description'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 text-sm font-medium focus:outline-none ${
                  activeTab === 'details'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 text-sm font-medium focus:outline-none ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Product Description</h3>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod magna vel tortor ultrices, 
                    vel fermentum purus tincidunt. Nullam gravida metus eget velit finibus, in volutpat odio commodo. 
                    Suspendisse potenti. Donec vehicula odio vel enim tincidunt, ac faucibus magna ultrices.
                  </p>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Dosage Information</h4>
                      <p className="text-gray-700 mb-4">{product.dosage || 'As prescribed by your doctor.'}</p>
                      
                      <h4 className="font-medium mb-2">Usage Instructions</h4>
                      <p className="text-gray-700 mb-4">{product.usage || 'Follow the directions provided by your healthcare provider.'}</p>
                      
                      <h4 className="font-medium mb-2">Active Ingredients</h4>
                      {product.activeIngredients ? (
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                          {product.activeIngredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 mb-4">Information not available.</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Side Effects</h4>
                      {product.sideEffects ? (
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                          {product.sideEffects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 mb-4">Consult your doctor for information on potential side effects.</p>
                      )}
                      
                      <h4 className="font-medium mb-2">Storage Instructions</h4>
                      <p className="text-gray-700 mb-4">
                        Store in a cool, dry place away from direct sunlight. Keep out of reach of children.
                      </p>
                      
                      <h4 className="font-medium mb-2">Prescription Requirements</h4>
                      <p className="text-gray-700">
                        {product.requiresPrescription 
                          ? 'This medicine requires a valid prescription from a licensed doctor.'
                          : 'This is an over-the-counter medication and does not require a prescription.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <button className="btn btn-secondary text-sm">Write a Review</button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={24} 
                            className={`${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{product.rating} out of 5</span>
                    </div>
                    <p className="text-gray-600">{product.reviewCount} customer ratings</p>
                  </div>
                  
                  {/* Sample reviews */}
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={`${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Very Effective</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">by Sarah J. on May 15, 2025</p>
                      <p className="text-gray-700">
                        This medication worked perfectly for me. The effect was noticeable within a few hours and 
                        I experienced minimal side effects. Would definitely recommend.
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={`${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Good Product</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">by Michael T. on April 28, 2025</p>
                      <p className="text-gray-700">
                        Works as described. Delivery was prompt and packaging was secure. The only reason I didn't 
                        give it 5 stars is because it took a bit longer than expected to take effect.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={`${i < 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Average</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">by Priya K. on April 10, 2025</p>
                      <p className="text-gray-700">
                        It's an okay product. Helped with my symptoms but I experienced some mild side effects. 
                        The packaging was good and delivery was fast.
                      </p>
                    </div>
                  </div>
                  
                  <button className="mt-6 text-primary-600 hover:text-primary-700">
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="16 12 12 16 8 12"></polyline>
    <line x1="12" y1="8" x2="12" y2="16"></line>
  </svg>
);

export default ProductDetailPage;