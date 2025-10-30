import Home from "@/components/dashboard/Home";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
