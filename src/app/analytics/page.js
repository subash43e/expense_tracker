import Analytics from "@/components/analytics/Analytics";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize your spending patterns and track your financial trends
            </p>
          </div>
          <Analytics />
        </div>
      </div>
    </ProtectedRoute>
  );
}
