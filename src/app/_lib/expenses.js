import dbConnect from "@lib/db";
import Expense from "@models/Expense";

export async function getAllExpenses(options = {}) {
  await dbConnect();

  const {
    userId,
    page = 1,
    limit = 100,
    sortBy = "date",
    sortOrder = "desc",
    category = null,
  } = options;

  if (!userId) {
    throw new Error('userId is required');
  }

  const query = { userId };
  if (category) {
    query.category = category;
  }

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

export async function getAllExpensesSimple(userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  return Expense.find({ userId }).sort({ date: -1 }).lean();
}

export async function createExpense(data) {
  await dbConnect();
  if (!data.userId) {
    throw new Error('userId is required');
  }
  return Expense.create(data);
}

export async function getExpenseById(id, userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  return Expense.findOne({ _id: id, userId });
}

export async function updateExpense(id, userId, data) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  return Expense.findOneAndUpdate({ _id: id, userId }, data, { new: true });
}

export async function deleteExpense(id, userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  return Expense.findOneAndDelete({ _id: id, userId });
}

export async function deleteAllExpenses(userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  const result = await Expense.deleteMany({ userId });
  return { deletedCount: result.deletedCount };
}
