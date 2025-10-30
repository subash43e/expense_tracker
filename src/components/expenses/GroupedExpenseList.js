"use client";
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { getCategoryIcon } from "@/lib/categories";

// Helper function to get time period
const getTimePeriod = (date) => {
  const expenseDate = new Date(date);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfThisWeek = new Date(startOfToday);
  startOfThisWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
  
  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  if (expenseDate >= startOfThisWeek) {
    return "This Week";
  } else {
    // Return month and year for all other expenses
    const monthYear = expenseDate.toLocaleDateString("en-US", { 
      month: "long", 
      year: "numeric" 
    });
    return monthYear;
  }
};

// Group expenses by time period
const groupExpensesByPeriod = (expenses) => {
  const grouped = {};

  expenses.forEach((expense) => {
    const period = getTimePeriod(expense.date);
    if (!grouped[period]) {
      grouped[period] = [];
    }
    grouped[period].push(expense);
  });

  // Sort groups by date (most recent first)
  const sortedGroups = Object.entries(grouped).sort((a, b) => {
    const [periodA] = a;
    const [periodB] = b;
    
    // "This Week" always comes first
    if (periodA === "This Week") return -1;
    if (periodB === "This Week") return 1;
    
    // Parse dates for month/year groups
    const dateA = new Date(periodA);
    const dateB = new Date(periodB);
    
    return dateB - dateA; // Most recent first
  });

  return sortedGroups;
};

export default function GroupedExpenseList({
  expensesToDisplay,
  handleDelete,
}) {
  const groupedExpenses = useMemo(
    () => groupExpensesByPeriod(expensesToDisplay),
    [expensesToDisplay]
  );

  // Calculate total expenses
  const totalAmount = useMemo(
    () => expensesToDisplay.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0),
    [expensesToDisplay]
  );

  // Track which month sections are expanded
  const [expandedMonths, setExpandedMonths] = useState({});

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  // Check if a period is collapsible (month/year groups)
  const isCollapsible = (period) => period !== "This Week";

  return (
    <>
      {expensesToDisplay.length === 0 ? (
        <li className="p-8 text-center text-gray-500 dark:text-gray-400">
          No expenses found
        </li>
      ) : (
        <>
          {/* Total Expenses Summary */}
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 dark:text-indigo-200 text-sm font-medium uppercase tracking-wide mb-1">
                  Total Expenses
                </p>
                <p className="text-white text-4xl font-bold">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-indigo-100 dark:text-indigo-200 text-sm font-medium mb-1">
                  Total Items
                </p>
                <p className="text-white text-3xl font-bold">
                  {expensesToDisplay.length}
                </p>
              </div>
            </div>
          </div>

          {/* Grouped Expenses */}
          {groupedExpenses.map(([period, expenses], index) => (
          <div key={period} className={`${index > 0 ? 'mt-6' : ''}`}>
            {/* Period Header */}
            <button
              onClick={() => isCollapsible(period) && toggleMonth(period)}
              disabled={!isCollapsible(period)}
              className={`w-full px-4 py-3 flex items-center gap-3 border-b-2 ${
                isCollapsible(period)
                  ? "bg-linear-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-750 hover:from-gray-150 hover:to-gray-100 dark:hover:from-gray-650 dark:hover:to-gray-700 cursor-pointer border-gray-300 dark:border-gray-600"
                  : "bg-linear-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 border-indigo-200 dark:border-indigo-800"
              } transition-all rounded-t-lg shadow-sm`}
            >
              {isCollapsible(period) && (
                <span className="text-xl text-gray-600 dark:text-gray-400">
                  {expandedMonths[period] ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              )}
              <h3 className={`text-sm font-bold tracking-wider flex items-center gap-2 ${
                isCollapsible(period)
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-indigo-700 dark:text-indigo-300"
              }`}>
                {period}
                <span className="ml-auto text-xs font-normal bg-white dark:bg-gray-800 px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600">
                  {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                </span>
              </h3>
            </button>

            {/* Expenses in this period - hide if month is collapsed */}
            {(!isCollapsible(period) || expandedMonths[period]) && (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800/50 rounded-b-lg shadow-sm border-x border-b border-gray-200 dark:border-gray-700">
                {expenses.map((expense, expenseIndex) => (
                  <li
                    key={expense._id}
                    className="p-4 flex justify-between items-center hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all duration-150 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl shrink-0">{getCategoryIcon(expense.category)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-50 truncate">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(expense.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {expense.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900 dark:text-gray-50">
                          ${expense.amount}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/expenses/edit/${expense._id}`}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          aria-label={`Edit ${expense.description}`}
                        >
                          <BsFillPencilFill className="text-lg" />
                        </Link>
                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          onClick={() => handleDelete(expense._id)}
                          aria-label={`Delete ${expense.description}`}
                        >
                          <BsTrash3 className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        </>
      )}
    </>
  );
}

GroupedExpenseList.propTypes = {
  expensesToDisplay: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    })
  ).isRequired,
  handleDelete: PropTypes.func.isRequired,
};
