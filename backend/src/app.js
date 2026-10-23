import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = env.clientUrl
  ? env.clientUrl.split(",").map((s) => s.trim())
  : ["http://localhost:5173"];

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Check configured origins, wildcard, non-production, or any Vercel domain
      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        env.nodeEnv !== "production" ||
        /^https:\/\/([a-z0-9-]+)\.vercel\.app$/i.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
if (env.nodeEnv !== "production") app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
