import AddExpense from "./AddExpense";
import RecentExpenses from "./RecentExpenses";
import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
          <AddExpense />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>
          <RecentExpenses />
        </section>
      </main>
    </div>
  );
}