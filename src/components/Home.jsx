"use client"
import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import RecentExpenses from "./RecentExpenses";
import Sidebar from "./Sidebar";
import BudgetProgress from "./BudgetProgress";


export default function Home() {
  const [useDark, setDark] = useState(false);

  useEffect(() => {
    // Check for saved preference in localStorage
    const isDark = localStorage.getItem('useDark') === 'true';
    setDark(isDark);
  }, []);

  useEffect(() => {
    // Apply the theme class to the <html> element and save preference
    if (useDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('useDark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('useDark', 'false');
    }
  }, [useDark]);

  function toggleDarkMode() {
    setDark(!useDark);
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
        </div>
        {/* <button type="button" onClick={toggleDarkMode} className="bg-red-300 border">btn</button> */}
        <section className="mb-10">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Add Expense</h2>
          <BudgetProgress />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Add Expense</h2>
          <AddExpense />
        </section>
        <section>
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Recent Expenses</h2>
          <RecentExpenses />
        </section>
      </main>
    </div>
  );
}