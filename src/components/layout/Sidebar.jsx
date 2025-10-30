import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside 
      className="w-64 bg-[#FFFFFF] dark:bg-[#1F2937] shrink-0 shadow-lg md:flex flex-col"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-6 text-2xl font-bold text-[#6366F1]">
        <h1>Expense Tracker</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2" role="menubar" aria-label="Main menu">
        <Link 
          className="flex items-center px-4 py-2 text-[#1F2937] dark:text-[#F9FAFB] hover:bg-[#6366F1]/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]" 
          href="/"
          role="menuitem"
          aria-label="Go to Dashboard"
        >
          Dashboard
        </Link>
        <Link 
          className="flex items-center px-4 py-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#6366F1]/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]" 
          href="/expenses"
          role="menuitem"
          aria-label="Go to Expenses page"
        >
          Expenses
        </Link>
        <Link 
          className="flex items-center px-4 py-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#6366F1]/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]" 
          href="/analytics"
          role="menuitem"
          aria-label="Go to Analytics page"
        >
          Analytics
        </Link>
        <a 
          className="flex items-center px-4 py-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#6366F1]/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]" 
          href="#"
          role="menuitem"
          aria-label="Go to Settings"
        >
          Settings
        </a>
      </nav>
    </aside>
  );
}