import mongoose from "mongoose";

/**
 * Validate required environment variables.
 * Throws an error if any required variable is missing.
 */
function validateEnvVariables() {
  const requiredVars = ["MONGODB_URI"];
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        `Please check your .env.local file and ensure all required variables are set. ` +
        `Refer to .env.example for the list of required variables.`
    );
  }
}

// Validate environment variables at startup
validateEnvVariables();

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the database connection to prevent multiple connections
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establish a connection to the MongoDB database.
 * @returns {Promise<mongoose.Connection>} - The established connection.
 */
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
