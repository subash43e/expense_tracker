import User from "@models/User";
import dbConnect from "@lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error(
    "JWT_SECRET is not defined. Please set it in the environment variables."
  );
}

export async function registerUser(email, password) {
  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, passwordHash: hashedPassword });
  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    SECRET_KEY,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: newUser._id.toString(),
      email: newUser.email,
    },
  };
}

export async function loginUser(email, password) {
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
    },
  };
}

export async function getUserById(userId) {
  await dbConnect();

  const user = await User.findById(userId).select("-passwordHash").lean();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
