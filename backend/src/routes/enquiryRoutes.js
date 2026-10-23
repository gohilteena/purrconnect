import { Router } from "express";

import {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
} from "../controllers/enquiryController.js";

import { adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

import { idParamSchema } from "../validators/commonValidators.js";

import {
  createEnquirySchema,
  updateEnquirySchema,
  enquiryQuerySchema,
} from "../validators/enquiryValidators.js";

const router = Router();

// Public enquiry submission
router.post(
  "/",
  validate({ body: createEnquirySchema }),
  createEnquiry
);

// Admin enquiry management
router.get(
  "/",
  ...adminOnly,
  validate({ query: enquiryQuerySchema }),
  getEnquiries
);

router.put(
  "/:id",
  ...adminOnly,
  validate({
    params: idParamSchema,
    body: updateEnquirySchema,
  }),
  updateEnquiry
);

export default router;