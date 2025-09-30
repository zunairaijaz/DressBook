

import React, { useState, useEffect } from 'react';
// FIX: Using namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { products } from '../data/products';
import { Product, Variant } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import StarIcon from '../components/icons/StarIcon';
import HeartIcon from '../components/icons/HeartIcon';
import SpinnerIcon from '../components/icons/SpinnerIcon';

const { useParams, useNavigate, useLocation } = ReactRouterDOM;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.images[0]);
      // Set default variants
      const defaultVariants: { [key:string]: string } = {};
      foundProduct.variants?.forEach(variant => {
        defaultVariants[variant.type] = variant.options[0].value;
      });
      setSelectedVariants(defaultVariants);

      // --- SEO & Structured Data ---
      document.title = `${foundProduct.name} | The Dress Book`;
      
      // Meta Description
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

      // JSON-LD Structured Data
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
        ...(foundProduct.reviews.length > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: foundProduct.rating.toFixed(1),
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
  }, [id]);

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants(prev => ({...prev, [type]: value}));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }});
      return;
    }
    
    setIsAdding(true);
    await addItem({ ...product, selectedVariant: selectedVariants }, 1);
    setIsAdding(false);
  };

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
                {product.images.map((image) => (
                  <button
                    key={image}
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
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-center object-cover sm:rounded-lg"
              />
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
                      className={`h-5 w-5 flex-shrink-0 ${product.rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating.toFixed(1)} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-accent hover:text-accent-hover">
                  {product.reviews.length} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
            
            {/* Variants */}
            {product.variants && (
              <div className="mt-6">
                {product.variants.map(variant => (
                  <div key={variant.type} className="mb-4">
                    <h3 className="text-sm text-gray-600 font-medium">{variant.type}</h3>
                     <div className="flex items-center space-x-2 mt-2">
                        {variant.options.map(option => (
                           <button 
                                key={option.value} 
                                onClick={() => handleVariantChange(variant.type, option.value)}
                                className={`px-4 py-2 border rounded-full text-sm font-medium ${selectedVariants[variant.type] === option.value ? 'bg-accent text-white border-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                {option.value}
                            </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900">Details</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {product.material && <li>Material: {product.material}</li>}
                    {product.pattern && <li>Pattern: {product.pattern}</li>}
                    {product.gender && <li>Gender: {product.gender}</li>}
                    <li>SKU: {product.sku}</li>
                </ul>
            </div>

            <div className="mt-6">
                 <p className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                 </p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className="max-w-xs flex-1 bg-accent border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-accent sm:w-full disabled:bg-gray-300 disabled:cursor-wait"
              >
                {isAdding ? <SpinnerIcon className="w-6 h-6" /> : 'Add to cart'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                  <HeartIcon className={`h-6 w-6 ${isInWishlist ? 'text-red-500 fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-24 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          {product.reviews.length > 0 ? (
            <div className="mt-6 space-y-10">
              {product.reviews.map((review) => (
                <div key={review.id} className="flex flex-col sm:flex-row gap-x-4">
                   <div className="flex-shrink-0">
                        <img className="h-12 w-12 rounded-full" src={`https://i.pravatar.cc/48?u=${review.author}`} alt={review.author} />
                    </div>
                  <div>
                    <div className="flex items-center">
                       {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 flex-shrink-0 ${review.rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="sr-only">{review.rating} out of 5 stars</p>
                    <p className="mt-4 text-base text-gray-600">{review.comment}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {review.author} on {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">No reviews yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
