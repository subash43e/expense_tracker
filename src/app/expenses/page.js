import ExpensesPageClient from "@/components/expenses/ExpensesPageClient";
import { getAllExpensesSimple } from "@/lib/expenses";

export default async function ExpensesPage() {
  const data = await getAllExpensesSimple();
  const expenses = JSON.parse(JSON.stringify(data));
  return <ExpensesPageClient initialExpenses={expenses} />;
}
