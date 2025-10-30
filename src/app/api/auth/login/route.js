import { loginUser } from '@/lib/users';
import { loginSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate request body
    const { email, password } = loginSchema.parse(body);

    // Delegate to lib function
    const result = await loginUser(email, password);

    return NextResponse.json({ 
      success: true,
      token: result.token,
      user: result.user
    }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed',
        issues: error.errors
      }, { status: 400 });
    }

    const status = error.message === 'Invalid credentials' ? 401 : 500;
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status });
  }
}