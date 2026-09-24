import { CheckCircle2 } from "lucide-react";

export default function WhyUs({ dict }: { dict: any }) {
  return (
    <section className="bg-[var(--color-bg-soft)] py-20 sm:py-24">
      <div className="container-nexa grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">{dict.why.title}</h2>
        </div>
        <ul className="space-y-4">
          {dict.why.items.map((item: string) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={20} />
              <span className="text-[var(--color-text)]/85">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
