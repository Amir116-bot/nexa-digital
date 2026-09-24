import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/data";
import PageHeader from "@/components/ui/PageHeader";

const content = {
  ar: {
    title: "سياسة الخصوصية",
    body: [
      "نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.",
      "نجمع فقط البيانات التي تزودنا بها طواعية عبر نماذج التواصل أو طلب عرض السعر، مثل الاسم والبريد الإلكتروني ورقم الهاتف وتفاصيل المشروع.",
      "تُستخدم هذه البيانات فقط للتواصل معك بخصوص طلبك ولا تتم مشاركتها مع أي طرف ثالث دون موافقتك.",
      "يمكنك في أي وقت طلب حذف بياناتك من خلال التواصل معنا مباشرة.",
    ],
  },
  en: {
    title: "Privacy Policy",
    body: [
      "We respect your privacy and are committed to protecting your personal data.",
      "We only collect the data you voluntarily provide through our contact or quote forms, such as your name, email, phone number, and project details.",
      "This data is used solely to communicate with you about your request and is never shared with third parties without your consent.",
      "You may request deletion of your data at any time by contacting us directly.",
    ],
  },
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const c = content[locale];
  const settings = getSiteSettings();

  return (
    <>
      <PageHeader title={c.title} />
      <section className="py-16">
        <div className="container-nexa mx-auto max-w-3xl space-y-4 text-[15px] leading-8 text-[var(--color-text)]/85">
          {c.body.map((p) => <p key={p}>{p}</p>)}
          <p className="pt-2 text-sm text-[var(--color-text-soft)]">{settings.email}</p>
        </div>
      </section>
    </>
  );
}
