import React from "react";
import PropTypes from "prop-types";

export default function SortControls({
  showSortModal,
  setShowSortModal,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  sortModalRef,
}) {
  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowSortModal(true)}
          aria-label="Sort expenses"
          aria-expanded={showSortModal}
          className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Sort By
        </button>

        {showSortModal && (
          <>
            {/* Backdrop for better UX */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              aria-hidden="true"
            />
            <div
              ref={sortModalRef}
              className="absolute top-full right-0 mt-2 z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="sort-modal-title"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative w-72">
                <h3
                  id="sort-modal-title"
                  className="text-lg font-bold mb-4 text-black dark:text-white"
                >
                  Sort Expenses
                </h3>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="sortBy"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sort By:
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="description">Description</option>
                    <option value="category">Category</option>
                  </select>

                  <label
                    htmlFor="sortOrder"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2"
                  >
                    Sort Order:
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowSortModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

SortControls.propTypes = {
  showSortModal: PropTypes.bool.isRequired,
  setShowSortModal: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  sortModalRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
};