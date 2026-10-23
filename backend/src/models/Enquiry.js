import mongoose from "mongoose";
import { ENQUIRY_STATUSES } from "../utils/constants.js";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Enquiries can belong to a cat or be general enquiries
    cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cat",
      required: false,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Enquiry", enquirySchema);