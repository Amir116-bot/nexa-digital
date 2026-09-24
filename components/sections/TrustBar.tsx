import { ShieldCheck, Gem, Headset, Smartphone } from "lucide-react";

const icons = [ShieldCheck, Gem, Headset, Smartphone];

export default function TrustBar({ items }: { items: string[] }) {
  return (
    <section className="border-b border-black/5 bg-[var(--color-bg-soft)]">
      <div className="container-nexa grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {items.map((text, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={text} className="flex items-center gap-3">
              <Icon className="shrink-0 text-[var(--color-secondary)]" size={22} />
              <p className="text-sm text-[var(--color-text)]/80">{text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
