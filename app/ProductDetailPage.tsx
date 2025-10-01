"use client"; // Important for using React Hooks in App Router

import React, { useState, useEffect } from 'react';
// REMOVE: No longer importing local product data
// import { products } from '../data/products';
import { Product, Variant } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import StarIcon from '../components/icons/StarIcon';
import HeartIcon from '../components/icons/HeartIcon';
import SpinnerIcon from '../components/icons/SpinnerIcon';
// Use Next.js navigation hooks instead of react-router-dom
import { useParams, useRouter } from 'next/navigation';


const ProductDetailPage: React.FC = () => {
  const params = useParams(); // Get params object from Next.js
  const id = params.id as string; // Extract id as string
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter(); // Use Next.js router for navigation
  // REMOVE: useLocation no longer needed from react-router-dom


  useEffect(() => {
    if (!id) return; // Don't fetch if ID is not available yet

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call your API to get a single product by ID
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found.');
          }
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const foundProduct: Product = await response.json();
        
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0] || ''); // Ensure image exists
        
        // Set default variants
        const defaultVariants: { [key:string]: string } = {};
        foundProduct.variants?.forEach(variant => {
          defaultVariants[variant.type] = variant.options[0].value;
        });
        setSelectedVariants(defaultVariants);

        // --- SEO & Structured Data ---
        document.title = `${foundProduct.name} | The Dress Book`;
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        const descriptionContent = foundProduct.description.length > 160 
          ? `${foundProduct.description.substring(0, 157)}...` 
          : foundProduct.description;
        metaDescription.setAttribute('content', descriptionContent);

        // JSON-LD Structured Data (ensure window is available)
        if (typeof window !== 'undefined') {
            const structuredData = {
                '@context': 'https://schema.org/',
                '@type': 'Product',
                name: foundProduct.name,
                image: foundProduct.images,
                description: foundProduct.description,
                sku: foundProduct.sku,
                brand: {
                    '@type': 'Brand',
                    name: 'The Dress Book'
                },
                offers: {
                    '@type': 'Offer',
                    url: window.location.href,
                    priceCurrency: 'USD',
                    price: foundProduct.price.toFixed(2),
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: foundProduct.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                },
                ...(foundProduct.reviews && foundProduct.reviews.length > 0 && { // Check if reviews exist
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: (foundProduct.rating || 0).toFixed(1), // Handle null rating
                        reviewCount: foundProduct.reviews.length
                    },
                    review: foundProduct.reviews.map(review => ({
                        '@type': 'Review',
                        author: {'@type': 'Person', name: review.author},
                        datePublished: review.date,
                        reviewBody: review.comment,
                        reviewRating: {
                            '@type': 'Rating',
                            ratingValue: review.rating
                        }
                    }))
                })
            };
            
            let script = document.getElementById('product-structured-data') as HTMLScriptElement | null;
            if (!script) {
                script = document.createElement('script');
                script.id = 'product-structured-data';
                document.head.appendChild(script);
            }
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify(structuredData);
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    return () => {
        document.title = 'The Dress Book';
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', "A modern, fully responsive e-commerce website for clothing. It features a clean UI, product listings with filters, a detailed product view, a shopping cart, and a checkout process.");
        }
        const script = document.getElementById('product-structured-data');
        if (script) {
          script.remove();
        }
    };
  }, [id]); // Depend on 'id' from useParams

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants(prev => ({...prev, [type]: value}));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      // Use Next.js router push with query/hash if needed
      router.push(`/login`); // Simplified, adjust if you need state for redirect back
      return;
    }
    
    setIsAdding(true);
    await addItem({ ...product, selectedVariant: selectedVariants }, 1);
    setIsAdding(false);
  };

  if (loading) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">Loading product...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">Product not found.</div>;
  }
  
  const isInWishlist = wishlist.includes(product.id);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {product.images?.map((image, index) => ( // Use optional chaining for images
                  <button
                    key={index} // Using index as key if image URLs might not be unique
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50 ${
                      selectedImage === image ? 'ring-2 ring-accent' : 'ring-1 ring-transparent'
                    }`}
                  >
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <img src={image} alt="" className="w-full h-full object-center object-cover" />
                    </span>
                     {selectedImage === image && <span className="absolute inset-0 ring-2 ring-accent rounded-md pointer-events-none" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full aspect-w-1 aspect-h-1">
              {product.images && product.images.length > 0 && ( // Ensure images exist before rendering
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 flex-shrink-0 ${product.rating && product.rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="sr-only">{/* Product Rating text needs to be added here */}</p>
                {/* ... rest of the component */}
              </div>
            </div>
            {/* ... remaining JSX ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
