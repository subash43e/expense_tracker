'use client'
import React from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Expense
        </button>
      </div>
    </header>
  );
};

export default Header;
