import EditExpense from "@/components/expenses/EditExpense";
import { getExpenseById } from "@/lib/expenses";
import { notFound } from "next/navigation";

export default async function EditExpensePage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  let expense;
  try {
    const data = await getExpenseById(id);
    if (!data) {
      notFound();
    }
    expense = JSON.parse(JSON.stringify(data));
  } catch (error) {
    notFound();
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900 p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-black dark:text-white pb-5">
        Edit Expense
      </h1>
      <EditExpense expense={expense} />
    </div>
  );
}
