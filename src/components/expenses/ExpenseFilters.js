"use client";
import React from "react";
import PropTypes from "prop-types";
import FilterModal from "../filters-and-sorts/FilterModal";
import SortControls from "../filters-and-sorts/SortControls";

export default function ExpenseFilters({
  showFilterModal,
  setShowFilterModal,
  showSortModal,
  setShowSortModal,
  filterModalRef,
  sortModalRef,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filterDate,
  setFilterDate,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="p-4 border-b border-gray-500/20 dark:border-gray-400/20">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Expenses
        </h2>
        <div className="flex gap-2">
          <SortControls
            showSortModal={showSortModal}
            setShowSortModal={setShowSortModal}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortModalRef={sortModalRef}
          />
          <FilterModal
            showFilterModal={showFilterModal}
            setShowFilterModal={setShowFilterModal}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterModalRef={filterModalRef}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by description, category, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

ExpenseFilters.propTypes = {
  showFilterModal: PropTypes.bool.isRequired,
  setShowFilterModal: PropTypes.func.isRequired,
  showSortModal: PropTypes.bool.isRequired,
  setShowSortModal: PropTypes.func.isRequired,
  filterModalRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object })
  ]),
  sortModalRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object })
  ]),
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  filterDate: PropTypes.shape({
    filterDay: PropTypes.string,
    filterMonth: PropTypes.string,
    filterYear: PropTypes.string,
  }).isRequired,
  setFilterDate: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};