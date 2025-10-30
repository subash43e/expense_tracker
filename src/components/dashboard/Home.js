"use client"
import { useState } from "react";
import AddExpense from "./AddExpense";
import BudgetProgress from "./BudgetProgress";
import RecentExpenses from "../expenses/RecentExpenses";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl text-gray-900 font-semibold mb-4 dark:text-white">Budget Progress</h2>
          <BudgetProgress key={refreshKey} />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl text-gray-900 font-semibold mb-4 dark:text-white">Add Expense</h2>
          <AddExpense onSuccess={() => setRefreshKey(prev => prev + 1)} />
        </section>
        <section className="">
          <h2 className="text-2xl text-gray-900 font-semibold mb-4 dark:text-white">Recent Expenses</h2>
          <RecentExpenses key={refreshKey} />
        </section>
      </main>
    </div>
  );
}