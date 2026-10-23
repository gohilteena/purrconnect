import mongoose from "mongoose";
import {
  GENDERS, AGE_UNITS, CAT_STATUSES, HEALTH_STATUSES, VACCINATION_STATUSES,
} from "../utils/constants.js";

const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    breed: { type: String, required: true, trim: true, index: true },
    gender: { type: String, enum: GENDERS, required: true },
    age: { type: Number, required: true, min: 0 },
    ageUnit: { type: String, enum: AGE_UNITS, default: "months" },
    color: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    personality: { type: [String], default: [] },
    healthStatus: { type: String, enum: HEALTH_STATUSES, default: "healthy" },
    vaccinationStatus: { type: String, enum: VACCINATION_STATUSES, default: "not_vaccinated" },
    images: { type: [String], default: [] },
    status: { type: String, enum: CAT_STATUSES, default: "available", index: true },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Cat", catSchema);
