// Creates a user from values in .env (nothing is hardcoded in source).
//   npm run create-admin       -> role "admin", reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD
//   npm run create-test-user   -> role "user",  reads TEST_USER_NAME / TEST_USER_EMAIL / TEST_USER_PASSWORD
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const role = process.argv[2] === "user" ? "user" : "admin";
const prefix = role === "admin" ? "ADMIN" : "TEST_USER";

const schema = z.object({
  name: z.string().trim().min(2, `${prefix}_NAME is required`),
  email: z.string().trim().toLowerCase().email(`${prefix}_EMAIL must be a valid email`),
  password: z.string().min(8, `${prefix}_PASSWORD must be at least 8 characters`).max(72),
});

const run = async () => {
  const parsed = schema.safeParse({
    name: process.env[`${prefix}_NAME`],
    email: process.env[`${prefix}_EMAIL`],
    password: process.env[`${prefix}_PASSWORD`],
  });
  if (!parsed.success) {
    console.error("Cannot create user. Fix your .env:");
    parsed.error.issues.forEach((i) => console.error(` - ${i.message}`));
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: parsed.data.email });
  if (existing) {
    console.log(`A user with email ${parsed.data.email} already exists. Nothing changed.`);
  } else {
    // The password is hashed by the User model's pre-save hook
    await User.create({ ...parsed.data, role });
    console.log(`Created ${role}: ${parsed.data.email}`);
    if (role === "admin") console.log("Tip: remove ADMIN_PASSWORD from your .env now.");
  }
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
