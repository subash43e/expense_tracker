import { getUserIdFromRequest } from '@/lib/auth';
import deleteAllExpenses from '../handlers/deleteAllExpenses';
// import logger from '@/lib/logger'; // Import your logger

export async function POST(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    await deleteAllExpenses(userId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    // logger.error('Delete all expenses error:', err); // Log the error using your logging library
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
