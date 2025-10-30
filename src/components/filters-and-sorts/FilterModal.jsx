"use client";
import React from "react";
import PropTypes from "prop-types";
import DateFilterControls from "./DateFilterControls";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function FilterModal({
  showFilterModal,
  setShowFilterModal,
  filterDate,
  setFilterDate,
  filterModalRef,
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowFilterModal(true)}
        aria-label="Filter expenses by date"
        aria-expanded={showFilterModal}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Select Date Range
      </button>

      {showFilterModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />
          <div
            ref={filterModalRef}
            className="absolute top-full right-0 mt-2 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative w-72">
              <h3
                id="filter-modal-title"
                className="text-lg font-bold mb-4 text-black dark:text-white"
              >
                Filter Expenses by Date
              </h3>
              <DateFilterControls
                filterDay={filterDate.filterDay}
                setFilterDate={setFilterDate}
                filterMonth={filterDate.filterMonth}
                filterYear={filterDate.filterYear}
                monthNames={MONTH_NAMES}
              />
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowFilterModal(false)}
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
  );
}

FilterModal.propTypes = {
  showFilterModal: PropTypes.bool.isRequired,
  setShowFilterModal: PropTypes.func.isRequired,
  filterDate: PropTypes.shape({
    filterDay: PropTypes.string,
    filterMonth: PropTypes.string,
    filterYear: PropTypes.string,
  }).isRequired,
  setFilterDate: PropTypes.func.isRequired,
  filterModalRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};
