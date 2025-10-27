"use client";
import { useEffect, useState } from "react";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilterUi } from "./FilterUi";

export default function RecentExpenses({ initialExpenses }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [isFilter, setFilter] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate.getMonth().toString();
  const currentDay = currentDate.getDate().toString();

  const [useFilterDate, setFilterDate] = useState({
    filterDay: currentDay,
    filterMonth: currentMonth,
    filterYear: currentYear,
  });

  useEffect(() => {
    if (!initialExpenses) {
      const fetchExpenses = async () => {
        const res = await fetch("/api/expenses");
        const data = await res.json();
        setExpenses(data.data);
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

  const currentFilteredExpenses = getFilteredExpenses();

  const expensesToDisplay =
    usePathname() !== "/expenses"
      ? currentFilteredExpenses.slice(0, 10)
      : currentFilteredExpenses;

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
      {/* Filter UI */}

      {/* <FilterUi
        filterDay={useFilterDate.filterDay}
        setFilterDate={setFilterDate}
        filterMonth={useFilterDate.filterMonth}
        filterYear={useFilterDate.filterYear}
        monthNames={monthNames}
      /> */}

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
        {usePathname() !== "/expenses" ? (
          <Link href="/expenses" className="text-indigo-500 hover:underline">
            Show More
          </Link>
        ) : null}
      </div>
    </div>
  );
}
