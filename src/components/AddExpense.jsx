"use client";
import { useState } from "react";

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, amount, category }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: "success", text: "Expense added successfully!" });
      setDescription("");
      setAmount("");
      setCategory("");
    } else {
      setMessage({ type: "error", text: data.message || "Something went wrong!" });
    }
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md">
      {message && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg ${message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}
      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        onSubmit={handleSubmit}
      >
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <input
            className="w-full bg-[#F3F4F6] dark:bg-[#111827] border border-[#6B7280]/30 dark:border-[#9CA3AF]/30 rounded-md focus:ring-#6366F1 focus:border-#6366F1"
            id="description"
            name="description"
            placeholder="e.g. Coffee with friends"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            className="w-full bg-[#F3F4F6] dark:bg-[#111827]  border border-[#6B7280]/30 dark:border-[#9CA3AF]/30 rounded-md focus:ring-#6366F1 focus:border-#6366F1"
            id="amount"
            name="amount"
            placeholder="$0.00"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
            htmlFor="category"
          >
            Category
          </label>
          <input
            className="w-full bg-[#F3F4F6] dark:bg-[#111827] border border-[#6B7280]/30 dark:border-[#9CA3AF]/30 rounded-md focus:ring-#6366F1 focus:border-#6366F1"
            id="category"
            name="category"
            placeholder="e.g. Food"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <button
          className="border md:col-start-4 bg-[#6366F1] text-[#F9FAFB] px-4 py-2 rounded-lg justify-center flex items-center shadow hover:bg-#6366F1/90 transition w-full md:w-auto"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
}