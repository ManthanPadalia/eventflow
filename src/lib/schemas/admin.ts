import { z } from "zod";

export const adminEventSchema = z.object({
  title: z.string().trim().min(2, "Enter an event title."),
  description: z.string().trim().min(20, "Enter at least 20 characters."),
  date: z.string().trim().min(1, "Choose a date and time."),
  location: z.string().trim().min(2, "Enter a location."),
  capacity: z
    .number()
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1."),
  imageUrl: z
    .string()
    .trim()
    .url("Enter a valid image URL.")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().trim().min(1, "Choose a category.")
});

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, "Enter a category name.")
});

export const adminRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"])
});

export type AdminEventInput = z.infer<typeof adminEventSchema>;
export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
export type AdminRoleInput = z.infer<typeof adminRoleSchema>;
