import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

// Fail fast: tokens signed with a missing/weak secret would be insecure.
if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is not set. Copy .env.example to .env and set it.");
}
if (env.nodeEnv === "production" && (env.jwtSecret === "change_this_secret" || env.jwtSecret.length < 32)) {
  throw new Error("Set a strong JWT_SECRET (32+ characters) in production.");
}
if (env.jwtSecret === "change_this_secret") {
  console.warn("WARNING: JWT_SECRET is still the placeholder value. Change it before deploying.");
}
