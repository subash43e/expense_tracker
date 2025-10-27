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
    <div className="bg-[#FFFFFF] dark:bg-[#1F2937] p-6 rounded-lg shadow-md border border-slate-300">
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <input
              className="w-full bg-[#F3F4F6] dark:bg-[#111827] border border-[#6B7280]/30 dark:border-[#9CA3AF]/30 rounded-md focus:ring-#6366F1 focus:border-#6366F1 h-8 text-black placeholder:pl-2 pl-2"
              id="description"
              name="description"
              placeholder="e.g. Coffee with friends"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="">
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1 "
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="w-full bg-[#F3F4F6] dark:bg-[#111827]  border border-[#6B7280]/30 dark:border-[#9CA3AF]/30 rounded-md focus:ring-#6366F1 focus:border-#6366F1 text-black placeholder:pl-2 pl-2 h-8"
              id="amount"
              name="amount"
              placeholder="$0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="">
            <label
              className="block text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <input
              className="w-full bg-[#F3F4F6] dark:bg-[#111827] border border-[#6B7280]/30 dark:border-[#9CA3AF]/30 rounded-md focus:ring-#6366F1 focus:border-#6366F1 text-black placeholder:pl-2 pl-2 h-8"
              id="category"
              name="category"
              placeholder="e.g. Food"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="border bg-[#6366F1] text-[#F9FAFB] px-6 py-2 rounded-lg shadow hover:bg-[#6366F1]/90 transition w-full md:w-auto"
            type="submit"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}