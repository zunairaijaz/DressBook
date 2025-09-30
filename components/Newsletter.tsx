import React, { useState } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Simulate a random success/error response
      if (email === 'already@subscribed.com') {
         setStatus('error');
         setMessage('This email is already subscribed.');
      } else {
        setStatus('success');
        setMessage("Thanks for subscribing! You're on the list.");
        setEmail('');
      }
    }, 1500);
  };
  
  const isFormActive = status === 'idle' || status === 'error' || status === 'loading';

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Stay in the Loop
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-600">
          Sign up for our newsletter to get the latest deals and product updates.
        </p>
        
        <div className="mt-8 flex justify-center">
            <div className="w-full max-w-lg">
                {isFormActive ? (
                <form className="sm:flex" onSubmit={handleSubmit}>
                    <label htmlFor="email-address" className="sr-only">
                    Email address
                    </label>
                    <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 shadow-sm placeholder-gray-400 focus:ring-accent focus:border-accent sm:max-w-xs rounded-md"
                    placeholder="Enter your email"
                    disabled={status === 'loading'}
                    />
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-gray-400 disabled:cursor-wait"
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                    </div>
                </form>
                ) : (
                    <div className="flex items-center justify-center bg-green-100 text-green-800 p-4 rounded-md">
                        <CheckCircleIcon className="h-6 w-6 mr-3" />
                        <p className="font-medium">{message}</p>
                    </div>
                )}
                {status === 'error' && (
                    <p className="mt-2 text-sm text-red-600">{message}</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Newsletter;