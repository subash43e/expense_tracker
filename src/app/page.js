"use client";

import { useAuth } from "@hooks/useAuth";
import Home from "@components/dashboard/Home";
import { ProtectedRoute } from "@components/common/ProtectedRoute";
import LandingPage from "@components/landing/LandingPage";

export default function Page() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
}
