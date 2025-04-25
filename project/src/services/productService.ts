import { Product, Category } from '../types';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg Tablets',
    brand: 'MediRelief',
    description: 'Effective pain relief for headaches, toothaches, and fever.',
    price: 5.99,
    image: 'https://images.pexels.com/photos/139398/himalayas-mountains-nepal-tibet-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'pain-relief',
    requiresPrescription: false,
    inStock: true,
    dosage: '500mg',
    sideEffects: ['Nausea', 'Stomach pain', 'Rash'],
    usage: 'Take 1-2 tablets every 4-6 hours as needed, with or without food.',
    activeIngredients: ['Paracetamol (Acetaminophen)'],
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg Capsules',
    brand: 'AntiCure',
    description: 'Antibiotic used to treat a range of bacterial infections.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'antibiotics',
    requiresPrescription: true,
    inStock: true,
    dosage: '250mg',
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash'],
    usage: 'Take as directed by your doctor, usually every 8 hours with or without food.',
    activeIngredients: ['Amoxicillin'],
    rating: 4.2,
    reviewCount: 87
  },
  {
    id: '3',
    name: 'Cetirizine 10mg Tablets',
    brand: 'AllerFree',
    description: 'Non-drowsy antihistamine for allergy relief.',
    price: 8.49,
    discountPrice: 6.99,
    image: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'allergy-relief',
    requiresPrescription: false,
    inStock: true,
    dosage: '10mg',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    usage: 'Take one tablet daily with water.',
    activeIngredients: ['Cetirizine Hydrochloride'],
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: '4',
    name: 'Ibuprofen 200mg Tablets',
    brand: 'PainEase',
    description: 'Anti-inflammatory medication for pain and fever relief.',
    price: 7.29,
    image: 'https://images.pexels.com/photos/1853926/pexels-photo-1853926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'pain-relief',
    requiresPrescription: false,
    inStock: true,
    dosage: '200mg',
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
    usage: 'Take 1-2 tablets every 4-6 hours after food. Do not exceed 6 tablets in 24 hours.',
    activeIngredients: ['Ibuprofen'],
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: '5',
    name: 'Lisinopril 10mg Tablets',
    brand: 'CardioHealth',
    description: 'ACE inhibitor used to treat high blood pressure and heart failure.',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1424246/pexels-photo-1424246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'cardiovascular',
    requiresPrescription: true,
    inStock: true,
    dosage: '10mg',
    sideEffects: ['Dizziness', 'Cough', 'Headache'],
    usage: 'Take one tablet daily at the same time each day.',
    activeIngredients: ['Lisinopril'],
    rating: 4.3,
    reviewCount: 112
  },
  {
    id: '6',
    name: 'Salbutamol Inhaler 100mcg',
    brand: 'BreathWell',
    description: 'Relieves symptoms of asthma and chronic obstructive pulmonary disease (COPD).',
    price: 22.99,
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'respiratory',
    requiresPrescription: true,
    inStock: false,
    dosage: '100mcg per puff',
    sideEffects: ['Tremor', 'Headache', 'Rapid heart rate'],
    usage: 'Inhale 1-2 puffs as needed for symptom relief, up to 4 times daily.',
    activeIngredients: ['Salbutamol Sulfate'],
    rating: 4.8,
    reviewCount: 178
  },
  {
    id: '7',
    name: 'Vitamin D3 1000IU Softgels',
    brand: 'VitaHealth',
    description: 'Supports bone health, immune function, and overall well-being.',
    price: 9.99,
    discountPrice: 7.99,
    image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'vitamins-supplements',
    requiresPrescription: false,
    inStock: true,
    dosage: '1000IU',
    sideEffects: ['None reported at recommended dosage'],
    usage: 'Take one softgel daily with a meal.',
    activeIngredients: ['Cholecalciferol (Vitamin D3)'],
    rating: 4.6,
    reviewCount: 241
  },
  {
    id: '8',
    name: 'Metformin 500mg Tablets',
    brand: 'GlucoControl',
    description: 'Oral medication to manage type 2 diabetes.',
    price: 11.49,
    image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'diabetes',
    requiresPrescription: true,
    inStock: true,
    dosage: '500mg',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach discomfort'],
    usage: 'Take with meals as prescribed by your doctor.',
    activeIngredients: ['Metformin Hydrochloride'],
    rating: 4.1,
    reviewCount: 95
  }
];

// Mock categories
const mockCategories: Category[] = [
  { id: 'pain-relief', name: 'Pain Relief', icon: 'pill' },
  { id: 'antibiotics', name: 'Antibiotics', icon: 'pill' },
  { id: 'allergy-relief', name: 'Allergy Relief', icon: 'pill' },
  { id: 'cardiovascular', name: 'Heart & Cardiovascular', icon: 'heart' },
  { id: 'respiratory', name: 'Respiratory Care', icon: 'lung' },
  { id: 'vitamins-supplements', name: 'Vitamins & Supplements', icon: 'pill' },
  { id: 'diabetes', name: 'Diabetes Care', icon: 'pill' }
];

// Mock brands
const mockBrands = [
  { id: 'medirelief', name: 'MediRelief' },
  { id: 'anticure', name: 'AntiCure' },
  { id: 'allerfree', name: 'AllerFree' },
  { id: 'painease', name: 'PainEase' },
  { id: 'cardiohealth', name: 'CardioHealth' },
  { id: 'breathwell', name: 'BreathWell' },
  { id: 'vitahealth', name: 'VitaHealth' },
  { id: 'glucocontrol', name: 'GlucoControl' }
];

// Get all products with optional filtering
export const getProducts = async (filters?: {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  requiresPrescription?: boolean;
}): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredProducts = [...mockProducts];
  
  if (filters) {
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase() === filters.brand?.toLowerCase());
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) || 
        product.brand.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.discountPrice || product.price;
        return price >= filters.minPrice!;
      });
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.discountPrice || product.price;
        return price <= filters.maxPrice!;
      });
    }
    
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.inStock === filters.inStock);
    }
    
    if (filters.requiresPrescription !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.requiresPrescription === filters.requiresPrescription);
    }
  }
  
  return filteredProducts;
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = mockProducts.find(p => p.id === id);
  return product || null;
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query) return [];
  
  const queryLower = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(queryLower) || 
    product.brand.toLowerCase().includes(queryLower)
  ).slice(0, 5); // Return only top 5 results for the dropdown
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockCategories;
};

// Get all brands
export const getBrands = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockBrands;
};

// Get price range (min and max)
export const getPriceRange = async (): Promise<{ min: number; max: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const prices = mockProducts.map(p => p.discountPrice || p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};