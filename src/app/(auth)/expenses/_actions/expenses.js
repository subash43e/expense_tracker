'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';
import {
  getAllExpenses,
  getAllExpensesSimple,
  createExpense as createExpenseDb,
  updateExpense as updateExpenseDb,
  deleteExpense as deleteExpenseDb,
  getExpenseById as getExpenseByIdDb,
  deleteAllExpenses as deleteAllExpensesDb,
} from '@lib/expenses';
import {
  createExpenseSchema,
  updateExpenseSchema,
} from '@lib/validations';

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Get authenticated user ID from cookies
 * @throws {Error} if not authenticated
 */
async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt-login');

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token.value, SECRET_KEY);
    return decoded.id;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Get all expenses with optional pagination and filtering
 */
export async function getExpenses(options = {}) {
  try {
    const userId = await getUserId();

    const {
      page,
      limit,
      category,
      sortBy,
      sortOrder,
    } = options;

    const queryOptions = { userId };
    if (page) queryOptions.page = parseInt(page, 10);
    if (limit) queryOptions.limit = parseInt(limit, 10);
    if (category) queryOptions.category = category;
    if (sortBy) queryOptions.sortBy = sortBy;
    if (sortOrder) queryOptions.sortOrder = sortOrder;

    // If pagination is requested, use paginated version
    if (page || limit || category) {
      const result = await getAllExpenses(queryOptions);
      return { success: true, ...result };
    }

    // Otherwise, return simple list
    const expenses = await getAllExpensesSimple(userId);
    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch expenses',
    };
  }
}

/**
 * Get a single expense by ID
 */
export async function getExpenseById(expenseId) {
  try {
    const userId = await getUserId();
    const expense = await getExpenseByIdDb(expenseId, userId);

    if (!expense) {
      return {
        success: false,
        error: 'Expense not found',
      };
    }

    return { success: true, data: expense };
  } catch (error) {
    console.error('Error fetching expense:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch expense',
    };
  }
}

/**
 * Create a new expense
 */
export async function createExpense(data) {
  try {
    const userId = await getUserId();

    // Validate input
    const validatedData = createExpenseSchema.parse(data);

    // Create expense
    const expense = await createExpenseDb({ ...validatedData, userId });

    // Revalidate pages that display expenses
    revalidatePath('/');
    revalidatePath('/expenses');
    revalidatePath('/analytics');

    return { success: true, data: expense };
  } catch (error) {
    console.error('Error creating expense:', error);

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation failed',
        errors: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to create expense',
    };
  }
}

/**
 * Update an existing expense
 */
export async function updateExpense(expenseId, data) {
  try {
    const userId = await getUserId();

    // Validate input
    const validatedData = updateExpenseSchema.parse(data);

    // Update expense
    const expense = await updateExpenseDb(expenseId, userId, validatedData);

    if (!expense) {
      return {
        success: false,
        error: 'Expense not found or unauthorized',
      };
    }

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/expenses');
    revalidatePath('/analytics');
    revalidatePath(`/expenses/edit/${expenseId}`);

    return { success: true, data: expense };
  } catch (error) {
    console.error('Error updating expense:', error);

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation failed',
        errors: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to update expense',
    };
  }
}

/**
 * Delete an expense
 */
export async function deleteExpense(expenseId) {
  try {
    const userId = await getUserId();

    const expense = await deleteExpenseDb(expenseId, userId);

    if (!expense) {
      return {
        success: false,
        error: 'Expense not found or unauthorized',
      };
    }

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/expenses');
    revalidatePath('/analytics');

    return { success: true, data: expense };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete expense',
    };
  }
}

/**
 * Delete all expenses for the authenticated user
 */
export async function deleteAllExpenses() {
  try {
    const userId = await getUserId();

    const result = await deleteAllExpensesDb(userId);

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/expenses');
    revalidatePath('/analytics');

    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    console.error('Error deleting all expenses:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete all expenses',
    };
  }
}
