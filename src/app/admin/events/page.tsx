import { AdminEventsTable } from "@/components/admin/AdminEventsTable";
import { getAdminEvents, getCategories } from "@/lib/data";

export default async function AdminEventsPage() {
  const [events, categories] = await Promise.all([
    getAdminEvents(),
    getCategories()
  ]);

  return <AdminEventsTable events={events} categories={categories} />;
}
