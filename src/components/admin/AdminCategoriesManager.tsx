"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction
} from "@/lib/data/admin-actions";
import type { CategoryWithEventCount } from "@/lib/data";
import {
  type AdminCategoryInput,
  adminCategorySchema
} from "@/lib/schemas/admin";

type AdminCategoriesManagerProps = {
  categories: CategoryWithEventCount[];
};

export function AdminCategoriesManager({
  categories
}: AdminCategoriesManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithEventCount | null>(
    null
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AdminCategoryInput>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues: {
      name: ""
    }
  });

  async function addCategory(values: AdminCategoryInput) {
    const result = await createCategoryAction(values);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    reset();
    showToast(result.message);
    router.refresh();
  }

  function startRename(category: CategoryWithEventCount) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function saveRename(categoryId: string) {
    const result = await updateCategoryAction(categoryId, {
      name: editingName
    });

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    setEditingId(null);
    setEditingName("");
    showToast(result.message);
    router.refresh();
  }

  async function deleteCategory() {
    if (!deleteTarget) {
      return;
    }

    const result = await deleteCategoryAction(deleteTarget.id);

    if (!result.ok) {
      showToast(result.error, "error");
      setDeleteTarget(null);
      return;
    }

    showToast(result.message);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-3 border-b border-border pb-5">
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
          Categories
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Keep the event taxonomy simple and readable.
        </p>
      </div>

      <form
        className="flex max-w-2xl flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row"
        onSubmit={handleSubmit(addCategory)}
        noValidate
      >
        <label className="flex-1 space-y-2">
          <span className="text-sm font-medium text-foreground">New category</span>
          <input
            type="text"
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>

      {categories.length > 0 ? (
        <ul className="max-w-3xl divide-y divide-border rounded-md border border-border bg-card">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                {editingId === category.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className="h-10 w-full max-w-sm rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <p className="font-medium text-foreground">{category.name}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {category._count.events}{" "}
                  {category._count.events === 1 ? "event" : "events"}
                </p>
              </div>
              {editingId === category.id ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveRename(category.id)}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-accent bg-accent px-3 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Cancel rename"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startRename(category)}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(category)}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-y border-border py-16">
          <h2 className="font-display text-4xl leading-tight text-foreground">
            No categories yet.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add a category before creating events.
          </p>
        </div>
      )}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete category?"
          body={
            deleteTarget._count.events > 0
              ? "This category still has events, so the server will block deletion until those events are moved or deleted."
              : `This will remove "${deleteTarget.name}" from the category list.`
          }
          confirmLabel="Delete category"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteCategory}
        />
      ) : null}
    </div>
  );
}
