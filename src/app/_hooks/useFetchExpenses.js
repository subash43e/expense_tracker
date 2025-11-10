import { useState, useCallback } from "react";
import { authFetch } from "@lib/authFetch";

export default function useFetchExpenses(initialExpenses) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async (queryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(queryParams).toString();
      const res = await authFetch(`/api/expenses?${query}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setExpenses(data.expenses || data.data || []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setExpenses, setError, setLoading]);

  return { expenses, setExpenses, loading, error, fetchExpenses };
}