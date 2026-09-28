import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Temporarily bypass authentication for development
  // const session = await getSession();
  // if (!session) redirect("/admin/login");

  const session = { name: "Admin" }; // Mock session for development

  return (
    <div className="flex" dir="rtl">
      <AdminSidebar adminName={session.name} />
      <main className="min-h-screen flex-1 overflow-x-hidden bg-[#f6f7fb] p-6 lg:p-10">{children}</main>
    </div>
  );
}
