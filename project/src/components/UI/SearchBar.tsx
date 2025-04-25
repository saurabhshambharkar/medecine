import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { searchProducts } from '../../services/productService';
import { Product } from '../../types';

interface SearchBarProps {
  fullWidth?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ fullWidth = false, onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      searchProducts(debouncedQuery)
        .then((data) => {
          setResults(data);
          setIsDropdownOpen(true);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/medicines?search=${encodeURIComponent(query)}`);
      }
      setIsDropdownOpen(false);
    }
  };

  const handleItemClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsDropdownOpen(false);
    setQuery('');
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'max-w-md'}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for medicines, brands..."
          className="input pr-12"
          aria-label="Search for medicines"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 mr-1"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            className="text-gray-600 hover:text-primary-600"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* Search results dropdown */}
      {isDropdownOpen && (
        <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li
                  key={product.id}
                  className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleItemClick(product.id)}
                >
                  <div className="flex items-center p-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                  </div>
                </li>
              ))}
              <li className="p-2 text-center">
                <button
                  onClick={handleSearch}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  View all results
                </button>
              </li>
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;