import { z } from "zod";

// Strings only => blocks NoSQL-injection payloads like { "$ne": "" }
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72), // bcrypt only uses the first 72 bytes
});
