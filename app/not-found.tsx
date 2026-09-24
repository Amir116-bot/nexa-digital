import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-6xl font-bold text-[#5b2ebd]">404</p>
        <h1 className="text-xl font-semibold text-[#0b1e3f]">الصفحة غير موجودة</h1>
        <Link href="/ar" className="rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-6 py-2.5 text-sm font-semibold text-white">
          العودة إلى الرئيسية
        </Link>
      </body>
    </html>
  );
}
