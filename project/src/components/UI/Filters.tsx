import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
}

interface FiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  onFilterChange: (type: string, value: string, checked: boolean) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearFilters: () => void;
  activeFilters: {
    categories: string[];
    brands: string[];
    price: {
      min: number;
      max: number;
    };
    prescriptionOnly: boolean;
    inStock: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  brands,
  onFilterChange,
  onPriceChange,
  onClearFilters,
  activeFilters,
  priceRange,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Number(e.target.value);
    onPriceChange(min, activeFilters.price.max);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value);
    onPriceChange(activeFilters.price.min, max);
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.categories.length > 0 ||
      activeFilters.brands.length > 0 ||
      activeFilters.price.min > priceRange.min ||
      activeFilters.price.max < priceRange.max ||
      activeFilters.prescriptionOnly ||
      activeFilters.inStock
    );
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden my-4">
        <button
          className="btn btn-secondary flex items-center"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Filter size={18} className="mr-2" />
          Filters
          {hasActiveFilters() && (
            <span className="ml-2 bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-gray-500"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mobile-filters">
              {/* Filter content (same as desktop) */}
              <FilterContent
                categories={categories}
                brands={brands}
                onFilterChange={onFilterChange}
                onPriceChange={onPriceChange}
                onClearFilters={onClearFilters}
                activeFilters={activeFilters}
                priceRange={priceRange}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                className="w-full btn btn-primary"
                onClick={() => setMobileSidebarOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters() && (
                <button
                  onClick={onClearFilters}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterContent
              categories={categories}
              brands={brands}
              onFilterChange={onFilterChange}
              onPriceChange={onPriceChange}
              onClearFilters={onClearFilters}
              activeFilters={activeFilters}
              priceRange={priceRange}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FilterContent: React.FC<
  FiltersProps & {
    expandedSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
  }
> = ({
  categories,
  brands,
  onFilterChange,
  activeFilters,
  priceRange,
  expandedSections,
  toggleSection,
}) => {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <button
          className="flex items-center justify-between w-full font-medium mb-2"
          onClick={() => toggleSection('categories')}
        >
          Categories
          {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2 pl-1">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  checked={activeFilters.categories.includes(category.id)}
                  onChange={(e) => onFilterChange('categories', category.id, e.target.checked)}
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div>
        <button
          className="flex items-center justify-between w-full font-medium mb-2"
          onClick={() => toggleSection('brands')}
        >
          Brands
          {expandedSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.brands && (
          <div className="space-y-2 pl-1 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  checked={activeFilters.brands.includes(brand.id)}
                  onChange={(e) => onFilterChange('brands', brand.id, e.target.checked)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          className="flex items-center justify-between w-full font-medium mb-2"
          onClick={() => toggleSection('price')}
        >
          Price Range
          {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-2 pl-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">${activeFilters.price.min}</span>
              <span className="text-sm text-gray-600">${activeFilters.price.max}</span>
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={activeFilters.price.min}
              onChange={(e) => onFilterChange('minPrice', e.target.value, true)}
              className="w-full slider"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={activeFilters.price.max}
              onChange={(e) => onFilterChange('maxPrice', e.target.value, true)}
              className="w-full slider"
            />
            <div className="flex space-x-2 mt-2">
              <input
                type="number"
                min={priceRange.min}
                max={activeFilters.price.max}
                value={activeFilters.price.min}
                onChange={(e) => onFilterChange('minPrice', e.target.value, true)}
                className="w-full input py-1 text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                min={activeFilters.price.min}
                max={priceRange.max}
                value={activeFilters.price.max}
                onChange={(e) => onFilterChange('maxPrice', e.target.value, true)}
                className="w-full input py-1 text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <button
          className="flex items-center justify-between w-full font-medium mb-2"
          onClick={() => toggleSection('availability')}
        >
          Availability
          {expandedSections.availability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.availability && (
          <div className="space-y-2 pl-1">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                checked={activeFilters.inStock}
                onChange={(e) => onFilterChange('inStock', 'true', e.target.checked)}
              />
              In Stock Only
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                checked={activeFilters.prescriptionOnly}
                onChange={(e) => onFilterChange('prescriptionOnly', 'true', e.target.checked)}
              />
              Prescription Medicines
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;