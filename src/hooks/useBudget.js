import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/lib/authFetch";

export default function useBudget() {
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudget = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchBudget();

    const handleBudgetUpdate = () => {
      fetchBudget();
    };
    window.addEventListener("budgetUpdated", handleBudgetUpdate);

    return () => {
      window.removeEventListener("budgetUpdated", handleBudgetUpdate);
    };
  }, [fetchBudget]);

  return {
    budget,
    currency: budget?.currency || "USD",
    monthlyLimit: budget?.monthlyLimit || null,
    isLoading,
    error,
    refetch: fetchBudget,
  };
}
