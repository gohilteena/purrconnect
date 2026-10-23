import User from "../models/User.js";
import { verifyToken } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getBearerToken = (req) => {
  const header = req.headers.authorization;
  return header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
};

// 1) Authentication: "who are you?"  Requires a valid JWT.
export const protect = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) throw new AppError("Authentication required. Please log in.", 401);

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid token.";
    throw new AppError(message, 401);
  }

  // Load the user fresh so deleted users lose access immediately
  const user = await User.findById(payload.id);
  if (!user) throw new AppError("The user for this token no longer exists.", 401);

  req.user = user;
  next();
});

// 2) Authorization: "are you allowed?"  Use AFTER protect.
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }
  next();
};

// Shortcut for admin-only routes
export const adminOnly = [protect, authorize("admin")];

// Public route that behaves differently for logged-in users (never rejects)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);
  if (token) {
    try {
      const user = await User.findById(verifyToken(token).id);
      if (user) req.user = user;
    } catch {
      // bad token on a public route: treat as anonymous
    }
  }
  next();
});
