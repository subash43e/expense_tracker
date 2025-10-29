import RecentExpenses from "@/components/expenses/RecentExpenses";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export default async function ExpensesPage() {
  await dbConnect();
  const result = await Expense.find({}).sort({ data: -1 });
  const expenses = JSON.parse(JSON.stringify(result));

  return (
    <div className=" bg-slate-100 dark:bg-slate-900 p-4">
      <h1 className="text-3xl font-bold text-black dark:text-white pb-5">All Expenses</h1>
      <RecentExpenses initialExpenses={expenses} />
    </div>
  );
}
