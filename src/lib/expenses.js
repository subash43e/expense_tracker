import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

/**
 * Fetch all expenses with pagination, sorting, and filtering options.
 * @param {Object} options - Query options.
 * @param {number} [options.page=1] - Page number for pagination.
 * @param {number} [options.limit=100] - Number of items per page.
 * @param {string} [options.sortBy="date"] - Field to sort by.
 * @param {string} [options.sortOrder="desc"] - Sort order ("asc" or "desc").
 * @param {string|null} [options.category=null] - Filter by category.
 * @returns {Promise<Object>} - Paginated expenses and metadata.
 */
export async function getAllExpenses(options = {}) {
  await dbConnect();

  const {
    page = 1,
    limit = 100,
    sortBy = "date",
    sortOrder = "desc",
    category = null,
  } = options;

  const query = category ? { category } : {};
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort(sort).limit(limit).skip(skip).lean(),
    Expense.countDocuments(query),
  ]);

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

/**
 * Fetch all expenses without pagination.
 * @returns {Promise<Array>} - List of all expenses.
 */
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
