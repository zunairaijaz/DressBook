"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';
import QuickViewModal from '../../components/QuickViewModal';
import SideFilter from '../../components/SideFilter';
import Pagination from '../../components/Pagination';
import AdjustmentsHorizontalIcon from '../../components/icons/AdjustmentsHorizontalIcon';
import XMarkIcon from '../../components/icons/XMarkIcon';
import Squares2x2Icon from '../../components/icons/Squares2x2Icon';
import ListBulletIcon from '../../components/icons/ListBulletIcon';

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
  { name: 'Featured', value: 'featured' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Customer Rating', value: 'rating-desc' }, 
  { name: 'Newest', value: 'newest' }, 
];


function SearchPageComponent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);

  const view = searchParams.get('view') || 'grid';
  const currentPage = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'featured';

 const fetchProducts = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(PRODUCTS_PER_PAGE));

    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      // API returns raw array
      setProducts(data);
      setTotalPages(1);
      setTotalCount(data.length);
    } else {
      // API returns { products, totalPages, totalCount }
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    }
  } catch (err) {
    setError('Failed to fetch products. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
    window.scrollTo(0, 0);
  }
}, [searchParams]);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const createURLWithParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);
    if (key === 'sort') {
      newParams.set('page', '1');
    }
    return `/search?${newParams.toString()}`;
  };

  const startItem = Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, totalCount);
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, totalCount);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {query ? `Results for "${query}"` : category === 'All' ? 'All Products' : category}
          </h1>
        </div>

        <div className="pb-24 flex">
          <aside className="hidden lg:block lg:w-1/4 lg:pr-8">
            <SideFilter />
          </aside>

           <div 
             className={`fixed inset-0 z-40 flex lg:hidden transition-opacity ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
             role="dialog" 
             aria-modal="true"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={() => setFilterOpen(false)}></div>
              <div className={`relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transform transition-transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button type="button" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400" onClick={() => setFilterOpen(false)}>
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4 px-4">
                    <SideFilter />
                </div>
              </div>
            </div>

          <main className="lg:w-3/4 w-full">
             <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
                 <p className="text-sm text-gray-500">
                    {!loading && (totalCount > 0 ? `Showing ${startItem}–${endItem} of ${totalCount} results` : '0 results')}
                 </p>

                <div className="flex items-center">
                  <div className="relative inline-block text-left">
                    <div className="flex items-center">
                        <select 
                          id="sort-by" 
                          value={sortBy} 
                          onChange={(e) => window.location.href = createURLWithParam('sort', e.target.value)}
                          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                        >
                          {sortOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.name}</option>
                          ))}
                      </select>
                      <div className="hidden sm:flex items-center ml-4">
                          <a href={createURLWithParam('view', 'grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Grid view">
                              <Squares2x2Icon className="w-5 h-5" />
                          </a>
                          <a href={createURLWithParam('view', 'list')} className={`p-2 ml-1 rounded-md ${view === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="List view">
                              <ListBulletIcon className="w-5 h-5" />
                          </a>
                      </div>
                    </div>
                  </div>

                  <button type="button" className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden" onClick={() => setFilterOpen(true)}>
                    <span className="sr-only">Filters</span>
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
            {loading ? (
                <p className="col-span-full text-center text-gray-500 py-10">Loading products...</p>
            ) : error ? (
                <p className="col-span-full text-center text-red-500 py-10">{error}</p>
            ) : (
                <div className={`pt-6 ${view === 'grid' ? 'grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-y-6'}`}>
             {Array.isArray(products) && products.length > 0 ? (
  products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      onQuickView={handleOpenQuickView}
      view={view as 'grid' | 'list'}
    />
  ))
) : (
  <p className="col-span-full text-center text-gray-500 py-10">
    No products match your criteria. Try adjusting your filters.
  </p>
)}

                </div>
            )}


            {totalPages > 1 && !loading && (
                <div className="mt-12">
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </div>
            )}
          </main>
        </div>
      </div>
      <QuickViewModal product={quickViewProduct} onClose={handleCloseQuickView} />
    </div>
  );
}

// Wrap the component in Suspense because useSearchParams must be used in a client component wrapped in Suspense
export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageComponent />
        </Suspense>
    );
}
