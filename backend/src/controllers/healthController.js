import mongoose from "mongoose";
import { sendSuccess } from "../utils/apiResponse.js";

const DB_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

export const getHealth = (req, res) => {
  sendSuccess(
    res,
    {
      status: "ok",
      database: DB_STATES[mongoose.connection.readyState],
      timestamp: new Date().toISOString(),
    },
    "PurrConnect API is running"
  );
};
