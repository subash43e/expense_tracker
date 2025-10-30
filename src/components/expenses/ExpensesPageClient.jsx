"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RecentExpenses from "@/components/expenses/RecentExpenses";
import ExportButton from "@/components/export/ExportButton";

export default function ExpensesPageClient({ initialExpenses }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);

  // Fetch expenses to keep data fresh
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
        const data = await res.json();
        const expensesData = data.expenses || data.data || [];
        setExpenses(expensesData);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          All Expenses
        </h1>
        <div className="flex gap-3">
          <ExportButton expenses={expenses} variant="csv" />
          <ExportButton expenses={expenses} variant="json" />
        </div>
      </div>
      <RecentExpenses initialExpenses={expenses} />
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
