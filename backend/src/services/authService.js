import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// The token only carries the user id and role; never put secrets in a JWT.
export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    algorithm: "HS256",
    expiresIn: env.jwtExpiresIn,
  });

// Throws if the token is invalid, tampered with, or expired
export const verifyToken = (token) =>
  jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
