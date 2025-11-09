import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";
import { ApiError } from "@/lib/api/utils";

export async function getBudgetByUserId(userId) {
  await dbConnect();

  const budget = await Budget.findOne({ userId });
  return budget;
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

  return budget;
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

  return budget;
}

export async function deleteBudget(userId) {
  await dbConnect();

  const budget = await Budget.findOneAndDelete({ userId });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
}

export async function upsertBudget(userId, budgetData) {
  await dbConnect();

  const budget = await Budget.findOneAndUpdate(
    { userId },
    { $set: { userId, ...budgetData } },
    { new: true, upsert: true, runValidators: true }
  );

  return budget;
}
