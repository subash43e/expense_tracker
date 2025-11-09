"use client";
import { useState, useEffect } from "react";
import { authFetch } from "@/lib/authFetch";
import { createBudgetSchema, formatZodErrors } from "@/lib/validations";
import { getCurrencySymbol } from "@/lib/currency";

export default function BudgetManager() {
  const [budget, setBudget] = useState(null);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBudget();
    console.log(fetchBudget());
  }, []);

  console.log("Budget ", budget?.currency);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  const fetchBudget = async () => {
    try {
      const res = await authFetch("/api/budgets");
      const data = await res.json();

      if (res.ok && data.budget) {
        setBudget(data.budget);
        setMonthlyLimit(data.budget.monthlyLimit.toString());
        setCurrency(data.budget.currency || "USD");
      } else {
        setBudget(null);
        setIsEditing(true); // Show form if no budget exists
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load budget" });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    const validationResult = createBudgetSchema.safeParse({
      monthlyLimit,
      currency,
    });

    if (!validationResult.success) {
      setErrors(formatZodErrors(validationResult.error));
      setMessage({ type: "error", text: "Please fix the errors below" });
      return;
    }

    setIsSaving(true);

    try {
      const res = await authFetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (res.ok) {
        setBudget(data.budget);
        setIsEditing(false);
        setMessage({ type: "success", text: data.message });
        
        // Trigger a custom event to notify BudgetProgress component
        window.dispatchEvent(new Event("budgetUpdated"));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save budget" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save budget. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your budget?")) {
      return;
    }

    setIsSaving(true);

    try {
      const res = await authFetch("/api/budgets", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setBudget(null);
        setMonthlyLimit("");
        setCurrency("USD");
        setIsEditing(true);
        setMessage({ type: "success", text: data.message });
        
        // Trigger event to notify BudgetProgress component
        window.dispatchEvent(new Event("budgetUpdated"));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete budget" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete budget. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (budget) {
      setMonthlyLimit(budget.monthlyLimit.toString());
      setCurrency(budget.currency || "USD");
      setIsEditing(false);
    }
    setErrors({});
    setMessage(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Budget
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Loading budget...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Monthly Budget
          </h2>
          {budget && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Edit Budget
            </button>
          )}
        </div>

        {message && (
          <div
            className={`p-4 mb-4 text-sm rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800"
                : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {!isEditing && budget ? (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Monthly Spending Limit
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getCurrencySymbol(currency) }  {budget.monthlyLimit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Currency
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                     {budget.currency}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Delete Budget
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                htmlFor="monthlyLimit"
              >
                Monthly Spending Limit
              </label>
              <input
                id="monthlyLimit"
                type="number"
                step="0.01"
                min="1"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="e.g., 5000"
                className={`w-full bg-gray-50 dark:bg-gray-700 border ${
                  errors.monthlyLimit
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.monthlyLimit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.monthlyLimit}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Set your maximum monthly spending target
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                htmlFor="currency"
              >
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-700 border ${
                  errors.currency
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.currency}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : budget ? "Update Budget" : "Create Budget"}
              </button>
              {budget && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">About Monthly Budget</p>
              <p>
                Set a monthly spending limit to help track your expenses. You&apos;ll receive
                alerts when you approach or exceed your budget.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
