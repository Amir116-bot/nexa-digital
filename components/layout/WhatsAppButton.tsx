import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ phone, label }: { phone: string; label: string }) {
  const digits = phone.replace(/[^\d]/g, "");
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
