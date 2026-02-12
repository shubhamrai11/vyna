/**
 * One-time migration script to add the `file` property
 * to all existing subcategories with the default PDF URL.
 *
 * Usage:
 *   cd vyna_backend
 *   node scripts/seed-subcategory-file.js
 *
 * This script:
 *  1. Connects to the same MongoDB as your backend (reads config.env)
 *  2. Finds all subcategories that don't have a `file` value
 *  3. Sets the `file` field to the default Google Drive PDF URL
 *  4. Logs the result and exits
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Load config from config.env (same as the backend)
dotenv.config({ path: path.join(__dirname, "..", "config.env") });

const DEFAULT_PDF_URL =
  "https://drive.google.com/file/d/1-hx9fbFocMM2KnVoBYt9Gs0X1rYNxBje/view?usp=sharing";

// Determine the database connection string based on NODE_ENV
let DBConString = process.env.DATABASE_LOCAL;

if (process.env.NODE_ENV === "development") {
  DBConString = process.env.DATABASE_DEV;
}
if (process.env.NODE_ENV === "production") {
  DBConString = process.env.DATABASE_PROD;
}

async function run() {
  try {
    console.log(`Connecting to MongoDB: ${DBConString}`);
    await mongoose.connect(DBConString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected.\n");

    const SubCategory = mongoose.connection.collection("sub_categories");

    // Find subcategories that don't have a `file` field or have it empty/null
    const filter = {
      $or: [
        { file: { $exists: false } },
        { file: null },
        { file: "" },
      ],
    };

    const countBefore = await SubCategory.countDocuments(filter);
    console.log(
      `Found ${countBefore} subcategories without a file property.\n`
    );

    if (countBefore === 0) {
      console.log("Nothing to update. All subcategories already have a file URL.");
      process.exit(0);
    }

    // Update all matching subcategories
    const result = await SubCategory.updateMany(filter, {
      $set: { file: DEFAULT_PDF_URL },
    });

    console.log(`Updated ${result.modifiedCount} subcategories.`);
    console.log(`Default file URL set to:\n  ${DEFAULT_PDF_URL}\n`);

    // List updated subcategories for confirmation
    const allSubs = await SubCategory.find({}, { subCategoryName: 1, file: 1 }).toArray();
    console.log("Current subcategories:");
    allSubs.forEach((sub, i) => {
      console.log(`  ${i + 1}. ${sub.subCategoryName} → ${sub.file ? "✓ has file" : "✗ no file"}`);
    });

    console.log("\nDone!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

run();
