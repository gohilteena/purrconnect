import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
