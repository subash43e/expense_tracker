"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

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
      const res = await fetch(`/api/expenses/${expense._id}`, {
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
    <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300 max-w-2xl">
      {message && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <input
              className={`w-full bg-[#F3F4F6] dark:bg-[#111827] border ${
                errors.description
                  ? "border-red-500 dark:border-red-400"
                  : "border-[#6B7280]/30 dark:border-[#9CA3AF]/30"
              } rounded-md focus:ring-#6366F1 focus:border-#6366F1 p-2 text-black dark:text-white`}
              id="description"
              name="description"
              placeholder="e.g. Coffee with friends"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {errors.description && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className={`w-full bg-[#F3F4F6] dark:bg-[#111827] border ${
                errors.amount
                  ? "border-red-500 dark:border-red-400"
                  : "border-[#6B7280]/30 dark:border-[#9CA3AF]/30"
              } rounded-md focus:ring-#6366F1 focus:border-#6366F1 p-2 text-black dark:text-white`}
              id="amount"
              name="amount"
              placeholder="$0.00"
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

          <div>
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className={`w-full bg-[#F3F4F6] dark:bg-[#111827] border ${
                errors.category
                  ? "border-red-500 dark:border-red-400"
                  : "border-[#6B7280]/30 dark:border-[#9CA3AF]/30"
              } rounded-md focus:ring-#6366F1 focus:border-#6366F1 p-2 text-black dark:text-white`}
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

          <div>
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className={`w-full bg-[#F3F4F6] dark:bg-[#111827] border ${
                errors.date
                  ? "border-red-500 dark:border-red-400"
                  : "border-[#6B7280]/30 dark:border-[#9CA3AF]/30"
              } rounded-md focus:ring-#6366F1 focus:border-#6366F1 p-2 text-black dark:text-white`}
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

        <div className="flex gap-3 justify-end mt-6">
          <button
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`border px-6 py-2 rounded-lg shadow transition flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-[#6366F1]/50 text-[#F9FAFB] cursor-not-allowed"
                : "bg-[#6366F1] text-[#F9FAFB] hover:bg-[#6366F1]/90"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              "Update Expense"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
