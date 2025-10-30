import EditExpenseModal from "@/components/expenses/EditExpenseModal";
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
    <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      <EditExpenseModal expense={expense} />
    </div>
  );
}
