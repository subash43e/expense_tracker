import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import deleteAllExpenses from '../handlers/deleteAllExpenses';

export async function POST(req) {
  try {
    // Use requireAuth for proper authentication
    const { userId, error } = requireAuth(req);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }

    await deleteAllExpenses(userId);
    return NextResponse.json({ success: true, message: 'All expenses deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Delete all expenses error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
