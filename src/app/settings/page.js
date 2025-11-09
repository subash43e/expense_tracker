"use client";

import DarkModeToggle from "@/components/layout/DarkModeToggle";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ExportButton from "@/components/common/ExportButton";
import useFetchExpenses from "@/hooks/useFetchExpenses";
import { authFetch } from "@/lib/authFetch";

export default function SettingsPage() {
  const { expenses, loading } = useFetchExpenses();
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your application preferences
            </p>
          </div>

          {/* Appearance Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Appearance
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between light and dark theme
                  </p>
                </div>
                <DarkModeToggle />
              </div>
            </div>
          </div>

          {/* Additional Settings Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notifications
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      Budget Alerts
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when you exceed your budget
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 opacity-50"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      Weekly Summary
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive weekly spending summaries
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 opacity-50"></div>
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Note: Notification features are coming soon
              </p>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Management
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Download all your expense data in CSV or JSON format
                  </p>
                  <div className="flex gap-3">
                    <ExportButton expenses={expenses} variant="csv" />
                    <ExportButton expenses={expenses} variant="json" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-medium text-red-600 dark:text-red-400 mb-1">
                    Delete All Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Permanently delete all your expenses and data
                  </p>
                  <button
                    className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "Are you sure you want to delete all your data? This action cannot be undone."
                        )
                      )
                        return;
                      try {
                        const res = await authFetch("/api/expenses/deleteAll", {
                          method: "POST",
                        });
                        if (!res.ok) throw new Error("Failed to delete data");
                        alert("All your data has been deleted.");
                        window.location.reload();
                      } catch (err) {
                        alert("Error: " + err.message);
                      }
                    }}
                  >
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
