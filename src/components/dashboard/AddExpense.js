"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { authFetch } from "@/lib/authFetch";
import { createExpenseSchema, formatZodErrors } from "@/lib/validations";
import useBudget from "@/hooks/useBudget";
import { getCurrencySymbol } from "@/lib/currency";

export default function AddExpense({ onSuccess }) {
  const { currency } = useBudget();
  const currencySymbol = getCurrencySymbol(currency);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message?.type === "success") {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const validationResult = createExpenseSchema.safeParse({
      description,
      amount,
      category,
      date,
    });

    if (!validationResult.success) {
      setErrors(formatZodErrors(validationResult.error));
      setMessage({ type: "error", text: "Please fix the errors below" });
      return;
    }

    setErrors({});

    setIsLoading(true);

    try {
      const res = await authFetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Expense added successfully!" });
        setDescription("");
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().split("T")[0]); // Reset to today
        setErrors({});
        
        // Call success callback to refresh expense list
        if (onSuccess) {
          await onSuccess();
        }
      } else {
        setMessage({ type: "error", text: data.error || "Something went wrong!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add expense. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {message && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg border ${message.type === "success"
            ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800"
            : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
            }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <input
              className={`w-full bg-gray-50 dark:bg-gray-700 border ${
                errors.description 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-10 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3`}
              id="description"
              name="description"
              placeholder="e.g. Coffee with friends"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {errors.description && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="amount"
            >
              Amount ({currencySymbol})
            </label>
            <input
              className={`w-full bg-gray-50 dark:bg-gray-700 border ${
                errors.amount 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 h-10`}
              id="amount"
              name="amount"
              placeholder={`${currencySymbol}0.00`}
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {errors.amount && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          <div className="">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className={`w-full bg-gray-50 dark:bg-gray-700 border ${
                errors.category 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 px-3 h-10`}
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div className="">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className={`w-full bg-gray-50 dark:bg-gray-700 border ${
                errors.date 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 px-3 h-10`}
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {errors.date && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className={`px-6 py-2.5 rounded-lg shadow-md transition-all w-full md:w-auto flex items-center justify-center gap-2 font-semibold ${
              isLoading 
                ? "bg-indigo-400 text-white cursor-not-allowed" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Expense
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

AddExpense.propTypes = {
  onSuccess: PropTypes.func,
};