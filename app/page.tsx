import { products, categories } from '../data/products';
import HomePageClient from './HomePageClient';

// This is a React Server Component (RSC)
// It can fetch data on the server and then pass it to client components.
export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const kitchenwareProducts = products.filter(p => p.category === 'Kitchenware').slice(0, 8);
  const homeCategories = categories.slice(0, 4);

  return (
    <HomePageClient 
      featuredProducts={featuredProducts}
      kitchenwareProducts={kitchenwareProducts}
      homeCategories={homeCategories}
    />
  );
}
