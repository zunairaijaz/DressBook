// app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types'; // Adjust import path if needed

type Props = {
  params: { id: string };
};

// This function fetches data from your API
async function getProduct(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        return undefined;
      }
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Fetch error for product ${id}:`, error);
    return undefined;
  }
}

// This function generates metadata on the server
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | The Dress Book`,
    description: product.description,
  };
}

// This is the page component, it's a Server Component
export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    // Return a 404 page if the product is not found
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
