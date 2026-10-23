// npm run seed  -> wipes cats, enquiries, testimonials and inserts demo data.
// Users (admins) are NOT touched.
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import Cat from "../models/Cat.js";
import Enquiry from "../models/Enquiry.js";
import Testimonial from "../models/Testimonial.js";
import { generateUniqueSlug } from "../services/catService.js";
import { cats, testimonials, enquiries } from "./seedData.js";

const run = async () => {
  if (env.nodeEnv === "production") {
    console.error("Refusing to seed while NODE_ENV=production.");
    process.exit(1);
  }

  await connectDB();

  await Promise.all([Cat.deleteMany(), Enquiry.deleteMany(), Testimonial.deleteMany()]);

  // Create cats one by one so each gets a unique slug
  const createdCats = [];
  for (const cat of cats) {
    createdCats.push(await Cat.create({ ...cat, slug: await generateUniqueSlug(cat.name) }));
  }
  const idByName = Object.fromEntries(createdCats.map((c) => [c.name, c._id]));

  await Testimonial.insertMany(testimonials);
  await Enquiry.insertMany(
    enquiries.map(({ catName, ...rest }) => ({ ...rest, cat: catName ? idByName[catName] : null }))
  );

  console.log(`Seeded ${createdCats.length} cats, ${testimonials.length} testimonials, ${enquiries.length} enquiries.`);
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seeding failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
