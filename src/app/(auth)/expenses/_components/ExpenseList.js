"use client";
import React from "react";
import PropTypes from "prop-types";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";
import Link from "next/link";
import { useBudget } from "@contexts/BudgetContext";
import { formatCurrency } from "@lib/currency";

export default function ExpenseList({
  expensesToDisplay = [],
  onDelete,
  pathname,
}) {
  const { currency } = useBudget();

  return (
    <>
      {expensesToDisplay.length === 0 ? (
        <li className="p-8 text-center text-gray-500 dark:text-gray-400">
          No expenses found
        </li>
      ) : (
        expensesToDisplay.map((expense) => (
          <li
            key={expense._id}
            className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-200 dark:border-gray-700/50"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {expense.description}
              </p>
              <p></p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(expense.amount, currency)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300 mr-4">
                {expense.category}
              </span>
              <Link
                href={`/expenses/edit/${expense._id}`}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                aria-label={`Edit ${expense.description}`}
              >
                <BsFillPencilFill className="text-xl" />
              </Link>
              <button
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                onClick={() => onDelete(expense._id)}
                aria-label={`Delete ${expense.description}`}
              >
                <BsTrash3 className="text-xl" />
              </button>
            </div>
          </li>
        ))
      )}

      <div className="p-4 text-center border-t border-gray-500/20 dark:border-gray-400/20">
        {pathname !== "/expenses" && expensesToDisplay.length > 0 && (
          <Link
            href="/expenses"
            className="text-indigo-500 hover:underline font-medium"
          >
            Show More →
          </Link>
        )}
      </div>
    </>
  );
}

ExpenseList.propTypes = {
  expensesToDisplay: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  pathname: PropTypes.string,
};
