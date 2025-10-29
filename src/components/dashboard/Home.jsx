"use client"
import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import BudgetProgress from "./BudgetProgress";
import { usePathname } from 'next/navigation';
import RecentExpenses from "../expenses/RecentExpenses";


export default function Home() {
  const [useDark, setDark] = useState(false);

  useEffect(() => {
    // Check for saved preference in localStorage
    const isDark = localStorage.getItem('useDark') === 'true';
    setDark(isDark);
  }, []);
  //#region use Effect
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




  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 p-4">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Add Expense</h2>
          <BudgetProgress />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Add Expense</h2>
          <AddExpense />
        </section>
        <section className="">
          <h2 className="text-2xl text-black font-semibold mb-4 dark:text-white">Recent Expenses</h2>
          <RecentExpenses />
        </section>
      </main>
    </div>
  );
}