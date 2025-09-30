import React from 'react';
import CategoryCard from './CategoryCard';

interface CollectionListProps {
  title: string;
  subtitle: string;
  collections: { name: string; image: string }[];
}

const CollectionList: React.FC<CollectionListProps> = ({ title, subtitle, collections }) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
          {collections.map((category) => (
            <CategoryCard key={category.name} name={category.name} image={category.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
