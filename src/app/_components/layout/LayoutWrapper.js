'use client';

import { useState } from 'react';
import { useAuth } from "@/app/_contexts/AuthContext";
import Sidebar from '@components/layout/Sidebar';
import { AiOutlineMenu } from 'react-icons/ai';

export default function LayoutWrapper({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isAuthenticated && !loading) {
    return (
      <div className='flex border border-gray-200 dark:border-gray-700 h-screen bg-gray-50 dark:bg-gray-900'>
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        <main 
          id="main-content" 
          className='w-full overflow-y-scroll bg-gray-50 dark:bg-gray-900'
          role="main"
          aria-label="Main content"
        >
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <button onClick={toggleMobileMenu} className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <AiOutlineMenu size={24} />
            </button>
          </div>
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

