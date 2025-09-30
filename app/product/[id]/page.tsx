import { products } from '../../../data/products';
import { Product } from '../../../types';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
}

// This function fetches data on the server
async function getProduct(id: string): Promise<Product | undefined> {
  // In a real app, this would be a database call
  return products.find(p => p.id === Number(id));
}

// This function generates metadata on the server
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found'
    }
  }
 
  return {
    title: product.name,
    description: product.description,
  }
}

// This is the page component, it's a Server Component
export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">Product not found.</div>;
  }

  return <ProductDetailClient product={product} />;
}
