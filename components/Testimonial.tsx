
import React from 'react';

const Testimonial: React.FC = () => {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
           <h2 className="text-base font-semibold leading-7 text-accent">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by thousands of happy customers
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root sm:mt-20">
          <div className="-m-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
             <div className="pt-4 sm:inline-block sm:w-full sm:px-4">
               <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-sm ring-1 ring-gray-900/5">
                <blockquote className="text-gray-900">
                  <p>"The quality of the dress I ordered is outstanding, and the customer service was top-notch. It fits perfectly and I got so many compliments!"</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/48?u=jane" alt="" />
                  <div>
                    <div className="font-semibold text-gray-900">Jane D.</div>
                    <div className="text-gray-600">Verified Buyer</div>
                  </div>
                </figcaption>
              </figure>
            </div>
             <div className="pt-4 sm:inline-block sm:w-full sm:px-4">
               <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-sm ring-1 ring-gray-900/5">
                <blockquote className="text-gray-900">
                  <p>"I was looking for a classic Oxford shirt and found exactly what I wanted here. Fast shipping and the fabric was even better in person."</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/48?u=john" alt="" />
                  <div>
                    <div className="font-semibold text-gray-900">John S.</div>
                    <div className="text-gray-600">Verified Buyer</div>
                  </div>
                </figcaption>
              </figure>
            </div>
             <div className="pt-4 sm:inline-block sm:w-full sm:px-4">
               <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-sm ring-1 ring-gray-900/5">
                <blockquote className="text-gray-900">
                  <p>"This has become my go-to store for wardrobe staples. The selection is fantastic and everything I've bought has been excellent quality."</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/48?u=emily" alt="" />
                  <div>
                    <div className="font-semibold text-gray-900">Emily W.</div>
                    <div className="text-gray-600">Verified Buyer</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
