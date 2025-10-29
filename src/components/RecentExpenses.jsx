"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { BsFillPencilFill, BsTrash3 } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FilterModal from "./FilterModal";
import ExpenseList from "./ExpenseList";
import Sortbtn from "./Sortbtn";

// Move constants OUTSIDE component - this prevents recreation on every render
export default function RecentExpenses({ initialExpenses }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIX: Renamed from useFilterDate (was confusing - not a hook!)
  const [filterDate, setFilterDate] = useState({
    filterDay: "",
    filterMonth: "",
    filterYear: "",
  });

  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const pathname = usePathname();

  // Refs for click-outside detection
  const filterModalRef = useRef(null);
  const sortModalRef = useRef(null);

  useEffect(() => {
    if (!initialExpenses) {
      const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/expenses");
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
          }
          const data = await res.json();
          setExpenses(data.data);
        } catch (error) {
          console.error("Failed to fetch expenses:", error);
          setError("Failed to load expenses. Please refresh the page.");
        } finally {
          setLoading(false);
        }
      };

      fetchExpenses();
    }
  }, [initialExpenses]);

  // Close modal on ESC key press - ACCESSIBILITY WIN!
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowFilterModal(false);
        setShowSortModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target)
      ) {
        setShowFilterModal(false);
      }
      if (
        sortModalRef.current &&
        !sortModalRef.current.contains(event.target)
      ) {
        setShowSortModal(false);
      }
    };

    if (showFilterModal || showSortModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterModal, showSortModal]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete expense. Please try again.");
    }
  };

  // CRITICAL FIX: Wrap in useCallback to prevent unnecessary recalculations
  const getFilteredExpenses = useCallback(() => {
    let filtered = expenses;

    if (filterDate.filterYear) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          !isNaN(expenseDate.getTime()) &&
          expenseDate.getFullYear() === parseInt(filterDate.filterYear)
        );
      });
    }

    if (filterDate.filterMonth !== "") {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          !isNaN(expenseDate.getTime()) &&
          expenseDate.getMonth() === parseInt(filterDate.filterMonth)
        );
      });
    }

    if (filterDate.filterDay) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          !isNaN(expenseDate.getTime()) &&
          expenseDate.getDate() === parseInt(filterDate.filterDay)
        );
      });
    }
    return filtered;
  }, [
    expenses,
    filterDate.filterYear,
    filterDate.filterMonth,
    filterDate.filterDay,
  ]);

  const getSortedExpenses = useCallback(
    (filteredExpenses) => {
      return [...filteredExpenses].sort((a, b) => {
        let compareA, compareB;

        switch (sortBy) {
          case "amount":
            compareA = parseFloat(a.amount);
            compareB = parseFloat(b.amount);
            break;
          case "description":
            compareA = a.description.toLowerCase();
            compareB = b.description.toLowerCase();
            break;
          case "category":
            compareA = a.category.toLowerCase();
            compareB = b.category.toLowerCase();
            break;
          case "date":
          default:
            compareA = new Date(a.date);
            compareB = new Date(b.date);
            break;
        }

        let comparison = 0;
        if (compareA > compareB) {
          comparison = 1;
        } else if (compareA < compareB) {
          comparison = -1;
        }

        return sortOrder === "desc" ? comparison * -1 : comparison;
      });
    },
    [sortBy, sortOrder]
  );

  const currentFilteredExpenses = useMemo(
    () => getFilteredExpenses(),
    [getFilteredExpenses]
  );

  const currentSortedExpenses = useMemo(
    () => getSortedExpenses(currentFilteredExpenses),
    [getSortedExpenses, currentFilteredExpenses]
  );

  const expensesToDisplay = useMemo(
    () =>
      pathname !== "/expenses"
        ? currentSortedExpenses.slice(0, 10)
        : currentSortedExpenses,
    [currentSortedExpenses, pathname]
  );

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-500/20 dark:border-gray-400/20 relative">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Expenses
        </h2>
        {pathname === "/expenses" && (
          <div className="flex gap-2">
            <Sortbtn
              showSortModal={showSortModal}
              setShowSortModal={setShowSortModal}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortModalRef={sortModalRef}
            />
            <FilterModal
              showFilterModal={showFilterModal}
              setShowFilterModal={setShowFilterModal}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              filterModalRef={filterModalRef}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Loading expenses...
        </div>
      ) : (
        <ul className="divide-y divide-gray-500/20 dark:divide-gray-400/20">
          <ExpenseList
            expensesToDisplay={expensesToDisplay}
            handleDelete={handleDelete}
            pathname={pathname}
          />
        </ul>
      )}


    </div>
  );
}
