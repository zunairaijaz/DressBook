import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image }) => {
  return (
    <Link to={`/search?category=${encodeURIComponent(name)}`} className="group relative block">
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
      </div>
       <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg transition-colors duration-300 group-hover:bg-opacity-50">
          <h3 className="text-2xl font-semibold text-white tracking-wider">{name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;