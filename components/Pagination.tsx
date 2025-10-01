// components/Pagination.tsx
"use client";

import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { useSearchParams, usePathname } from 'next/navigation'; // Import Next.js hooks
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Get the current path

  const createPageURL = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(pageNumber));
    return `${pathname}?${newParams.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
        pages.push(1);
        if (currentPage > half + 2) pages.push('...');
        let start = Math.max(2, currentPage - half);
        let end = Math.min(totalPages - 1, currentPage + half);
        if (currentPage <= half + 1) {
            end = maxPagesToShow;
        }
        if (currentPage >= totalPages - half) {
            start = totalPages - maxPagesToShow + 1;
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - half - 1) pages.push('...');
        pages.push(totalPages);
    }
    return pages;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center" aria-label="Pagination">
      <div className="flex items-center gap-2">
        {currentPage > 1 && (
          <Link
            href={createPageURL(currentPage - 1)} // Use href for Next.js Link
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Previous
          </Link>
        )}

        <div className="hidden md:flex items-center gap-2">
            {pageNumbers.map((page, index) => (
                typeof page === 'number' ? (
                <Link
                    key={index}
                    href={createPageURL(page)} // Use href for Next.js Link
                    className={`inline-flex items-center justify-center h-10 w-10 border text-sm font-medium rounded-md ${
                    currentPage === page
                        ? 'border-accent bg-accent text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </Link>
                ) : (
                    <span key={index} className="inline-flex items-center justify-center h-10 w-10 text-sm font-medium text-gray-500">
                        {page}
                    </span>
                )
            ))}
        </div>

        {currentPage < totalPages && (
          <Link
            href={createPageURL(currentPage + 1)} // Use href for Next.js Link
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
