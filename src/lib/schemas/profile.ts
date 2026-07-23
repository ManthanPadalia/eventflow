import { z } from "zod";

export const profileNameSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(8, "Use at least 8 characters.")
});

export type ProfileNameInput = z.infer<typeof profileNameSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
