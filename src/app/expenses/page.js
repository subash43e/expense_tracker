import ExpensesPageClient from "@/components/expenses/ExpensesPageClient";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ExpensesPage() {
  return (
    <ProtectedRoute>
      <ExpensesPageClient />
    </ProtectedRoute>
  );
}
