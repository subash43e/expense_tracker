"use client";
import { useEffect, useState, useMemo } from "react";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilterUi } from "./FilterUi";

export default function RecentExpenses({ initialExpenses }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false); // New state for sort modal

  // Initialize filter state with empty strings (no default filter)
  const [useFilterDate, setFilterDate] = useState({
    filterDay: "",
    filterMonth: "",
    filterYear: "",
  });

  // State for sorting criteria, default to latest date
  const [sortBy, setSortBy] = useState('date'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort descending (latest first)

  const pathname = usePathname();

  useEffect(() => {
    if (!initialExpenses) {
      const fetchExpenses = async () => {
        try {
          const res = await fetch("/api/expenses");
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setExpenses(data.data);
        } catch (error) {
          console.error("Failed to fetch expenses:", error);
          // Optionally, set an error state to display to the user
        }
      };

      fetchExpenses();
    }
  }, [initialExpenses]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to filter expenses based on selected criteria
  const getFilteredExpenses = () => {
    let filtered = expenses;

    if (useFilterDate.filterYear) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          !isNaN(expenseDate.getTime()) &&
          expenseDate.getFullYear() === parseInt(useFilterDate.filterYear)
        );
      });
    }

    if (useFilterDate.filterMonth !== "") {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          !isNaN(expenseDate.getTime()) &&
          expenseDate.getMonth() === parseInt(useFilterDate.filterMonth)
        );
      });
    }

    if (useFilterDate.filterDay) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          !isNaN(expenseDate.getTime()) &&
          expenseDate.getDate() === parseInt(useFilterDate.filterDay)
        );
      });
    }
    return filtered;
  };

  // Function to sort expenses based on selected criteria
  const getSortedExpenses = (filteredExpenses) => {
    return [...filteredExpenses].sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case 'amount':
          compareA = parseFloat(a.amount);
          compareB = parseFloat(b.amount);
          break;
        case 'description':
          compareA = a.description.toLowerCase();
          compareB = b.description.toLowerCase();
          break;
        case 'category':
          compareA = a.category.toLowerCase();
          compareB = b.category.toLowerCase();
          break;
        case 'date':
        default:
          compareA = new Date(a.date).getTime();
          compareB = new Date(b.date).getTime();
          break;
      }

      if (compareA < compareB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const currentFilteredExpenses = useMemo(() => getFilteredExpenses(), [
    expenses,
    useFilterDate.filterYear,
    useFilterDate.filterMonth,
    useFilterDate.filterDay,
  ]);

  const currentSortedExpenses = useMemo(() => getSortedExpenses(currentFilteredExpenses), [
    currentFilteredExpenses,
    sortBy,
    sortOrder,
  ]);

  const expensesToDisplay = useMemo(
    () =>
      pathname !== "/expenses"
        ? currentSortedExpenses.slice(0, 10)
        : currentSortedExpenses,
    [currentSortedExpenses, pathname]
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 flex flex-col">
      {/* Header with "Select Date Range" and "Sort By" buttons */}
      <div className="p-4 flex justify-between items-center border-b border-gray-500/20 dark:border-gray-400/20 relative">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Expenses
        </h2>
        {/* Conditionally render the filter and sort buttons and modals */}
        {pathname === "/expenses" && (
          <div className="flex gap-2"> {/* Container for buttons */}
            {/* Sort Button and Modal */}
            <div className="relative">
              <button
                onClick={() => setShowSortModal(true)}
                className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Sort By
              </button>

              {showSortModal && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative w-72">
                    <h3 className="text-lg font-bold mb-4 text-black dark:text-white">
                      Sort Expenses
                    </h3>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="sortBy" className="sr-only">Sort By:</label>
                      <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="description">Description</option>
                        <option value="category">Category</option>
                      </select>

                      <label htmlFor="sortOrder" className="sr-only">Sort Order:</label>
                      <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => setShowSortModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button and Modal */}
            <div className="relative">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Select Date Range
              </button>

              {showFilterModal && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl relative w-72">
                    <h3 className="text-lg font-bold mb-4 text-black dark:text-white">
                      Filter Expenses by Date
                    </h3>
                    <FilterUi
                      filterDay={useFilterDate.filterDay}
                      setFilterDate={setFilterDate}
                      filterMonth={useFilterDate.filterMonth}
                      filterYear={useFilterDate.filterYear}
                      monthNames={monthNames}
                    />
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => setShowFilterModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ul className="divide-y divide-gray-500/20 dark:divide-gray-400/20">
        {expensesToDisplay.map((expense) => (
          <li
            key={expense._id}
            className="p-4 flex justify-between items-center hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10"
          >
            <div>
              <p className="font-medium text-black dark:text-gray-50">
                {expense.description}
              </p>
              <p className="text-sm text-black dark:text-gray-400">
                ${expense.amount}
              </p>
            </div>
            <div className="flex items-center">
              <span className=" text-black dark:text-gray-400 mr-10">
                {expense.category}
              </span>
              <button className="p-2 text-black dark:text-gray-400 hover:text-indigo-500   ">
                <span className="material-icons-outlined text-xl">
                  <BsFillPencilFill />
                </span>
              </button>
              <button
                className="p-2 text-black dark:text-gray-400 hover:text-red-500"
                onClick={() => handleDelete(expense._id)}
              >
                <span className="material-icons-outlined text-xl">
                  <BsTrash3 />
                </span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 text-center">
        {pathname !== "/expenses" ? (
          <Link href="/expenses" className="text-indigo-500 hover:underline">
            Show More
          </Link>
        ) : null}
      </div>
    </div>
  );
}
