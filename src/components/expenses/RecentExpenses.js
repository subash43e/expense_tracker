"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import useModalState from "@/hooks/useModalState";
import ExpenseFilters from "./ExpenseFilters";
import ExpenseList from "./ExpenseList";
import GroupedExpenseList from "./GroupedExpenseList";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import ExportButton from "../export/ExportButton";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/common/Toast";
import styles from "@/styles/RecentExpenses.module.css";

export default function RecentExpenses({
  expenses = [],
  setExpenses = () => {},
  loading,
  error,
  onRefreshNeeded,
}) {

  const {
    showFilterModal,
    setShowFilterModal,
    showSortModal,
    setShowSortModal,
    filterModalRef,
    sortModalRef,
  } = useModalState();

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
  const { toast } = useToast();

  const expensesList = Array.isArray(expenses) ? expenses : [];

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
  }, [setShowFilterModal, setShowSortModal]);

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
  }, [showFilterModal, showSortModal, filterModalRef, sortModalRef, setShowFilterModal, setShowSortModal]);

  // Open delete confirmation modal
  const handleDelete = (id) => {
    const expense = expensesList.find((exp) => exp._id === id);
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  // Perform actual deletion
  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    const id = expenseToDelete._id;
    const previousExpenses = expensesList.slice();

    try {
      setIsDeleting(true);
      
      // Optimistically update UI immediately
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      setDeleteModalOpen(false);

      // Ensure id is a string
      const expenseId = typeof id === 'object' ? id.toString() : id;
      
      const res = await authFetch(`/api/expenses/${expenseId}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete expense");
      }

      if (onRefreshNeeded) {
        await onRefreshNeeded();
      }
    } catch (err) {
      // Rollback on error
      console.error("Failed to delete expense:", err);
      setExpenses(previousExpenses);
      toast({
        title: "Error",
        description: `Failed to delete expense: ${err.message}`,
        variant: "destructive",
        duration: 5000, // Auto-hide after 5 seconds
      });
    } finally {
      setIsDeleting(false);
      setExpenseToDelete(null);
    }
  };

  // CRITICAL FIX: Wrap in useCallback to prevent unnecessary recalculations
  const getFilteredExpenses = useCallback(() => {
  let filtered = expensesList;

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
  expensesList,
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
      <div className={styles.recentExpensesContainer}>
        <div className={styles.noExpenses}>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recentExpensesContainer}>
      {/* Export buttons for /expenses page */}
      {pathname === "/expenses" && (
        <div className="flex justify-end gap-3 mb-4">
          <ExportButton expenses={expenses} variant="csv" />
          <ExportButton expenses={expenses} variant="json" />
        </div>
      )}
      
      <ExpenseFilters
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        showSortModal={showSortModal}
        setShowSortModal={setShowSortModal}
        filterModalRef={filterModalRef}
        sortModalRef={sortModalRef}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {loading ? (
        <div className={styles.loadingMessage}>
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
              onDelete={handleDelete}
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
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ),
  setExpenses: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefreshNeeded: PropTypes.func,
};
