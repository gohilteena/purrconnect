import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

// Compared against when the email is unknown, so response time does not
// reveal whether an account exists.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const passwordOk = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

  // Same message for "no such user" and "wrong password"
  if (!user || !passwordOk) throw new AppError("Invalid email or password", 401);

  sendSuccess(res, { token: signToken(user), user }, "Login successful");
});

export const getMe = (req, res) => {
  sendSuccess(res, { user: req.user }, "Current user fetched successfully");
};
