
import { Product } from '../types';
import { products as allProducts } from '../data/products';

const SIMULATED_DELAY = 300; // ms

interface GetProductsParams {
  query?: string;
  category?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
  gender?: string[];
  material?: string[];
  pattern?: string[];
}

interface GetProductsResponse {
  products: Product[];
  totalPages: number;
  totalCount: number;
}

/**
 * Simulates calling a /api/products endpoint with filtering, sorting, and pagination.
 */
export const getProductsAPI = (params: GetProductsParams): Promise<GetProductsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        query = '',
        category = 'All',
        brands = [],
        minPrice,
        maxPrice,
        rating,
        availability = true,
        sortBy = 'featured',
        page = 1,
        limit = 12,
        gender = [],
        material = [],
        pattern = [],
      } = params;

      // 1. Filtering
      let filtered = allProducts.filter(product => {
        const queryMatch = query ? product.name.toLowerCase().includes(query.toLowerCase()) : true;
        const categoryMatch = category === 'All' || product.category === category;
        const brandMatch = brands.length === 0 || brands.includes(product.brand);
        const minPriceMatch = minPrice ? product.price >= minPrice : true;
        const maxPriceMatch = maxPrice ? product.price <= maxPrice : true;
        const ratingMatch = rating ? product.rating >= rating : true;
        const availabilityMatch = availability === false ? product.stock > 0 : true;
        
        const genderMatch = gender.length === 0 || (product.gender && gender.includes(product.gender));
        const materialMatch = material.length === 0 || (product.material && material.includes(product.material));
        const patternMatch = pattern.length === 0 || (product.pattern && pattern.includes(product.pattern));

        // Only show active products on the storefront
        const statusMatch = product.status === 'Active';

        return statusMatch && queryMatch && categoryMatch && brandMatch && minPriceMatch && maxPriceMatch && ratingMatch && availabilityMatch && genderMatch && materialMatch && patternMatch;
      });

      // 2. Sorting
      switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest-desc':
          filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
          break;
        default: // 'featured'
          break;
      }
      
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / limit);

      // 3. Pagination
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

      resolve({
        products: paginatedProducts,
        totalPages,
        totalCount,
      });

    }, SIMULATED_DELAY);
  });
};
