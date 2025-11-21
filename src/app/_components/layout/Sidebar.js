"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import { AiOutlineLogout, AiOutlineClose } from "react-icons/ai";

export default function Sidebar({ isMobileMenuOpen, toggleMobileMenu }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
        onClick={toggleMobileMenu}
        aria-hidden="true"
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ease-in-out 
                   ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                   md:relative md:translate-x-0 md:flex`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <nav
          className="flex-1 px-4 space-y-2"
          role="menubar"
          aria-label="Main menu"
        >
          <Link
            className="flex items-center px-4 py-3 text-gray-900 dark:text-gray-100 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            href="/"
            role="menuitem"
            aria-label="Go to Dashboard"
            onClick={handleLinkClick}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            href="/expenses"
            role="menuitem"
            aria-label="Go to Expenses page"
            onClick={handleLinkClick}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Expenses
          </Link>
          <Link
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            href="/analytics"
            role="menuitem"
            aria-label="Go to Analytics page"
            onClick={handleLinkClick}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analytics
          </Link>
          <Link
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            href="/settings"
            role="menuitem"
            aria-label="Go to Settings"
            onClick={handleLinkClick}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Link>
        </nav>

        {isAuthenticated && user && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Logged in as
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <AiOutlineLogout className="text-lg" />
              Logout
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <Link
              href="/login"
              className="block w-full px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleLinkClick}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors text-center focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handleLinkClick}
            >
              Register
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
