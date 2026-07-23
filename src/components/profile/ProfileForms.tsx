"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ToastProvider";
import {
  changePasswordAction,
  updateProfileNameAction
} from "@/lib/data/profile-actions";
import {
  type ChangePasswordInput,
  type ProfileNameInput,
  changePasswordSchema,
  profileNameSchema
} from "@/lib/schemas/profile";

type ProfileFormsProps = {
  name: string;
  email: string;
};

export function ProfileForms({ name, email }: ProfileFormsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors, isSubmitting: isSavingName }
  } = useForm<ProfileNameInput>({
    resolver: zodResolver(profileNameSchema),
    defaultValues: {
      name
    }
  });
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSavingPassword }
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: ""
    }
  });

  async function saveName(values: ProfileNameInput) {
    const result = await updateProfileNameAction(values);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    router.refresh();
  }

  async function savePassword(values: ChangePasswordInput) {
    const result = await changePasswordAction(values);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    resetPassword();
    showToast(result.message);
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        className="space-y-5 rounded-md border border-border bg-card p-6"
        onSubmit={handleNameSubmit(saveName)}
        noValidate
      >
        <div className="space-y-2">
          <h2 className="font-display text-4xl leading-none">Profile</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Update the name shown on your EventFlow account.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
            {...registerName("name")}
          />
          {nameErrors.name ? (
            <p className="text-sm text-destructive">{nameErrors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="h-11 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSavingName}
          className="inline-flex h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isSavingName ? "Saving..." : "Save profile"}
        </button>
      </form>

      <form
        className="space-y-5 rounded-md border border-border bg-card p-6"
        onSubmit={handlePasswordSubmit(savePassword)}
        noValidate
      >
        <div className="space-y-2">
          <h2 className="font-display text-4xl leading-none">Change password</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Use your current password before choosing a new one.
          </p>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="currentPassword"
          >
            Current password
          </label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
            {...registerPassword("currentPassword")}
          />
          {passwordErrors.currentPassword ? (
            <p className="text-sm text-destructive">
              {passwordErrors.currentPassword.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="newPassword"
          >
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
            {...registerPassword("newPassword")}
          />
          {passwordErrors.newPassword ? (
            <p className="text-sm text-destructive">
              {passwordErrors.newPassword.message}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isSavingPassword}
          className="inline-flex h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isSavingPassword ? "Saving..." : "Change password"}
        </button>
      </form>
    </div>
  );
}
