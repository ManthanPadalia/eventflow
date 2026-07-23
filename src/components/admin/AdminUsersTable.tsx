"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import type { AdminUser } from "@/lib/data";
import {
  deleteUserAction,
  updateUserRoleAction
} from "@/lib/data/admin-actions";

type AdminUsersTableProps = {
  users: AdminUser[];
  currentAdminId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

export function AdminUsersTable({
  users,
  currentAdminId
}: AdminUsersTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  async function changeRole(userId: string, role: "USER" | "ADMIN") {
    setUpdatingUserId(userId);
    const result = await updateUserRoleAction(userId, { role });
    setUpdatingUserId(null);

    if (!result.ok) {
      showToast(result.error, "error");
      router.refresh();
      return;
    }

    showToast(result.message);
    router.refresh();
  }

  async function deleteUser() {
    if (!deleteTarget) {
      return;
    }

    const result = await deleteUserAction(deleteTarget.id);

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
    <div className="space-y-5">
      <div className="max-w-2xl space-y-3 border-b border-border pb-5">
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
          Users
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Manage roles and remove demo accounts when needed.
        </p>
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCurrentAdmin = user.id === currentAdminId;
                const isLastAdmin = user.role === "ADMIN" && adminCount <= 1;
                const disableDelete = isCurrentAdmin || isLastAdmin;
                const disableRoleChange =
                  updatingUserId === user.id ||
                  (isCurrentAdmin && user.role === "ADMIN") ||
                  isLastAdmin;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-4 font-medium text-foreground">
                      {user.name}
                      {isCurrentAdmin ? (
                        <span className="ml-2 text-xs font-normal uppercase tracking-[0.12em] text-accent">
                          Current admin
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        disabled={disableRoleChange}
                        onChange={(event) =>
                          changeRole(
                            user.id,
                            event.target.value === "ADMIN" ? "ADMIN" : "USER"
                          )
                        }
                        className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus:border-accent focus:ring-2 focus:ring-ring"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {dateFormatter.format(user.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {user._count.bookings}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={disableDelete}
                          onClick={() => setDeleteTarget(user)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-y border-border py-16">
          <h2 className="font-display text-4xl leading-tight text-foreground">
            No users found.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Registered accounts will appear here.
          </p>
        </div>
      )}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete user?"
          body={`This will remove ${deleteTarget.name} and their bookings.`}
          confirmLabel="Delete user"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteUser}
        />
      ) : null}
    </div>
  );
}
