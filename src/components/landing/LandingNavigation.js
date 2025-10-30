'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { MdMenu, MdClose } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

export default function LandingNavigation({
  logoText = "Expense Tracker",
  signInLink = "/login",
  signUpLink = "/register"
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 font-medium"
            >
              Features
            </a>
            {isAuthenticated && (
              <Link href="/expenses">
                <span className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 font-medium cursor-pointer">
                  Dashboard
                </span>
              </Link>
            )}
          </nav>

          {/* Right Side - Desktop Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={signInLink}>
              <span className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 font-medium cursor-pointer">
                Sign In
              </span>
            </Link>
            <Link href={signUpLink}>
              <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <MdClose className="w-6 h-6" />
            ) : (
              <MdMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-white dark:bg-gray-800 md:hidden">
          <nav className="flex flex-col gap-4 p-6">
            <a
              href="#features"
              onClick={closeMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2"
            >
              Features
            </a>
            {isAuthenticated && (
              <Link href="/expenses" onClick={closeMobileMenu}>
                <span className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2 cursor-pointer block">
                  Dashboard
                </span>
              </Link>
            )}
            <hr className="border-gray-200 dark:border-gray-700 my-2" />
            <Link href={signInLink} onClick={closeMobileMenu}>
              <span className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2 cursor-pointer block">
                Sign In
              </span>
            </Link>
            <Link href={signUpLink} onClick={closeMobileMenu}>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium cursor-pointer">
                Sign Up
              </button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

LandingNavigation.propTypes = {
  logoText: PropTypes.string,
  signInLink: PropTypes.string,
  signUpLink: PropTypes.string,
};
