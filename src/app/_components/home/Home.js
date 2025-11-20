"use client";
import { useEffect } from "react";
import AddExpense from "./AddExpense";
import BudgetProgress from "./BudgetProgress";
import RecentExpenses from "@/app/(auth)/expenses/_components/RecentExpenses";
import useFetchExpenses from "@hooks/useFetchExpenses";

export default function Home() {
  const { expenses, setExpenses, loading, error, fetchExpenses } =
    useFetchExpenses();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl text-gray-900 font-semibold mb-4 dark:text-white">
            Budget Progress
          </h2>
          <BudgetProgress
            expenses={expenses}
            isLoading={loading}
            error={error}
          />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl text-gray-900 font-semibold mb-4 dark:text-white">
            Add Expense
          </h2>
          <AddExpense onSuccess={fetchExpenses} />
        </section>
        <section>
          <h2 className="text-2xl text-gray-900 font-semibold mb-4 dark:text-white">
            Recent Expenses
          </h2>
          <RecentExpenses
            expenses={expenses}
            setExpenses={setExpenses}
            loading={loading}
            error={error}
            onRefreshNeeded={fetchExpenses}
          />
        </section>
      </main>
    </div>
  );
}
