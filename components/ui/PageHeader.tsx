export default function PageHeader({ title, text }: { title: string; text?: string }) {
  return (
    <div className="gradient-brand py-16 text-center text-white sm:py-20">
      <div className="container-nexa">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {text && <p className="mt-4 text-white/85">{text}</p>}
      </div>
    </div>
  );
}
