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
  const [resolvedId, setResolvedId] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setResolvedId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;

    const fetchExpense = async () => {
      try {
        const res = await authFetch(`/api/expenses/${resolvedId}`);
        if (!res.ok) {
          router.push('/expenses');
          return;
        }
        const data = await res.json();
        setExpense(data.data);
      } catch (error) {
        console.error("Failed to fetch expense:", error);
        router.push('/expenses');
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
