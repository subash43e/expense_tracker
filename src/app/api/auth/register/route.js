import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
      });
    }

    // Create new user
    const newUser = new User({ email, passwordHash: password });
    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}