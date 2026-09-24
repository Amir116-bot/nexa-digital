import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import PageHeader from "@/components/ui/PageHeader";

const content = {
  ar: {
    title: "الشروط والأحكام",
    body: [
      "باستخدامك لهذا الموقع وطلب خدماتنا، فإنك توافق على الشروط التالية.",
      "يتم تحديد نطاق كل مشروع وتكلفته وموعد تسليمه باتفاق مكتوب مسبق بين الطرفين قبل بدء العمل.",
      "أي تعديلات خارج نطاق العمل المتفق عليه قد تخضع لتكلفة إضافية.",
      "تبقى حقوق الملكية الفكرية للأعمال المسلَّمة للعميل بعد استكمال السداد الكامل، ما لم يُتفق على خلاف ذلك.",
      "نحتفظ بالحق في عرض الأعمال المنجزة ضمن معرض أعمالنا ما لم يطلب العميل خلاف ذلك.",
    ],
  },
  en: {
    title: "Terms & Conditions",
    body: [
      "By using this website and requesting our services, you agree to the following terms.",
      "The scope, cost, and delivery timeline of each project are defined in a prior written agreement between both parties before work begins.",
      "Any changes outside the agreed scope of work may incur an additional cost.",
      "Intellectual property rights for delivered work transfer to the client after full payment is completed, unless otherwise agreed.",
      "We reserve the right to showcase completed work in our portfolio unless the client requests otherwise.",
    ],
  },
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const c = content[locale];

  return (
    <>
      <PageHeader title={c.title} />
      <section className="py-16">
        <div className="container-nexa mx-auto max-w-3xl space-y-4 text-[15px] leading-8 text-[var(--color-text)]/85">
          {c.body.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>
    </>
  );
}
