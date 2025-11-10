"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditExpenseModal from "@/components/expenses/EditExpenseModal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { authFetch } from "@/lib/authFetch";

export default function EditExpensePage({ params }) {
  const router = useRouter();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedId, setResolvedId] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        if (!resolvedParams?.id) {
          throw new Error("Invalid expense ID");
        }
        setResolvedId(resolvedParams.id);
      } catch (err) {
        console.error("Failed to resolve params:", err);
        setError("Invalid expense ID");
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;

    const fetchExpense = async () => {
      try {
        const res = await authFetch(`/api/expenses/${resolvedId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Expense not found");
          } else {
            setError("Failed to load expense");
          }
          return;
        }
        const data = await res.json();
        setExpense(data.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch expense:", err);
        setError("An error occurred while loading the expense");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [resolvedId, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {error}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The expense you&apos;re looking for could not be loaded.
            </p>
            <button
              onClick={() => router.push('/expenses')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
            >
              Back to Expenses
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!expense) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
        <EditExpenseModal expense={expense} />
      </div>
    </ProtectedRoute>
  );
}
