"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EXPENSE_CATEGORIES } from "@lib/categories";
import { createExpense } from "@/app/(auth)/expenses/_actions/expenses";
import { createExpenseSchema, formatZodErrors } from "@lib/validations";
import { useBudget } from "@contexts/BudgetContext";
import { getCurrencySymbol } from "@lib/currency";
import Alert from "@components/common/Alert";
import Spinner from "@components/common/Spinner";
import FormField from "@components/common/FormField";

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
      const result = await createExpense(validationResult.data);

      if (result.success) {
        setMessage({ type: "success", text: "Expense added successfully!" });
        setDescription("");
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().split("T")[0]);
        setErrors({});
        
        if (onSuccess) {
          await onSuccess();
        }
      } else {
        setMessage({ type: "error", text: result.error || "Something went wrong!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add expense. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <Alert 
        type={message?.type || "error"} 
        message={message?.text} 
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
            />
          </div>
          <div className="">
            <FormField
              label={`Amount (${currencySymbol})`}
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              placeholder={`${currencySymbol}0.00`}
              required
              inputProps={{ step: "0.01", min: "0" }}
            />
          </div>
          <div className="">
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
            />
          </div>
          <div className="">
            <FormField
              label="Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              required
            />
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
                <Spinner size="sm" />
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