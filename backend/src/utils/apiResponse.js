// Consistent response format used by every endpoint
export const sendSuccess = (res, data = {}, message = "Request successful", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const sendError = (res, message = "Something went wrong", status = 500, errors = []) =>
  res.status(status).json({ success: false, message, errors });
