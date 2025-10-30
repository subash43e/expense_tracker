'use client';

import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function LayoutWrapper({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show default layout only for authenticated users
  if (isAuthenticated && !loading) {
    return (
      <ErrorBoundary>
        <div className='flex border border-gray-200 dark:border-gray-700 h-screen bg-gray-50 dark:bg-gray-900'>
          <Sidebar />
          <main 
            id="main-content" 
            className='w-full overflow-y-scroll bg-gray-50 dark:bg-gray-900'
            role="main"
            aria-label="Main content"
          >
            {children}
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  // For unauthenticated users or during loading, show full-width layout
  return (
    <ErrorBoundary>
      <div className='w-full'>
        <main 
          id="main-content" 
          className='w-full bg-white dark:bg-gray-900'
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
