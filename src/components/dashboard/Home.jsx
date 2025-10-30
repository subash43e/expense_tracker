"use client"
import { useEffect, useState, useCallback } from "react";
import AddExpense from "./AddExpense";
import BudgetProgress from "./BudgetProgress";
import RecentExpenses from "../expenses/RecentExpenses";


export default function Home() {
  const [useDark, setDark] = useState(() => {
    // Initialize from localStorage during initial render
    if (typeof window !== 'undefined') {
      return localStorage.getItem('useDark') === 'true';
    }
    return false;
  });
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (useDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('useDark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('useDark', 'false');
    }
  }, [useDark]);




  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 p-4">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Budget Progress</h2>
          <BudgetProgress />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Add Expense</h2>
          <AddExpense onSuccess={() => setRefreshKey(prev => prev + 1)} />
        </section>
        <section className="">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Recent Expenses</h2>
          <RecentExpenses key={refreshKey} />
        </section>
      </main>
    </div>
  );
}