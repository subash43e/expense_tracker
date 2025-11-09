"use client";
import PropTypes from "prop-types";

export const exportToCSV = (expenses, filename = "expenses.csv") => {
  if (!expenses || expenses.length === 0) {
    alert("No expenses to export");
    return;
  }

  const headers = ["Date", "Description", "Category", "Amount"];
  
  const rows = expenses.map((expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    const description = `"${expense.description.replace(/"/g, '""')}"`;
    const category = `"${expense.category.replace(/"/g, '""')}"`;
    const amount = expense.amount;
    return [date, description, category, amount].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (expenses, filename = "expenses.json") => {
  if (!expenses || expenses.length === 0) {
    alert("No expenses to export");
    return;
  }

  const json = JSON.stringify(expenses, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ExportButton({ expenses, variant = "csv" }) {
  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    if (variant === "csv") {
      exportToCSV(expenses, `expenses_${timestamp}.csv`);
    } else if (variant === "json") {
      exportToJSON(expenses, `expenses_${timestamp}.json`);
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        variant === "csv"
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        variant === "csv" ? "focus:ring-green-500" : "focus:ring-blue-500"
      }`}
      disabled={!expenses || expenses.length === 0}
    >
      <span className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export {variant.toUpperCase()}
      </span>
    </button>
  );
}

ExportButton.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    })
  ).isRequired,
  variant: PropTypes.oneOf(["csv", "json"]),
};
