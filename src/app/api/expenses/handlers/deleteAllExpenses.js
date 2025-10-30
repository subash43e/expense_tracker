import { deleteAllExpenses as deleteAllExpensesLib } from '@/lib/expenses';

export default async function deleteAllExpenses(userId) {
  if (!userId) throw new Error('User ID required');
  return await deleteAllExpensesLib(userId);
}
