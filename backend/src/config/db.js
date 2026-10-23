import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// On Windows or certain local routers/ISPs, Node's default DNS resolver
// fails MongoDB Atlas SRV lookups with querySrv ECONNREFUSED.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in restricted environments
}

export const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env first.");
  }
  const conn = await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
};
