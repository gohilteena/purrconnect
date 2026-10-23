import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/stats", ...adminOnly, getDashboardStats);

export default router;
