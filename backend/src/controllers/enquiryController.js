import Cat from "../models/Cat.js";
import Enquiry from "../models/Enquiry.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { buildPagination } from "../utils/pagination.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  if (req.body.cat && !(await Cat.exists({ _id: req.body.cat }))) {
    throw new AppError("Cat not found", 404);
  }
  const enquiry = await Enquiry.create(req.body);
  sendSuccess(res, { enquiry }, "Enquiry submitted successfully", 201);
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const filter = status ? { status } : {};

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate("cat", "name slug breed status images") // join the related cat
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Enquiry.countDocuments(filter),
  ]);
  sendSuccess(res, { enquiries, pagination: buildPagination(page, limit, total) }, "Enquiries fetched successfully");
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate("cat", "name slug breed status images");
  if (!enquiry) throw new AppError("Enquiry not found", 404);
  sendSuccess(res, { enquiry }, "Enquiry updated successfully");
});
