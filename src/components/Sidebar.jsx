export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#FFFFFF] dark:bg-[#1F2937] shrink-0 shadow-lg hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold text-[#6366F1]">
        Expense Tracker
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <a className="flex items-center px-4 py-2 text-[#1F2937] dark:text-[#F9FAFB] hover:bg-[#6366F1]/10 rounded-lg" href="#">
          Dashboard
        </a>
        <a className="flex items-center px-4 py-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#6366F1]/10 rounded-lg" href="#">
          Expenses
        </a>
        <a className="flex items-center px-4 py-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#6366F1]/10 rounded-lg" href="#">
          Settings
        </a>
      </nav>
    </aside>
  );
}