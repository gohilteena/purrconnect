import { Router } from "express";
import {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from "../controllers/testimonialController.js";
import { adminOnly, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/commonValidators.js";
import {
  createTestimonialSchema, updateTestimonialSchema, testimonialQuerySchema,
} from "../validators/testimonialValidators.js";

const router = Router();

// Public, but admins (with a token) may also request unapproved ones
router.get("/", optionalAuth, validate({ query: testimonialQuerySchema }), getTestimonials);

router.post("/", ...adminOnly, validate({ body: createTestimonialSchema }), createTestimonial);
router.put("/:id", ...adminOnly, validate({ params: idParamSchema, body: updateTestimonialSchema }), updateTestimonial);
router.delete("/:id", ...adminOnly, validate({ params: idParamSchema }), deleteTestimonial);

export default router;
