import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    catName: { type: String, trim: true, default: "" }, // plain text, not a reference
    image: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Testimonial", testimonialSchema);
