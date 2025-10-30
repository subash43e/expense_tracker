import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Clear the authentication cookie
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    }, { 
      status: 200,
      headers: {
        'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}