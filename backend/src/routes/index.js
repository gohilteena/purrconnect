import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import catRoutes from "./catRoutes.js";
import enquiryRoutes from "./enquiryRoutes.js";
import testimonialRoutes from "./testimonialRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/cats", catRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
