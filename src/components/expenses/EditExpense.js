"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { authFetch } from "@/lib/authFetch";

export default function EditExpense({ expense }) {
  const router = useRouter();
  const [description, setDescription] = useState(expense.description || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [category, setCategory] = useState(expense.category || "");
  const [date, setDate] = useState(
    expense.date ? new Date(expense.date).toISOString().split("T")[0] : ""
  );
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }

    // Validate amount
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    } else if (parseFloat(amount) > 1000000) {
      newErrors.amount = "Amount cannot exceed $1,000,000";
    }

    // Validate category
    if (!category.trim()) {
      newErrors.category = "Category is required";
    } else if (category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters";
    }

    // Validate date
    if (!date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validate form before submission
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors below" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authFetch(`/api/expenses/${expense._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          amount: parseFloat(amount),
          category: category.trim(),
          date: new Date(date),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Expense updated successfully!" });
        // Redirect to expenses page after 1.5 seconds
        setTimeout(() => {
          router.push("/expenses");
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Something went wrong!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update expense. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/expenses");
  };

  return (
    <div className="w-full">
      {message && (
        <div
          className={`p-4 mb-6 text-sm rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800"
              : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <input
              className={`w-full bg-gray-50 dark:bg-gray-800 border-2 ${
                errors.description
                  ? "border-red-500 dark:border-red-400 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
              } rounded-lg focus:ring-2 focus:ring-opacity-50 p-3 text-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-500`}
              id="description"
              name="description"
              placeholder="e.g. Coffee with friends"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {errors.description && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                $
              </span>
              <input
                className={`w-full pl-8 pr-3 bg-gray-50 dark:bg-gray-800 border-2 ${
                  errors.amount
                    ? "border-red-500 dark:border-red-400 focus:ring-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                } rounded-lg focus:ring-2 focus:ring-opacity-50 p-3 text-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-500`}
                id="amount"
                name="amount"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            {errors.amount && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className={`w-full bg-gray-50 dark:bg-gray-800 border-2 ${
                errors.category
                  ? "border-red-500 dark:border-red-400 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
              } rounded-lg focus:ring-2 focus:ring-opacity-50 p-3 text-gray-900 dark:text-gray-100 transition-colors`}
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
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.category}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className={`w-full bg-gray-50 dark:bg-gray-800 border-2 ${
                errors.date
                  ? "border-red-500 dark:border-red-400 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
              } rounded-lg focus:ring-2 focus:ring-opacity-50 p-3 text-gray-900 dark:text-gray-100 transition-colors`}
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {errors.date && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.date}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t-2 border-gray-100 dark:border-gray-800">
          <button
            className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-indigo-400 text-white cursor-not-allowed"
                : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Update Expense
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
