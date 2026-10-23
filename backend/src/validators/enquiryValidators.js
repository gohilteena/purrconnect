import { z } from "zod";
import { ENQUIRY_STATUSES } from "../utils/constants.js";
import { objectIdSchema, paginationShape } from "./commonValidators.js";

export const createEnquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  cat: objectIdSchema.optional(), // optional: general enquiry
  message: z.string().trim().min(10).max(1000),
});

export const updateEnquirySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES),
});

export const enquiryQuerySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  ...paginationShape,
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
