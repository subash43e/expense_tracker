"use client";
import React from "react";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";
import Link from "next/link";

export default function ExpenseList({
  expensesToDisplay,
  handleDelete,
  pathname,
}) {
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
            className="p-4 flex justify-between items-center hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <div>
              <p className="font-medium text-black dark:text-gray-50">
                {expense.description}
              </p>
              <p className="text-sm text-black dark:text-gray-400">
                ${expense.amount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black dark:text-gray-400 mr-4">
                {expense.category}
              </span>
              <Link
                href={`/expenses/edit/${expense._id}`}
                className="p-2 text-black dark:text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label={`Edit ${expense.description}`}
              >
                <BsFillPencilFill className="text-xl" />
              </Link>
              <button
                className="p-2 text-black dark:text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => handleDelete(expense._id)}
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
