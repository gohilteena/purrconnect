import { ZodError } from "zod";
import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

export const notFound = (req, res) =>
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);

// Express recognises error handlers by their 4 arguments
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];

  if (err instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    errors = err.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
  } else if (err.name === "ValidationError") {
    // Mongoose schema validation
    status = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `${field} already exists`;
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON in request body";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request body too large";
  }

  if (status >= 500) {
    console.error(err);
    if (env.nodeEnv === "production") message = "Internal server error";
  }

  sendError(res, message, status, errors);
};
