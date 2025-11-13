'use client';

import { useAuth } from "@/app/_contexts/AuthContext";
import Sidebar from '@components/layout/Sidebar';

export default function LayoutWrapper({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (isAuthenticated && !loading) {
    return (
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
    );
  }

  return (
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
  );
}

