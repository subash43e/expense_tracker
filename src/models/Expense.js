
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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
expenseSchema.index({ userId: 1, date: -1 }); // Most common query: user's expenses sorted by date
expenseSchema.index({ userId: 1, category: 1 }); // For filtering by user and category
expenseSchema.index({ userId: 1, date: -1, category: 1 }); // Compound index for user + date + category queries

const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
