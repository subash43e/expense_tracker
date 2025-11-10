"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { authFetch } from "@/lib/authFetch";
import { createExpenseSchema, formatZodErrors } from "@/lib/validations";
import { useBudget } from "@/contexts/BudgetContext"; 
import { getCurrencySymbol } from "@/lib/currency";
import Alert from "@/components/common/Alert";
import Spinner from "@/components/common/Spinner";
import FormField from "@/components/common/FormField";

export default function EditExpense({ expense }) {
  const router = useRouter();
  const { currency } = useBudget();
  const currencySymbol = getCurrencySymbol(currency);
  const [description, setDescription] = useState(expense.description || "");
  const [amount, setAmount] = useState(
    typeof expense.amount === "number" ? String(expense.amount) : ""
  );
  const [category, setCategory] = useState(expense.category || "");
  const [date, setDate] = useState(
    expense.date ? new Date(expense.date).toISOString().split("T")[0] : ""
  );
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await authFetch(`/api/expenses/${expense._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Expense updated successfully!" });
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
      <Alert 
        type={message?.type || "error"} 
        message={message?.text} 
        showIcon={true}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              label="Description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              placeholder="e.g. Coffee with friends"
              required
              variant="spacious"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Amount ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium z-10">
                {currencySymbol}
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
            <FormField
              label="Category"
              name="category"
              type="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              error={errors.category}
              placeholder="Select a category"
              options={EXPENSE_CATEGORIES}
              required
              variant="spacious"
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              required
              variant="spacious"
            />
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
                <Spinner size="md" />
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

EditExpense.propTypes = {
  expense: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  }).isRequired,
};
