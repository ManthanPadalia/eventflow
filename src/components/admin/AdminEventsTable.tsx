"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import {
  createEventAction,
  deleteEventAction,
  updateEventAction
} from "@/lib/data/admin-actions";
import type { AdminEvent, CategoryWithEventCount } from "@/lib/data";
import {
  type AdminEventInput,
  adminEventSchema
} from "@/lib/schemas/admin";

type AdminEventsTableProps = {
  events: AdminEvent[];
  categories: CategoryWithEventCount[];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

function toDateTimeInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function getEventDefaults(
  event: AdminEvent | null,
  categories: CategoryWithEventCount[]
): AdminEventInput {
  return {
    title: event?.title ?? "",
    description: event?.description ?? "",
    date: event ? toDateTimeInputValue(event.date) : "",
    location: event?.location ?? "",
    capacity: event?.capacity ?? 60,
    imageUrl: event?.imageUrl ?? "",
    categoryId: event?.categoryId ?? categories[0]?.id ?? ""
  };
}

export function AdminEventsTable({
  events,
  categories
}: AdminEventsTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);
  const defaultValues = useMemo(
    () => getEventDefaults(editingEvent, categories),
    [editingEvent, categories]
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AdminEventInput>({
    resolver: zodResolver(adminEventSchema),
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function openCreateForm() {
    setEditingEvent(null);
    setIsFormOpen(true);
  }

  function openEditForm(event: AdminEvent) {
    setEditingEvent(event);
    setIsFormOpen(true);
  }

  async function saveEvent(values: AdminEventInput) {
    const result = editingEvent
      ? await updateEventAction(editingEvent.id, values)
      : await createEventAction(values);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    setIsFormOpen(false);
    setEditingEvent(null);
    router.refresh();
  }

  async function deleteEvent() {
    if (!deleteTarget) {
      return;
    }

    const result = await deleteEventAction(deleteTarget.id);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
            Events
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Create, edit, and retire events from the local calendar.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New event
        </button>
      </div>

      {events.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-border last:border-b-0">
                  <td className="max-w-72 px-4 py-4 font-medium text-foreground">
                    <span className="line-clamp-2">{event.title}</span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {event.category.name}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {dateFormatter.format(event.date)}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {event.capacity}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {event._count.bookings}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(event)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(event)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-y border-border py-16">
          <h2 className="font-display text-4xl leading-tight text-foreground">
            No events yet.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add the first event to start taking registrations.
          </p>
        </div>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-foreground/20 px-4 py-8">
          <div className="mx-auto max-w-2xl rounded-md border border-border bg-card p-6">
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <h2 className="font-display text-4xl leading-none">
                  {editingEvent ? "Edit event" : "New event"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  All fields are validated before the event is saved.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Close event form"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <form className="grid gap-5" onSubmit={handleSubmit(saveEvent)} noValidate>
              <Field label="Title" error={errors.title?.message}>
                <input
                  type="text"
                  className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                  {...register("title")}
                />
              </Field>
              <Field label="Description" error={errors.description?.message}>
                <textarea
                  rows={5}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                  {...register("description")}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Date and time" error={errors.date?.message}>
                  <input
                    type="datetime-local"
                    className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                    {...register("date")}
                  />
                </Field>
                <Field label="Capacity" error={errors.capacity?.message}>
                  <input
                    type="number"
                    min={1}
                    className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                    {...register("capacity", { valueAsNumber: true })}
                  />
                </Field>
              </div>
              <Field label="Location" error={errors.location?.message}>
                <input
                  type="text"
                  className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                  {...register("location")}
                />
              </Field>
              <Field label="Image URL" error={errors.imageUrl?.message}>
                <input
                  type="url"
                  className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                  {...register("imageUrl")}
                />
              </Field>
              <Field label="Category" error={errors.categoryId?.message}>
                <select
                  className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
                  {...register("categoryId")}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || categories.length === 0}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {isSubmitting ? "Saving..." : "Save event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete event?"
          body={`This will remove "${deleteTarget.title}" and its bookings.`}
          confirmLabel="Delete event"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteEvent}
        />
      ) : null}
    </div>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </label>
  );
}
