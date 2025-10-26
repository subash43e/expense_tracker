import RecentExpenses from "@/components/RecentExpenses";

export default function ExpensesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-white">All Expenses</h1>
      <RecentExpenses showAll={true} />
    </div>
  );
}
