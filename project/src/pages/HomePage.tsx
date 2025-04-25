import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Pill, Stethoscope, UserPlus, ChevronRight, Clock, Package, ShieldCheck } from 'lucide-react';
import SearchBar from '../components/UI/SearchBar';
import CategoryCard from '../components/UI/CategoryCard';
import ProductCard from '../components/Product/ProductCard';
import { getProducts, getCategories } from '../services/productService';
import { Product, Category } from '../types';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [discountProducts, setDiscountProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getProducts();
        const allCategories = await getCategories();
        
        // Get products with discounts
        const discounted = allProducts.filter(product => product.discountPrice !== undefined);
        
        // Get other featured products (not discounted)
        const featured = allProducts
          .filter(product => !product.discountPrice && product.inStock)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        
        setFeaturedProducts(featured);
        setDiscountProducts(discounted);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Map category IDs to Lucide icons
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'pain-relief':
        return <Pill size={24} />;
      case 'cardiovascular':
        return <Heart size={24} />;
      case 'respiratory':
        return <Stethoscope size={24} />;
      default:
        return <Pill size={24} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold mb-4">
                Your Health, Delivered
              </h1>
              <p className="text-lg mb-8">
                Get medicines delivered to your doorstep with just a few clicks. Trusted, 
                convenient, and secure online pharmacy service.
              </p>
              <div className="mb-8">
                <SearchBar fullWidth />
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/medicines" className="btn bg-white text-primary-700 hover:bg-gray-100">
                  Browse Medicines
                </Link>
                <Link to="/profile?tab=prescriptions" className="btn bg-primary-700 text-white hover:bg-primary-800">
                  Upload Prescription
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Pharmacy Hero" 
                className="rounded-lg shadow-lg max-h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Clock size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quick Delivery</h3>
                <p className="text-gray-600 text-sm">Get your medicines delivered within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <ShieldCheck size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Genuine Products</h3>
                <p className="text-gray-600 text-sm">All medicines are sourced from authorized distributors</p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Package size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure Packaging</h3>
                <p className="text-gray-600 text-sm">Temperature-controlled packaging for sensitive medications</p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <UserPlus size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Expert Pharmacists</h3>
                <p className="text-gray-600 text-sm">Get advice from licensed pharmacists for your medications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Shop by Category</h2>
            <Link to="/medicines" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-32"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map(category => (
                <CategoryCard
                  key={category.id}
                  icon={getCategoryIcon(category.id)}
                  name={category.name}
                  path={`/medicines?category=${category.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <Link to="/medicines" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals Section */}
      {discountProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-primary-50 rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-primary-800">Special Offers</h2>
                <Link to="/medicines?discount=true" className="text-primary-600 hover:text-primary-700 flex items-center">
                  View All Deals <ChevronRight size={16} />
                </Link>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {discountProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Prescription Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Upload Your Prescription</h2>
              <p className="mb-6">
                Get your prescribed medications delivered to your doorstep. Simply upload your prescription and we'll take care of the rest.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <Check size={16} className="text-primary-600" />
                  </div>
                  Secure prescription handling
                </li>
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <Check size={16} className="text-primary-600" />
                  </div>
                  Verification by licensed pharmacists
                </li>
                <li className="flex items-center">
                  <div className="bg-white rounded-full p-1 mr-3">
                    <Check size={16} className="text-primary-600" />
                  </div>
                  Discreet packaging and delivery
                </li>
              </ul>
              <Link to="/profile?tab=prescriptions" className="btn bg-white text-primary-700 hover:bg-gray-100">
                Upload Now
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Upload Prescription" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Check: React.FC<{ size: number; className: string }> = ({ size, className }) => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default HomePage;