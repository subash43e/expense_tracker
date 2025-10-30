import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export async function getAllExpenses(options = {}) {
  await dbConnect();
  
  const {
    page = 1,
    limit = 100,
    sortBy = "date",
    sortOrder = "desc",
    category = null,
  } = options;

  // Build query
  const query = {};
  if (category) {
    query.category = category;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  // Execute query with pagination
  const expenses = await Expense.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean(); // Use lean() for better performance when you don't need Mongoose documents

  // Get total count for pagination metadata
  const total = await Expense.countDocuments(query);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: skip + expenses.length < total,
    },
  };
}

// Keep simple version for backward compatibility
export async function getAllExpensesSimple() {
  await dbConnect();
  return Expense.find({}).sort({ date: -1 }).lean();
}

export async function createExpense(data) {
  await dbConnect();
  return Expense.create(data);
}

export async function getExpenseById(id) {
  await dbConnect();
  return Expense.findById(id);
}

export async function updateExpense(id, data) {
  await dbConnect();
  return Expense.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteExpense(id) {
  await dbConnect();
  return Expense.findByIdAndDelete(id);
}
