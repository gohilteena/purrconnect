// Usage: validate({ body: schema, query: schema, params: schema })
// Invalid input throws a ZodError, which the error handler turns into a 400.
export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.params) schemas.params.parse(req.params); // checked only
    if (schemas.query) {
      // Treat "?breed=" (empty) the same as "not provided"
      const cleaned = Object.fromEntries(Object.entries(req.query).filter(([, v]) => v !== ""));
      req.query = schemas.query.parse(cleaned);
    }
    if (schemas.body) req.body = schemas.body.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
