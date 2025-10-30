'use client';

import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function HeroSection({
  headline = "Take Control of Your Finances",
  subheading = "Easily track, categorize, and analyze your spending with beautiful analytics",
  primaryButtonText = "Get Started",
  primaryButtonLink = "/register",
  secondaryButtonText = "Learn More",
  secondaryButtonLink = "#features"
}) {
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-gray-900 px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {headline}
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          {subheading}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary Button */}
          <Link href={primaryButtonLink}>
            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 cursor-pointer">
              {primaryButtonText}
            </button>
          </Link>

          {/* Secondary Button */}
          <Link href={secondaryButtonLink}>
            <button className="w-full sm:w-auto border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors duration-300 cursor-pointer">
              {secondaryButtonText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

HeroSection.propTypes = {
  headline: PropTypes.string,
  subheading: PropTypes.string,
  primaryButtonText: PropTypes.string,
  primaryButtonLink: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  secondaryButtonLink: PropTypes.string,
};
