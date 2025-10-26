import RecentExpenses from "@/components/RecentExpenses";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export default async function ExpensesPage() {
  await dbConnect();
  const result = await Expense.find({}).sort({ data: -1 });
  const expenses = JSON.parse(JSON.stringify(result));

  return (
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-white">All Expenses</h1>
      <RecentExpenses initialExpenses={expenses} />
    </div>
  );
}
