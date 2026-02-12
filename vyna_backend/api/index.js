const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = require("../app");
const authController = require("../controller/apiv1Controller/admin/adminAuthController");

// ──────────────────────────────────────────────────────────────
// MongoDB Connection Caching
// ──────────────────────────────────────────────────────────────
// Vercel serverless functions are ephemeral but can be "warm" —
// meaning the same process may handle multiple requests.
// We cache the connection in a module-level variable so that
// warm invocations reuse the existing connection instead of
// opening a new one every time (which would exhaust the pool).
// ──────────────────────────────────────────────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("=> Using existing MongoDB connection");
    return;
  }

  // Determine connection string based on NODE_ENV
  let DBConString = process.env.DATABASE_LOCAL;

  if (process.env.NODE_ENV === "development") {
    DBConString = process.env.DATABASE_DEV;
  }

  if (process.env.NODE_ENV === "production") {
    DBConString = process.env.DATABASE_PROD;
  }

  const DBOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Serverless-friendly pool settings
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(DBConString, DBOptions);
    isConnected = true;
    console.log("=> MongoDB connected successfully");
  } catch (err) {
    console.error("=> MongoDB connection error:", err);
    throw err;
  }
}

// Create default admin on first warm invocation
let adminCreated = false;
async function ensureDefaultAdmin() {
  if (adminCreated) return;
  try {
    await authController.createDefaultAdmin();
    adminCreated = true;
  } catch (err) {
    console.log("Admin creation error:", err);
  }
}

// ──────────────────────────────────────────────────────────────
// Vercel Serverless Handler
// ──────────────────────────────────────────────────────────────
// Vercel expects a function export, NOT app.listen().
// Every incoming request goes through this handler which
// ensures DB is connected before forwarding to Express.
// ──────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  await connectDB();
  await ensureDefaultAdmin();
  return app(req, res);
};
