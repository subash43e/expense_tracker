import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";
import { ApiError } from "@/lib/api/utils";

/**
 * Get the budget for a specific user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object|null>} - The budget object or null if not found.
 */
export async function getBudgetByUserId(userId) {
  await dbConnect();

  const budget = await Budget.findOne({ userId });
  return budget;
}

/**
 * Create a new budget for a user.
 * @param {string} userId - The user's ID.
 * @param {Object} budgetData - The budget data { monthlyLimit, currency }.
 * @returns {Promise<Object>} - The created budget object.
 */
export async function createBudget(userId, budgetData) {
  await dbConnect();

  // Check if user already has a budget
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

/**
 * Update a user's budget.
 * @param {string} userId - The user's ID.
 * @param {Object} updateData - The data to update { monthlyLimit, currency }.
 * @returns {Promise<Object>} - The updated budget object.
 */
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

/**
 * Delete a user's budget.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object>} - The deleted budget object.
 */
export async function deleteBudget(userId) {
  await dbConnect();

  const budget = await Budget.findOneAndDelete({ userId });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
}

/**
 * Create or update a user's budget (upsert operation).
 * @param {string} userId - The user's ID.
 * @param {Object} budgetData - The budget data { monthlyLimit, currency }.
 * @returns {Promise<Object>} - The budget object.
 */
export async function upsertBudget(userId, budgetData) {
  await dbConnect();

  const budget = await Budget.findOneAndUpdate(
    { userId },
    { $set: { userId, ...budgetData } },
    { new: true, upsert: true, runValidators: true }
  );

  return budget;
}
