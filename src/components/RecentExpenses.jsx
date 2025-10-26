"use client";
import { useEffect, useState } from "react";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data.data);
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setExpenses(expenses.filter((expense) => expense._id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300">
      <ul className="divide-y divide-gray-500/20 dark:divide-gray-400/20">
        {expenses.map((expense) => (
          <li
            key={expense._id}
            className="p-4 flex justify-between items-center hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10"
          >
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-50">
                {expense.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${expense.amount}
              </p>
            </div>
            <div className="flex items-center">
              <span className=" text-gray-500 dark:text-gray-400 mr-10">
                {expense.category}
              </span>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500   ">
                <span className="material-icons-outlined text-xl">< BsFillPencilFill /></span>
              </button>
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                onClick={() => handleDelete(expense._id)}
              >
                <span className="material-icons-outlined text-xl"><BsTrash3 /></span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}