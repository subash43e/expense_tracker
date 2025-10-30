"use client";
import PropTypes from "prop-types";
import RecentExpenses from "@/components/expenses/RecentExpenses";

export default function ExpensesPageClient({ initialExpenses }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Expenses
        </h1>
      </div>
      <RecentExpenses initialExpenses={initialExpenses} />
    </div>
  );
}

ExpensesPageClient.propTypes = {
  initialExpenses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    })
  ),
};
