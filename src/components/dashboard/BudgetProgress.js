"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { BsTrophy } from "react-icons/bs";
import { authFetch } from "@/lib/authFetch";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

export default function BudgetProgress({ expenses = [], isLoading, error }) {
  const [budgetData, setBudgetData] = useState(null);
  const [isBudgetLoading, setIsBudgetLoading] = useState(true);

  const fetchBudget = useCallback(async () => {
    try {
      const res = await authFetch("/api/budgets");
      const data = await res.json();

      if (res.ok && data.budget) {
        setBudgetData(data.budget);
      } else {
        setBudgetData(null);
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudgetData(null);
    } finally {
      setIsBudgetLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudget();

    const handleBudgetUpdate = () => {
      fetchBudget();
    };
    window.addEventListener("budgetUpdated", handleBudgetUpdate);

    return () => {
      window.removeEventListener("budgetUpdated", handleBudgetUpdate);
    };
  }, [fetchBudget]);

  const monthlyBudget = budgetData?.monthlyLimit || 5000;
  const currency = budgetData?.currency || "USD";
  const currencySymbol = getCurrencySymbol(currency);

  const {
    currentSpending,
    yearlySpending,
    notificationType,
    shouldShowNotification,
  } = useMemo(() => {
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return {
        currentSpending: 0,
        yearlySpending: 0,
        notificationType: "success",
        shouldShowNotification: false,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const yearlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear;
    });

    const totalMonthlySpent = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const totalYearlySpent = yearlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const percentage = (totalMonthlySpent / monthlyBudget) * 100;
    let type = "success";
    let displayNotification = false;

    if (totalMonthlySpent > monthlyBudget) {
      type = "danger";
      displayNotification = true;
    } else if (percentage >= 80) {
      type = "warning";
      displayNotification = true;
    } else if (percentage >= 50) {
      type = "info";
      displayNotification = false;
    }

    return {
      currentSpending: totalMonthlySpent,
      yearlySpending: totalYearlySpent,
      notificationType: type,
      shouldShowNotification: displayNotification,
    };
  }, [expenses, monthlyBudget]);

  const percentageSpent = (currentSpending / monthlyBudget) * 100;
  const isOverBudget = currentSpending > monthlyBudget;
  const isNearBudget = percentageSpent >= 80 && percentageSpent < 100;

  const getNotificationMessage = () => {
    if (isOverBudget) {
      return `You've exceeded your budget by ${formatCurrency(
        currentSpending - monthlyBudget,
        currency
      )}!`;
    } else if (isNearBudget) {
      return `You're approaching your budget limit! ${formatCurrency(
        monthlyBudget - currentSpending,
        currency
      )} remaining.`;
    }
    return "";
  };

  const [dismissedNotification, setDismissedNotification] = useState(false);

  const handleDismissNotification = () => {
    setDismissedNotification(true);
  };

  if (isLoading || isBudgetLoading) {
    return (
      <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300">
        <p className="text-gray-600 dark:text-gray-300">Calculating budget insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300">
        <p className="text-red-600 dark:text-red-400">Failed to load budget data: {error}</p>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300">
        <div className="text-center py-6">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Budget Set
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create a monthly budget in Settings to track your spending progress
          </p>
          <a
            href="/settings"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Set Up Budget
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {shouldShowNotification && !dismissedNotification && (
        <div
          className={`p-4 rounded-lg border-l-4 ${
            notificationType === "danger"
              ? "bg-red-50 dark:bg-red-900/20 border-red-500"
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center">
            <svg
              className={`w-6 h-6 mr-3 ${
                notificationType === "danger"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3
                className={`font-semibold ${
                  notificationType === "danger"
                    ? "text-red-800 dark:text-red-200"
                    : "text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {notificationType === "danger"
                  ? "Budget Exceeded!"
                  : "Budget Warning"}
              </h3>
              <p
                className={`text-sm ${
                  notificationType === "danger"
                    ? "text-red-700 dark:text-red-300"
                    : "text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {getNotificationMessage()}
              </p>
            </div>
            <button
              onClick={handleDismissNotification}
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Dismiss notification"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300">
        <div className="flex items-center mb-4 justify-center">
          <div className="flex items-center mb-4 mx-auto">
            <div className="mr-3">
              
              <svg
                className={`w-8 h-8 ${
                  isOverBudget ? "text-red-500" : "text-green-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Monthly Budget:{" "}
                <span
                  className={`${
                    isOverBudget ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatCurrency(currentSpending, currency, false)}
                </span>{" "}
                / {formatCurrency(monthlyBudget, currency, false)}
              </h2>
              <p
                className={`text-sm ${
                  isOverBudget ? "text-red-500" : "text-gray-600"
                }`}
              >
                {isOverBudget
                  ? "You've exceeded your budget!"
                  : "You're doing great! Keep it up!"}
              </p>
            </div>
          </div>
          
        </div>

        <div className="w-full  relative ">
          <div className="overflow-hidden rounded-full h-4 mb-10 border">
            <div
              className={`${
                isOverBudget ? "bg-red-500" : "bg-green-500"
              } h-4 rounded-full`}
              style={{
                width: `${percentageSpent > 100 ? 100 : percentageSpent}%`,
              }}
            ></div>
          </div>
          <div className="absolute top-5 -left-1 mt-1 text-sm text-gray-600 dark:text-white">
            0%
          </div>
          <div className="absolute top-5 -right-1 mt-1 text-sm text-gray-600 dark:text-white">
            100%
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Note: It&apos;s just showing the current month&apos;s total expense.
        </div>

        <div className="space-x-2 hidden">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 gap-2">
            <BsTrophy />
            Budget Master
          </span>
        </div>
      </div>
    </div>
  );
}

BudgetProgress.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};
