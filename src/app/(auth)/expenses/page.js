import ExpensesPageClient from "./_components/ExpensesPageClient";
import { ProtectedRoute } from "@components/common/ProtectedRoute";

export default function ExpensesPage() {
  return (
    <ProtectedRoute>
      <ExpensesPageClient />
    </ProtectedRoute>
  );
}
