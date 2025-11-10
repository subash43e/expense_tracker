'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ExpensesError({ error, reset }) {
  useEffect(() => {
    console.error('Expenses route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Error Loading Expenses
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          We couldn&apos;t load your expenses. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <summary className="cursor-pointer font-semibold text-red-800 dark:text-red-300 mb-2">
              Error Details
            </summary>
            <div className="text-sm text-red-700 dark:text-red-400">
              <p className="font-mono">{error?.message || error?.toString()}</p>
            </div>
          </details>
        )}

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
