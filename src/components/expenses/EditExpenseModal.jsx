"use client";

import EditExpense from "./EditExpense";

export default function EditExpenseModal({ expense }) {
  return (
    <div className="fixed inset-0 bg-linear-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/80 dark:to-purple-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl flex justify-center items-center min-h-full py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 w-full shadow-2xl border border-indigo-100 dark:border-indigo-900/30 animate-slideUp">
          <div className="mb-8 text-center border-b-2 border-indigo-100 dark:border-indigo-900/30 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              Edit Expense
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your expense details below
            </p>
          </div>
          <EditExpense expense={expense} />
        </div>
      </div>
    </div>
  );
}