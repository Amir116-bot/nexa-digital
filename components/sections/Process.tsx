export default function Process({ dict }: { dict: any }) {
  const steps = dict.process.steps as { title: string; text: string }[];
  return (
    <section className="py-20 sm:py-24">
      <div className="container-nexa">
        <h2 className="text-center text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
          {dict.process.title}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-black/5 bg-white p-5">
              <span className="text-sm font-semibold text-[var(--color-secondary)]">{i + 1}</span>
              <p className="mt-2 font-semibold text-[var(--color-primary)]">{step.title}</p>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">{step.text}</p>
              {i < steps.length - 1 && (
                <span className="absolute top-1/2 hidden h-px w-6 bg-black/10 lg:block lg:end-[-1.5rem]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
