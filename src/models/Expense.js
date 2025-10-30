
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add indexes for frequently queried fields to improve performance
expenseSchema.index({ date: -1 }); // For sorting by date (most common query)
expenseSchema.index({ category: 1 }); // For filtering by category
expenseSchema.index({ date: -1, category: 1 }); // Compound index for date + category queries

const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
