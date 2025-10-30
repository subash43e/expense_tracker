'use client';

import React from 'react';
import LandingNavigation from './LandingNavigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import CTASection from './CTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Navigation */}
      <LandingNavigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Call-to-Action Section */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>&copy; 2025 Expense Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
