import { useState, useCallback } from "react";
import { getExpenses } from "@/app/(auth)/expenses/_actions/expenses";

export default function useFetchExpenses(initialExpenses) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async (queryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getExpenses(queryParams);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch expenses');
      }
      
      setExpenses(result.expenses || result.data || []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setExpenses, setError, setLoading]);

  return { expenses, setExpenses, loading, error, fetchExpenses };
}