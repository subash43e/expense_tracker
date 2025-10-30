'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { MdTrendingUp, MdCategory, MdBarChart, MdAccountBalanceWallet, MdBrightness4, MdDownload } from 'react-icons/md';

const features = [
  {
    icon: MdTrendingUp,
    title: "Easy Expense Tracking",
    description: "Add expenses in seconds with our intuitive interface"
  },
  {
    icon: MdCategory,
    title: "Smart Categorization",
    description: "Organize expenses with 15+ predefined categories"
  },
  {
    icon: MdBarChart,
    title: "Analytics & Insights",
    description: "Visualize your spending with beautiful charts"
  },
  {
    icon: MdAccountBalanceWallet,
    title: "Budget Management",
    description: "Set budgets and track your progress"
  },
  {
    icon: MdBrightness4,
    title: "Dark Mode Support",
    description: "Eye-friendly dark theme for comfortable viewing"
  },
  {
    icon: MdDownload,
    title: "Data Export",
    description: "Download your data in multiple formats"
  }
];

export default function FeaturesSection({
  sectionTitle = "Why Choose Expense Tracker?",
  sectionSubtitle = "Powerful features for smart money management",
  showCTA = true,
  ctaText = "Start Tracking Now"
}) {
  return (
    <section id="features" className="bg-gray-50 dark:bg-gray-800 px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionTitle}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {sectionSubtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <IconComponent className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Optional CTA */}
        {showCTA && (
          <div className="text-center">
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 cursor-pointer">
                {ctaText}
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

FeaturesSection.propTypes = {
  sectionTitle: PropTypes.string,
  sectionSubtitle: PropTypes.string,
  showCTA: PropTypes.bool,
  ctaText: PropTypes.string,
};
