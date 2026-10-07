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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-[#C9A227]/20 bg-[#0B0B0B] text-white">
      {/* شعار الشركة واسم المدير */}
      <div className="px-6 py-8 border-b border-[#C9A227]/10">
        <p className="text-xl font-bold text-[#C9A227]">Nexa Digital</p>
        <p className="mt-1 text-sm text-zinc-400">مرحباً، {adminName}</p>
      </div>

      {/* روابط لوحة التحكم */}
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                active 
                  ? "bg-[#C9A227] text-black font-bold shadow-md shadow-[#C9A227]/20" 
                  : "text-zinc-400 hover:text-[#C9A227] hover:bg-[#C9A227]/10"
              }`}
            >
              <Icon size={18} className={active ? "text-black" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* زر تسجيل الخروج */}
      <div className="p-4 border-t border-[#C9A227]/10">
        <button 
          onClick={logout} 
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}