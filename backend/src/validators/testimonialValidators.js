import { z } from "zod";

const testimonialBody = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name cannot exceed 80 characters"),
  location: z.string().trim().min(2, "Location must be at least 2 characters").max(80, "Location cannot exceed 80 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message cannot exceed 1000 characters"),
  catName: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? v.trim() : ""))
    .default(""),
  image: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? v.trim() : ""))
    .pipe(z.string().url("Please provide a valid image URL").or(z.literal("")))
    .default(""),
  rating: z.coerce.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").default(5),
  approved: z
    .union([z.boolean(), z.enum(["true", "false"]).transform((v) => v === "true")])
    .default(false),
});

export const createTestimonialSchema = testimonialBody;

// Update: every field optional, but at least one must be sent
export const updateTestimonialSchema = testimonialBody
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, { message: "At least one field is required" });

export const testimonialQuerySchema = z.object({
  // Only honoured for admins; public visitors always get approved ones
  approved: z.enum(["true", "false", "all"]).default("true"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
