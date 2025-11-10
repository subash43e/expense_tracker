'use client';

import { useEffect } from 'react';

/**
 * Global error boundary - catches errors in root layout
 * This is a special case error boundary that wraps the entire application
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Application Error
            </h2>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <summary className="cursor-pointer font-semibold text-red-800 dark:text-red-300 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-sm text-red-700 dark:text-red-400 space-y-2">
                  <p className="font-mono text-xs break-all">
                    {error?.message || error?.toString()}
                  </p>
                  {error?.stack && (
                    <pre className="mt-2 text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
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
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
