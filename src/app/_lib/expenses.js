import dbConnect from "@lib/db";
import Expense from "@models/Expense";

/**
 * Convert MongoDB document to plain object with stringified ObjectIds
 */
function serializeDocument(doc) {
  if (!doc) return null;
  
  const serialized = JSON.parse(JSON.stringify(doc));
  return serialized;
}

/**
 * Serialize an array of MongoDB documents
 */
function serializeDocuments(docs) {
  if (!docs || !Array.isArray(docs)) return [];
  
  return JSON.parse(JSON.stringify(docs));
}

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
    expenses: serializeDocuments(expenses),
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
  const expenses = await Expense.find({ userId }).sort({ date: -1 }).lean();
  return serializeDocuments(expenses);
}

export async function createExpense(data) {
  await dbConnect();
  if (!data.userId) {
    throw new Error('userId is required');
  }
  const expense = await Expense.create(data);
  return serializeDocument(expense.toObject());
}

export async function getExpenseById(id, userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  const expense = await Expense.findOne({ _id: id, userId }).lean();
  return serializeDocument(expense);
}

export async function updateExpense(id, userId, data) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  const expense = await Expense.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  return serializeDocument(expense ? expense.toObject() : null);
}

export async function deleteExpense(id, userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  const expense = await Expense.findOneAndDelete({ _id: id, userId });
  return serializeDocument(expense ? expense.toObject() : null);
}

export async function deleteAllExpenses(userId) {
  await dbConnect();
  if (!userId) {
    throw new Error('userId is required');
  }
  const result = await Expense.deleteMany({ userId });
  return { deletedCount: result.deletedCount };
}
