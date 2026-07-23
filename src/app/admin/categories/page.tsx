import { AdminCategoriesManager } from "@/components/admin/AdminCategoriesManager";
import { getCategories } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <AdminCategoriesManager categories={categories} />;
}
