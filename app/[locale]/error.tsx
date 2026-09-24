"use client";

import { useEffect } from "react";
import { dictionaries, defaultLocale } from "@/lib/i18n/config";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const dict = dictionaries[defaultLocale];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-secondary)]">500</p>
      <h1 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">{dict.serverError.title}</h1>
      <p className="mt-2 text-[var(--color-text-soft)]">{dict.serverError.text}</p>
      <button onClick={reset} className="mt-6 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white">
        {dict.serverError.retry}
      </button>
    </div>
  );
}
