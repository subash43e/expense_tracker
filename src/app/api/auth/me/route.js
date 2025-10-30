import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined. Please set it in the environment variables.");
}

export async function GET(req) {
  try {
    const { userId, error } = requireAuth(req);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }

    // Get full user data from token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    return NextResponse.json({ 
      success: true, 
      user: { id: decoded.id, email: decoded.email } 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}