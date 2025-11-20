"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import jwt from "jsonwebtoken";
import {
  getBudgetByUserId,
  upsertBudget as upsertBudgetDb,
  deleteBudget as deleteBudgetDb,
} from "@lib/budgets";
import { createBudgetSchema } from "@lib/validations";

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Get authenticated user ID from cookies
 * @throws {Error} if not authenticated
 */
async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt-login");

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token.value, SECRET_KEY);
    return decoded.id;
  } catch (error) {
    throw new Error("Invalid token :", error);
  }
}

/**
 * Get budget for authenticated user
 */
export async function getBudget() {
  try {
    const userId = await getUserId();
    const budget = await getBudgetByUserId(userId);

    return {
      success: true,
      budget: budget || null,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch budget",
    };
  }
}

/**
 * Create or update budget for authenticated user
 */
export async function saveBudget(data) {
  try {
    const userId = await getUserId();

    // Validate input
    const validatedData = createBudgetSchema.parse(data);

    // Upsert budget
    const budget = await upsertBudgetDb(userId, validatedData);

    // Revalidate pages that display budget
    revalidatePath("/");
    revalidatePath("/settings");
    revalidatePath("/analytics");

    return {
      success: true,
      budget,
      message: "Budget saved successfully",
    };
  } catch (error) {
    console.error("Error saving budget:", error);

    if (error.name === "ZodError") {
      return {
        success: false,
        error: "Validation failed",
        errors: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to save budget",
    };
  }
}

/**
 * Delete budget for authenticated user
 */
export async function deleteBudget() {
  try {
    const userId = await getUserId();
    const budget = await deleteBudgetDb(userId);

    if (!budget) {
      return {
        success: false,
        error: "Budget not found",
      };
    }

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/settings");
    revalidatePath("/analytics");

    return {
      success: true,
      message: "Budget deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return {
      success: false,
      error: error.message || "Failed to delete budget",
    };
  }
}
