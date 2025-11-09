"use client";
import { useState, useEffect, useMemo } from "react";
import ExportButton from "../common/ExportButton";
import { authFetch } from "@/lib/authFetch";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#14b8a6", // Teal
];

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month"); // month, year, all

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await authFetch("/api/expenses");
      const data = await res.json();
      const expensesData = data.expenses || data.data || [];
      setExpenses(expensesData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter expenses based on selected period
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (selectedPeriod === "month") {
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      } else if (selectedPeriod === "year") {
        return expenseDate.getFullYear() === currentYear;
      }
      return true; // all
    });
  }, [expenses, selectedPeriod]);

  // Calculate category breakdown
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Uncategorized";
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  // Calculate monthly trends (for year view)
  const monthlyTrends = useMemo(() => {
    const monthlyTotals = {};
    const now = new Date();
    const currentYear = now.getFullYear();

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(currentYear, i).toLocaleDateString("en-US", {
        month: "short",
      });
      monthlyTotals[monthName] = 0;
    }

    // Calculate totals
    expenses
      .filter((expense) => new Date(expense.date).getFullYear() === currentYear)
      .forEach((expense) => {
        const monthName = new Date(expense.date).toLocaleDateString("en-US", {
          month: "short",
        });
        monthlyTotals[monthName] += expense.amount;
      });

    return Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total: parseFloat(total.toFixed(2)),
    }));
  }, [expenses]);

  // Calculate daily spending (for month view)
  const dailySpending = useMemo(() => {
    const dailyTotals = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Initialize all days
    for (let i = 1; i <= daysInMonth; i++) {
      dailyTotals[i] = 0;
    }

    // Calculate totals
    filteredExpenses.forEach((expense) => {
      const day = new Date(expense.date).getDate();
      dailyTotals[day] += expense.amount;
    });

    return Object.entries(dailyTotals).map(([day, total]) => ({
      day: `Day ${day}`,
      total: parseFloat(total.toFixed(2)),
    }));
  }, [filteredExpenses]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;
    const highest = Math.max(...filteredExpenses.map((exp) => exp.amount), 0);
    const lowest = filteredExpenses.length > 0
      ? Math.min(...filteredExpenses.map((exp) => exp.amount))
      : 0;

    return {
      total: total.toFixed(2),
      average: average.toFixed(2),
      highest: highest.toFixed(2),
      lowest: lowest.toFixed(2),
      count: filteredExpenses.length,
    };
  }, [filteredExpenses]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector and Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-4">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedPeriod === "month"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod("year")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedPeriod === "year"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => setSelectedPeriod("all")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedPeriod === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            All Time
          </button>
          </div>
          <div className="flex gap-3">
            <ExportButton expenses={filteredExpenses} variant="csv" />
            <ExportButton expenses={filteredExpenses} variant="json" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${stats.average}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Highest</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${stats.highest}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lowest</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${stats.lowest}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.count}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedPeriod === "month" ? "Daily Spending" : "Monthly Trend"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={selectedPeriod === "month" ? dailySpending : monthlyTrends}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey={selectedPeriod === "month" ? "day" : "month"}
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Spending Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-300 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
