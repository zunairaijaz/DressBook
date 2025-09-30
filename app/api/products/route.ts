import { NextRequest, NextResponse } from 'next/server';
import { products as allProducts } from '../../../data/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const brands = searchParams.getAll('brand');
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const availability = searchParams.get('availability');
  const sortBy = searchParams.get('sort') || 'featured';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12;

  // 1. Filtering
  let filtered = allProducts.filter(product => {
    const queryMatch = query ? product.name.toLowerCase().includes(query.toLowerCase()) : true;
    const categoryMatch = category === 'All' || product.category === category;
    const brandMatch = brands.length === 0 || brands.includes(product.brand);
    const minPriceMatch = minPrice ? product.price >= minPrice : true;
    const maxPriceMatch = maxPrice ? product.price <= maxPrice : true;
    const ratingMatch = rating ? product.rating >= rating : true;
    const availabilityMatch = availability === 'true' ? true : product.stock > 0;

    return queryMatch && categoryMatch && brandMatch && minPriceMatch && maxPriceMatch && ratingMatch && availabilityMatch;
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

  return NextResponse.json({
    products: paginatedProducts,
    totalPages,
    totalCount,
  });
}
