import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false => password is never returned by queries unless asked for
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      // Safety net: never leak the hash in a JSON response
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash the password whenever it is new or changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model("User", userSchema);
