import { Router } from "express";
import { getCats, getCat, createCat, updateCat, deleteCat } from "../controllers/catController.js";
import { adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/commonValidators.js";
import {
  catQuerySchema, catIdOrSlugParamSchema, createCatSchema, updateCatSchema,
} from "../validators/catValidators.js";

const router = Router();

// Public
router.get("/", validate({ query: catQuerySchema }), getCats);
router.get("/:id", validate({ params: catIdOrSlugParamSchema }), getCat);

// Admin only (auth check runs BEFORE validation)
router.post("/", ...adminOnly, validate({ body: createCatSchema }), createCat);
router.put("/:id", ...adminOnly, validate({ params: idParamSchema, body: updateCatSchema }), updateCat);
router.delete("/:id", ...adminOnly, validate({ params: idParamSchema }), deleteCat);

export default router;
