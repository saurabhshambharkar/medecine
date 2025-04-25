import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import SearchBar from '../components/UI/SearchBar';
import ProductCard from '../components/Product/ProductCard';
import Filters from '../components/UI/Filters';
import { getProducts, getCategories, getBrands, getPriceRange } from '../services/productService';
import { Product } from '../types';

const MedicineCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [isLoading, setIsLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    price: { min: 0, max: 100 },
    prescriptionOnly: false,
    inStock: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Load filters data
        const [allCategories, allBrands, range] = await Promise.all([
          getCategories(),
          getBrands(),
          getPriceRange()
        ]);
        
        setCategories(allCategories);
        setBrands(allBrands);
        setPriceRange(range);
        setActiveFilters(prev => ({
          ...prev,
          price: range
        }));
        
        // Get query params
        const searchQuery = searchParams.get('search') || '';
        const categoryQuery = searchParams.get('category') || '';
        const brandQuery = searchParams.get('brand') || '';
        
        // Set active filters from URL
        if (categoryQuery) {
          setActiveFilters(prev => ({
            ...prev,
            categories: [categoryQuery]
          }));
        }
        
        if (brandQuery) {
          setActiveFilters(prev => ({
            ...prev,
            brands: [brandQuery]
          }));
        }
        
        // Fetch products with filters
        const filters: any = {};
        if (searchQuery) filters.search = searchQuery;
        if (categoryQuery) filters.category = categoryQuery;
        if (brandQuery) filters.brand = brandQuery;
        
        const filteredProducts = await getProducts(filters);
        setProducts(filteredProducts);
        
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    switch (type) {
      case 'categories':
        setActiveFilters(prev => {
          const newCategories = checked
            ? [...prev.categories, value]
            : prev.categories.filter(c => c !== value);
          
          return { ...prev, categories: newCategories };
        });
        break;
        
      case 'brands':
        setActiveFilters(prev => {
          const newBrands = checked
            ? [...prev.brands, value]
            : prev.brands.filter(b => b !== value);
          
          return { ...prev, brands: newBrands };
        });
        break;
        
      case 'minPrice':
        setActiveFilters(prev => ({
          ...prev,
          price: { ...prev.price, min: Number(value) }
        }));
        break;
        
      case 'maxPrice':
        setActiveFilters(prev => ({
          ...prev,
          price: { ...prev.price, max: Number(value) }
        }));
        break;
        
      case 'inStock':
        setActiveFilters(prev => ({
          ...prev,
          inStock: checked
        }));
        break;
        
      case 'prescriptionOnly':
        setActiveFilters(prev => ({
          ...prev,
          prescriptionOnly: checked
        }));
        break;
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    setActiveFilters(prev => ({
      ...prev,
      price: { min, max }
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      price: priceRange,
      prescriptionOnly: false,
      inStock: false
    });
  };

  const applyFilters = async () => {
    setIsLoading(true);
    
    try {
      const filters: any = {};
      
      // Add category filter
      if (activeFilters.categories.length === 1) {
        filters.category = activeFilters.categories[0];
      }
      
      // Add brand filter
      if (activeFilters.brands.length === 1) {
        filters.brand = activeFilters.brands[0];
      }
      
      // Add price range
      if (activeFilters.price.min > priceRange.min) {
        filters.minPrice = activeFilters.price.min;
      }
      
      if (activeFilters.price.max < priceRange.max) {
        filters.maxPrice = activeFilters.price.max;
      }
      
      // Add in stock filter
      if (activeFilters.inStock) {
        filters.inStock = true;
      }
      
      // Add prescription filter
      if (activeFilters.prescriptionOnly) {
        filters.requiresPrescription = true;
      }
      
      // Add search query from URL
      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      // Fetch filtered products
      const filteredProducts = await getProducts(filters);
      setProducts(filteredProducts);
      
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [activeFilters]);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Medicines</h1>
          
          <div className="w-full md:w-auto md:flex-grow md:max-w-xl mx-auto md:mx-0">
            <SearchBar 
              fullWidth 
              onSearch={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap">
          {/* Filters */}
          <Filters
            categories={categories}
            brands={brands}
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            onClearFilters={clearFilters}
            activeFilters={activeFilters}
            priceRange={priceRange}
          />
          
          {/* Product List */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    Showing <span className="font-medium">{products.length}</span> products
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm mr-2">View:</span>
                  <button
                    onClick={() => setIsGridView(true)}
                    className={`p-2 rounded ${
                      isGridView ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setIsGridView(false)}
                    className={`p-2 rounded ${
                      !isGridView ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <SlidersHorizontal size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCatalogPage;