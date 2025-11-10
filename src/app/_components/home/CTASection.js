'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function CTASection({
  headline = "Ready to Take Control of Your Finances?",
  description = "Get started in seconds. No credit card required. Cancel anytime.",
  buttonText = "Create Free Account",
  buttonLink = "/register",
  secondaryText = "Already have an account?",
  secondaryLink = "/login",
  benefits = ["Free to use", "No credit card required", "Instant setup"],
  showBackground = true
}) {
  return (
    <section className={`px-4 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24 ${
      showBackground ? 'bg-linear-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto text-center">
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {headline}
        </h2>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          {description}
        </p>

        {benefits && benefits.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {benefits.map((benefit, index) => (
              <span key={index} className="text-gray-700 dark:text-gray-200">
                ✓ {benefit}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          
          <Link href={buttonLink}>
            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 cursor-pointer">
              {buttonText}
            </button>
          </Link>

          <Link href={secondaryLink}>
            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer font-medium">
              {secondaryText} <span className="underline">Sign in</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

CTASection.propTypes = {
  headline: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  secondaryText: PropTypes.string,
  secondaryLink: PropTypes.string,
  benefits: PropTypes.arrayOf(PropTypes.string),
  showBackground: PropTypes.bool,
};
