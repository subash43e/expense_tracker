import User from '@/models/User';
import dbConnect from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined. Please set it in the environment variables.");
}

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password (plain text)
 * @returns {Promise<Object>} - Created user object
 */
export async function registerUser(email, password) {
  await dbConnect();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, passwordHash: hashedPassword });
  await newUser.save();

  return {
    id: newUser._id.toString(),
    email: newUser.email
  };
}

/**
 * Login user and generate JWT token
 * @param {string} email - User email
 * @param {string} password - User password (plain text)
 * @returns {Promise<Object>} - Token and user data
 */
export async function loginUser(email, password) {
  await dbConnect();

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, email: user.email }, 
    SECRET_KEY, 
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email
    }
  };
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User object
 */
export async function getUserById(userId) {
  await dbConnect();

  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id.toString(),
    email: user.email
  };
}
