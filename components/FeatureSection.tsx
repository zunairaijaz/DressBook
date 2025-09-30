import React from 'react';
// FIX: Using namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

const FeatureSection: React.FC = () => {
    const features = [
        {
            title: 'Timeless Design',
            description: 'Our products are crafted with a focus on clean lines, natural materials, and lasting quality. Each piece is designed to be both beautiful and functional, complementing any modern space.',
            imageUrl: 'https://i.imgur.com/mJ5zYg9.jpeg',
            imageAlt: 'Well-designed living room with modern furniture',
            align: 'left'
        },
        {
            title: 'Sustainable Materials',
            description: 'We are committed to sustainability. We source eco-friendly materials, partner with responsible manufacturers, and use packaging that minimizes our environmental impact.',
            imageUrl: 'https://i.imgur.com/rS2dGpg.jpeg',
            imageAlt: 'Close-up of sustainable wood grain',
            align: 'right'
        }
    ];

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Designed for the Modern Home
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Discover the difference that quality craftsmanship and thoughtful design can make in your everyday life.
                    </p>
                </div>
                <div className="mt-16 space-y-20 lg:space-y-24">
                    {features.map((feature) => (
                        <div 
                            key={feature.title} 
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 items-center ${feature.align === 'right' ? 'lg:grid-flow-col-dense' : ''}`}
                        >
                            <div className={`${feature.align === 'right' ? 'lg:col-start-2' : ''}`}>
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900">{feature.title}</h3>
                                <p className="mt-4 text-gray-600">{feature.description}</p>
                                <Link 
                                    to="/search"
                                    className="mt-6 inline-block text-accent font-semibold hover:text-accent-hover"
                                >
                                    Learn more <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                            <div className={`${feature.align === 'right' ? 'lg:col-start-1' : ''}`}>
                                <img 
                                    src={feature.imageUrl} 
                                    alt={feature.imageAlt} 
                                    className="rounded-lg bg-gray-100 shadow-md"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;