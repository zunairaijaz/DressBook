import React from 'react';
import TruckIcon from './icons/TruckIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import ArrowUturnLeftIcon from './icons/ArrowUturnLeftIcon';

const TrustBadges: React.FC = () => {
  const features = [
    {
      Icon: TruckIcon,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      Icon: ArrowUturnLeftIcon,
      title: '30-Day Returns',
      description: 'Easy returns and exchanges'
    },
    {
      Icon: ShieldCheckIcon,
      title: 'Secure Payments',
      description: '100% secure checkout'
    }
  ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <feature.Icon className="h-10 w-10 text-accent" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;