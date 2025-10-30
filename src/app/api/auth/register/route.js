import { registerUser } from '@/lib/users';
import { registerSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate request body
    const { email, password } = registerSchema.parse(body);

    // Delegate to lib function
    const user = await registerUser(email, password);

    return NextResponse.json({ 
      success: true,
      message: 'User registered successfully',
      user
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed',
        issues: error.errors
      }, { status: 400 });
    }

    const status = error.message === 'User already exists' ? 400 : 500;
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status });
  }
}