"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, FolderKanban, HelpCircle, Mail as MailIcon,
  FileText, Settings, LogOut,
} from "lucide-react";

const items = [
  { href: "/admin", label: "لوحة الإحصائيات", icon: LayoutDashboard },
  { href: "/admin/services", label: "الخدمات", icon: Briefcase },
  { href: "/admin/projects", label: "المشاريع", icon: FolderKanban },
  { href: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { href: "/admin/quotes", label: "طلبات الأسعار", icon: FileText },
  { href: "/admin/messages", label: "الرسائل", icon: MailIcon },
  { href: "/admin/content", label: "محتوى الصفحات", icon: FileText },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-black/10 bg-[#0b1e3f] text-white">
      <div className="px-6 py-6">
        <p className="text-lg font-bold">Nexa Digital</p>
        <p className="text-xs text-white/60">{adminName}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active ? "bg-white/15 font-semibold" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/10">
        <LogOut size={18} />
        تسجيل الخروج
      </button>
    </aside>
  );
}
