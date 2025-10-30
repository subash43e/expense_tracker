import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';

export default async function deleteAllExpenses(userId) {
  if (!userId) throw new Error('User ID required');
  await dbConnect();
  await Expense.deleteMany({ userId });
  return { success: true };
}
