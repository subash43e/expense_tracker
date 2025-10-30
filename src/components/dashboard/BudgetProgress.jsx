"use client";
import { useState, useEffect } from "react";
import { BsTrophy } from "react-icons/bs";



export default function BudgetProgress() {
  const [currentSpending, setCurrentSpending] = useState(0);
  const [yearlySpending, setYearlySpending] = useState(0);

  const monthlyBudget = 5000;

  const calculatePercentageSpent = (monthlyBudget, currentSpending) => {
    return (currentSpending / monthlyBudget) * 100;
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      
      // Handle both response formats: paginated (data.expenses) and simple (data.data)
      let expenses = [];
      if (data.expenses && Array.isArray(data.expenses)) {
        expenses = data.expenses;
      } else if (data.data && Array.isArray(data.data)) {
        expenses = data.data;
      }

      if (expenses.length === 0) {
        console.warn("No expenses found or invalid data format.");
        setCurrentSpending(0);
        setYearlySpending(0);
        return;
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      });

      const yearlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === currentYear;
      });

      const totalMonthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setCurrentSpending(totalMonthlySpent);

      const totalYearlySpent = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setYearlySpending(totalYearlySpent);
    };

    fetchExpenses();
  }, []);

  const percentageSpent = calculatePercentageSpent(monthlyBudget, currentSpending);
  const isOverBudget = currentSpending > monthlyBudget;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300">
      <div className="flex items-center mb-4 justify-center">
        <div className="flex items-center mb-4 mx-auto">
          <div className="mr-3">
            {/* Star Icon */}
            <svg
              className={`w-8 h-8 ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          </div>
          <div >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Monthly Budget: <span className={`${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>${currentSpending}</span> / ${monthlyBudget}
            </h2>
            <p className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-gray-600'}`}>
              {isOverBudget ? "You've exceeded your budget!" : "You're doing great! Keep it up!"}
            </p>
          </div>
        </div>
        <div className="text-black dark:text-white ">
          <div className="text-end">
            monthly spend: ${currentSpending}
          </div>
          <div className="text-end">
            Yearly spend: ${yearlySpending}
          </div>
        </div>
      </div>

      <div className="w-full  relative ">
        <div className="overflow-hidden rounded-full h-4 mb-10">
          <div
            className={`${isOverBudget ? 'bg-red-500' : 'bg-green-500'} h-4 rounded-full`}
            style={{ width: `${percentageSpent > 100 ? 100 : percentageSpent}%` }}
          >
          </div>
        </div>
        <div className="absolute top-5 -left-1 mt-1 text-sm text-gray-600 dark:text-white">0%</div>
        <div className="absolute top-5 -right-1 mt-1 text-sm text-gray-600 dark:text-white">100%</div>
      </div>

      <div className="space-x-2 hidden">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 gap-2">
          <BsTrophy />
          Budget Master
        </span>
      </div>
    </div>
  );
}