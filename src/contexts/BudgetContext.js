"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "@/lib/authFetch";

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudget = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authFetch("/api/budgets");
      const data = await res.json();

      if (res.ok && data.budget) {
        setBudget(data.budget);
      } else {
        setBudget(null);
      }
    } catch (err) {
      console.error("Error fetching budget:", err);
      setError(err.message);
      setBudget(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const value = {
    budget,
    currency: budget?.currency || "USD",
    monthlyLimit: budget?.monthlyLimit || null,
    isLoading,
    error,
    refetch: fetchBudget,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
}
