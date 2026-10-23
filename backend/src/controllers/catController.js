import Cat from "../models/Cat.js";
import * as catService from "../services/catService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getCats = asyncHandler(async (req, res) => {
  const data = await catService.listCats(req.query);
  sendSuccess(res, data, "Cats fetched successfully");
});

export const getCat = asyncHandler(async (req, res) => {
  const cat = await catService.findCatByIdOrSlug(req.params.id);
  if (!cat) throw new AppError("Cat not found", 404);
  sendSuccess(res, { cat }, "Cat fetched successfully");
});

export const createCat = asyncHandler(async (req, res) => {
  const slug = await catService.generateUniqueSlug(req.body.name);
  const cat = await Cat.create({ ...req.body, slug });
  sendSuccess(res, { cat }, "Cat created successfully", 201);
});

export const updateCat = asyncHandler(async (req, res) => {
  const cat = await Cat.findById(req.params.id);
  if (!cat) throw new AppError("Cat not found", 404);

  // Keep the slug in sync if the name changes
  if (req.body.name && req.body.name !== cat.name) {
    cat.slug = await catService.generateUniqueSlug(req.body.name, cat._id);
  }
  cat.set(req.body);
  await cat.save(); // save() runs the schema validators
  sendSuccess(res, { cat }, "Cat updated successfully");
});

export const deleteCat = asyncHandler(async (req, res) => {
  const cat = await Cat.findByIdAndDelete(req.params.id);
  if (!cat) throw new AppError("Cat not found", 404);
  sendSuccess(res, { cat }, "Cat deleted successfully");
});
