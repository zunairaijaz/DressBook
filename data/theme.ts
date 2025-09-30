import { Product } from '../types';
import { products, categories } from './products';

// --- Type Definitions for Homepage Sections ---
// This ensures that when you define a section in the theme,
// you provide the correct props for that section type.

interface Section<T extends string, P = {}> {
  id: string; // Unique ID for React key prop
  type: T; // The type of section to render
  props?: P; // Props specific to this section component
}

export type HomePageSection =
  | Section<'hero'>
  | Section<'trustBadges'>
  | Section<'featuredProducts', { title: string; subtitle: string; products: Product[] }>
  | Section<'featureSection'>
  | Section<'collectionList', { title: string; subtitle: string; collections: { name: string; image: string }[] }>
  | Section<'testimonial'>
  | Section<'newsletter'>;
  
// --- Homepage Theme Configuration ---
// This object drives the structure of the homepage.
// - To reorder sections, change the order of objects in the `sections` array.
// - To remove a section, delete its object from the array.
// - To add a new section, add a new object with a unique `id` and correct `type` and `props`.
export const homepageTheme: { sections: HomePageSection[] } = {
  sections: [
    {
      id: 'hero_banner_1',
      type: 'hero',
    },
    {
      id: 'trust_badges_1',
      type: 'trustBadges',
    },
    {
      id: 'featured_products_1',
      type: 'featuredProducts',
      props: {
        title: 'Our Featured Products',
        subtitle: 'Handpicked for you, from our best-selling collections.',
        products: products.slice(0, 4), // Example: show first 4 products
      },
    },
    {
      id: 'feature_section_1',
      type: 'featureSection',
    },
    {
        id: 'collection_list_1',
        type: 'collectionList',
        props: {
            title: 'Shop by Category',
            subtitle: 'Browse our curated collections to find exactly what you need.',
            collections: categories.slice(0, 3) // Example: show first 3 categories
        }
    },
    {
      id: 'testimonial_1',
      type: 'testimonial',
    },
    {
      id: 'newsletter_1',
      type: 'newsletter',
    },
  ],
};
