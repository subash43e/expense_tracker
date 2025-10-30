"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import FilterModal from "../filters-and-sorts/FilterModal";
import ExpenseList from "./ExpenseList";
import GroupedExpenseList from "./GroupedExpenseList";
import SortControls from "../filters-and-sorts/SortControls";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";

// Move constants OUTSIDE component - this prevents recreation on every render
export default function RecentExpenses({ initialExpenses, onRefreshNeeded }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch expenses function
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "100",
        sortBy: sortBy || "date",
        sortOrder: sortOrder || "desc",
      });

      const res = await fetch(`/api/expenses?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      
      // Handle both response formats: paginated (data.expenses) and simple (data.data)
      if (data.expenses && Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
      } else if (data.data && Array.isArray(data.data)) {
        setExpenses(data.data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setError("Failed to load expenses. Please refresh the page.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setExpenses, sortBy, sortOrder]);

  useEffect(() => {
    if (!initialExpenses) {
      fetchExpenses();
    }
  }, [initialExpenses, refreshTrigger, fetchExpenses]);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(e.target)
      ) {
        setShowFilterModal(false);
      }
      if (sortModalRef.current && !sortModalRef.current.contains(e.target)) {
        setShowSortModal(false);
      }
    };

    if (showFilterModal || showSortModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterModal, showSortModal]);

  // Open delete confirmation modal
  const handleDelete = (id) => {
    const expense = expenses.find((exp) => exp._id === id);
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  // Perform actual deletion
  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    const id = expenseToDelete._id;
    const previousExpenses = [...expenses];

    try {
      setIsDeleting(true);
      
      // Optimistically update UI immediately
      setExpenses(expenses.filter((expense) => expense._id !== id));
      setDeleteModalOpen(false);

      // Ensure id is a string
      const expenseId = typeof id === 'object' ? id.toString() : id;
      
      const res = await fetch(`/api/expenses/${expenseId}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete expense");
      }
    } catch (err) {
      // Rollback on error
      console.error("Failed to delete expense:", err);
      setExpenses(previousExpenses);
      alert(`Failed to delete expense: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setExpenseToDelete(null);
    }
  };

  // CRITICAL FIX: Wrap in useCallback to prevent unnecessary recalculations
  const getFilteredExpenses = useCallback(() => {
    let filtered = expenses;

    // Search filter - check description, category, and amount
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((expense) => {
        const description = expense.description?.toLowerCase() || "";
        const category = expense.category?.toLowerCase() || "";
        const amount = expense.amount?.toString() || "";
        
        return (
          description.includes(query) ||
          category.includes(query) ||
          amount.includes(query)
        );
      });
    }

    // Date filters
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
    searchQuery,
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
      <div className="p-4 border-b border-gray-500/20 dark:border-gray-400/20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Expenses
          </h2>
          {pathname === "/expenses" && (
            <div className="flex gap-2">
              <SortControls
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
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by description, category, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Loading expenses...
        </div>
      ) : (
        <ul className="divide-y divide-gray-500/20 dark:divide-gray-400/20">
          {pathname === "/expenses" ? (
            <GroupedExpenseList
              expensesToDisplay={expensesToDisplay}
              handleDelete={handleDelete}
            />
          ) : (
            <ExpenseList
              expensesToDisplay={expensesToDisplay}
              handleDelete={handleDelete}
              pathname={pathname}
            />
          )}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={confirmDelete}
        expenseName={expenseToDelete?.description}
        isDeleting={isDeleting}
      />
    </div>
  );
}

RecentExpenses.propTypes = {
  initialExpenses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    })
  ),
  onRefreshNeeded: PropTypes.func,
};
