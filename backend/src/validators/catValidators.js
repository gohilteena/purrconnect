import { z } from "zod";
import {
  GENDERS, AGE_UNITS, CAT_STATUSES, HEALTH_STATUSES, VACCINATION_STATUSES,
} from "../utils/constants.js";
import { paginationShape } from "./commonValidators.js";

const catBody = z.object({
  name: z.string().trim().min(2).max(60),
  breed: z.string().trim().min(2).max(60),
  gender: z.enum(GENDERS),
  age: z.number().nonnegative().max(300),
  ageUnit: z.enum(AGE_UNITS).default("months"),
  color: z.string().trim().min(2).max(40),
  location: z.string().trim().min(2).max(80),
  price: z.number().nonnegative(),
  description: z.string().trim().min(10).max(2000),
  personality: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
  healthStatus: z.enum(HEALTH_STATUSES).default("healthy"),
  vaccinationStatus: z.enum(VACCINATION_STATUSES).default("not_vaccinated"),
  images: z.array(z.string().url()).max(8).default([]),
  status: z.enum(CAT_STATUSES).default("available"),
  featured: z.boolean().default(false),
});
// Unknown keys (e.g. slug, _id) are stripped by Zod, so clients cannot set them.

export const createCatSchema = catBody;

// Update: every field optional, but at least one must be sent
export const updateCatSchema = catBody
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, { message: "At least one field is required" });

export const catIdOrSlugParamSchema = z.object({ id: z.string().trim().min(1).max(100) });

// Query strings arrive as text, so numbers are coerced
export const catQuerySchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    breed: z.string().trim().max(60).optional(),
    gender: z.enum(GENDERS).optional(),
    location: z.string().trim().max(80).optional(),
    status: z.enum(CAT_STATUSES).optional(),
    featured: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z.enum(["newest", "oldest", "price_asc", "price_desc", "name_asc"]).default("newest"),
    ...paginationShape,
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: "minPrice cannot be greater than maxPrice",
    path: ["minPrice"],
  });
