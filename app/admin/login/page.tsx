"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("بيانات الدخول غير صحيحة / Invalid credentials");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("حدث خطأ ما / Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1e3f] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-xl font-bold text-[#0b1e3f]">Nexa Digital — Admin</h1>
        <p className="mt-1 text-sm text-gray-500">تسجيل دخول المدير / Admin login</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#0b1e3f]">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#5b2ebd]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#0b1e3f]">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#5b2ebd]"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="mt-6 w-full rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "..." : "دخول / Sign in"}
        </button>
      </form>
    </div>
  );
}
