import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().max(20),
  name: z.string().min(2),
  password: z.string().min(8),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPinSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  externallink: z.string().url("A valid external URL is required"),
});


// src/zod.ts
export const updatePinSchema = z.object({
  title: z.string().min(1).optional(),
  externallink: z.string().url().optional(),
});