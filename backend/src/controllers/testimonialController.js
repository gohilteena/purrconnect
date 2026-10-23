import Testimonial from "../models/Testimonial.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getTestimonials = asyncHandler(async (req, res) => {
  const { approved, limit } = req.query;
  const isAdmin = req.user?.role === "admin";

  // Public visitors only ever see approved testimonials
  const filter = {};
  if (!isAdmin || approved === "true") {
    filter.approved = true;
  } else if (approved === "false") {
    filter.approved = false;
  }
  // When isAdmin is true and approved === "all", filter stays empty to return all testimonials

  const [testimonials, total] = await Promise.all([
    Testimonial.find(filter).sort({ createdAt: -1 }).limit(limit),
    Testimonial.countDocuments(filter),
  ]);

  sendSuccess(res, { testimonials, total }, "Testimonials fetched successfully");
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  sendSuccess(res, { testimonial }, "Testimonial created successfully", 201);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) throw new AppError("Testimonial not found", 404);
  sendSuccess(res, { testimonial }, "Testimonial updated successfully");
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new AppError("Testimonial not found", 404);
  sendSuccess(res, { testimonial }, "Testimonial deleted successfully");
});
