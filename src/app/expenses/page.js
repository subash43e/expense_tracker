import RecentExpenses from "@/components/expenses/RecentExpenses";
import { getAllExpensesSimple } from "@/lib/expenses";

export default async function ExpensesPage() {
  const data = await getAllExpensesSimple();
  const expenses = JSON.parse(JSON.stringify(data));
  return (
    <div className=" bg-slate-100 dark:bg-slate-900 p-4">
      <h1 className="text-3xl font-bold text-black dark:text-white pb-5">
        All Expenses
      </h1>
      <RecentExpenses initialExpenses={expenses} />
    </div>
  );
}
