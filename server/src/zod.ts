import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().max(20),
  name: z.string().min(2),
  password: z.string().min(8),
});
