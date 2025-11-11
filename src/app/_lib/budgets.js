import dbConnect from "@lib/db";
import Budget from "@models/Budget";
import { ApiError } from "@lib/api/utils";

/**
 * Convert MongoDB document to plain object with stringified ObjectIds
 */
function serializeDocument(doc) {
  if (!doc) return null;
  
  const serialized = JSON.parse(JSON.stringify(doc));
  return serialized;
}

export async function getBudgetByUserId(userId) {
  await dbConnect();

  const budget = await Budget.findOne({ userId }).lean();
  return serializeDocument(budget);
}

export async function createBudget(userId, budgetData) {
  await dbConnect();

  const existingBudget = await Budget.findOne({ userId });
  if (existingBudget) {
    throw new ApiError(400, "Budget already exists for this user");
  }

  const budget = await Budget.create({
    userId,
    ...budgetData,
  });

  return serializeDocument(budget.toObject());
}

export async function updateBudget(userId, updateData) {
  await dbConnect();

  const budget = await Budget.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return serializeDocument(budget.toObject());
}

export async function deleteBudget(userId) {
  await dbConnect();

  const budget = await Budget.findOneAndDelete({ userId });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return serializeDocument(budget.toObject());
}

export async function upsertBudget(userId, budgetData) {
  await dbConnect();

  const budget = await Budget.findOneAndUpdate(
    { userId },
    { $set: { userId, ...budgetData } },
    { new: true, upsert: true, runValidators: true }
  );

  return serializeDocument(budget.toObject());
}
