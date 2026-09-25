import { db, getAllSettings } from "./db";

export type Service = {
  id: number; slug: string; name_ar: string; name_en: string;
  desc_ar: string; desc_en: string; features_ar: string; features_en: string;
  category: string; icon: string; image: string | null; price: string | null;
  duration: string | null; status: string; display_order: number;
};

export type Project = {
  id: number; title_ar: string; title_en: string; type_ar: string | null; type_en: string | null;
  desc_ar: string | null; desc_en: string | null; cover_image: string | null; gallery: string;
  project_url: string | null; service_id: number | null; is_demo: number; status: string; display_order: number;
};

export type Faq = {
  id: number; question_ar: string; question_en: string; answer_ar: string; answer_en: string;
  service_id: number | null; status: string; display_order: number;
};

const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    slug: "web-design-development",
    name_ar: "تصميم وتطوير المواقع",
    name_en: "Web Design & Development",
    desc_ar: "نصمم ونطور مواقع عصرية وسريعة ومتجاوبة تعكس هوية نشاطك وتساعدك على تحقيق أهدافك.",
    desc_en: "We design and build modern, fast, responsive websites that reflect your brand and help you reach your goals.",
    features_ar: JSON.stringify([
      "مواقع تعريفية", "مواقع الشركات", "المتاجر الإلكترونية", "صفحات الهبوط",
      "أنظمة إدارة المحتوى", "تحسين السرعة وتجربة المستخدم", "تهيئة أساسية لمحركات البحث"
    ]),
    features_en: JSON.stringify([
      "Brochure websites", "Corporate websites", "E-commerce stores", "Landing pages",
      "Content management systems", "Speed & UX optimization", "Basic SEO setup"
    ]),
    category: "development",
    icon: "Globe",
    image: null,
    price: null,
    duration: null,
    status: "published",
    display_order: 1,
  },
  {
    id: 2,
    slug: "app-development",
    name_ar: "تطوير التطبيقات",
    name_en: "App Development",
    desc_ar: "نحوّل فكرتك إلى تطبيق عملي وسهل الاستخدام للهواتف والأجهزة المختلفة.",
    desc_en: "We turn your idea into a practical, easy-to-use app for phones and other devices.",
    features_ar: JSON.stringify([
      "تطبيقات Android", "تطبيقات iOS", "تطبيقات Flutter أو React Native",
      "تصميم واجهات المستخدم", "ربط قواعد البيانات وواجهات API", "لوحات تحكم للتطبيقات"
    ]),
    features_en: JSON.stringify([
      "Android apps", "iOS apps", "Flutter or React Native apps",
      "UI design", "Database & API integration", "App admin dashboards"
    ]),
    category: "development",
    icon: "Smartphone",
    image: null,
    price: null,
    duration: null,
    status: "published",
    display_order: 2,
  },
  {
    id: 3,
    slug: "graphic-design",
    name_ar: "التصميم الجرافيكي",
    name_en: "Graphic Design",
    desc_ar: "نصمم مواد بصرية تساعد علامتك التجارية على الظهور بشكل مميز ومتناسق.",
    desc_en: "We design visual materials that help your brand stand out with a consistent identity.",
    features_ar: JSON.stringify([
      "تصميم الشعارات", "الهوية البصرية", "منشورات وسائل التواصل", "الإعلانات الرقمية",
      "البروشورات والملفات التعريفية", "تصميم العروض التقديمية", "تصميم الصور المصغرة"
    ]),
    features_en: JSON.stringify([
      "Logo design", "Brand identity", "Social media posts", "Digital ads",
      "Brochures & profiles", "Presentation design", "Thumbnail design"
    ]),
    category: "design",
    icon: "Palette",
    image: null,
    price: null,
    duration: null,
    status: "published",
    display_order: 3,
  },
  {
    id: 4,
    slug: "content-writing",
    name_ar: "كتابة المحتوى والمقالات",
    name_en: "Content & Article Writing",
    desc_ar: "خدمة اختيارية تشمل كتابة مقالات المواقع والمحتوى التسويقي ووصف المنتجات.",
    desc_en: "An optional service covering website articles, marketing content, and product descriptions.",
    features_ar: JSON.stringify([
      "كتابة مقالات المواقع", "كتابة المحتوى التسويقي", "وصف المنتجات", "كتابة صفحات المواقع",
      "مقالات التخرج والأبحاث وفق الضوابط الأكاديمية والأخلاقية", "التدقيق اللغوي وإعادة الصياغة", "الترجمة"
    ]),
    features_en: JSON.stringify([
      "Website articles", "Marketing content", "Product descriptions", "Website page copy",
      "Academic/research writing support, within academic and ethical guidelines", "Proofreading & rewriting", "Translation"
    ]),
    category: "content",
    icon: "PenLine",
    image: null,
    price: null,
    duration: null,
    status: "hidden",
    display_order: 4,
  },
];

const DEFAULT_FAQS: Faq[] = [
  { id: 1, question_ar: "كم يستغرق تنفيذ الموقع؟", question_en: "How long does building a website take?", answer_ar: "تختلف المدة حسب حجم المشروع، لكن غالبًا ما تتراوح بين أسبوعين وستة أسابيع.", answer_en: "It depends on the project's size, but it usually ranges from two to six weeks.", service_id: null, status: "published", display_order: 1 },
  { id: 2, question_ar: "هل يمكن تعديل الموقع بعد التسليم؟", question_en: "Can the site be edited after delivery?", answer_ar: "نعم، عبر لوحة تحكم سهلة الاستخدام أو بطلب تعديل منا حسب الاتفاق.", answer_en: "Yes, either through an easy-to-use admin panel or by requesting edits from us, as agreed.", service_id: null, status: "published", display_order: 2 },
  { id: 3, question_ar: "هل تقدمون خدمات الصيانة؟", question_en: "Do you offer maintenance services?", answer_ar: "نعم، نقدم باقات صيانة ودعم مستمر بعد التسليم.", answer_en: "Yes, we offer maintenance and ongoing support packages after delivery.", service_id: null, status: "published", display_order: 3 },
  { id: 4, question_ar: "هل يمكن إضافة خدمات جديدة لاحقًا؟", question_en: "Can new services be added later?", answer_ar: "بالتأكيد، النظام مصمم ليكون مرنًا لإضافة خدمات جديدة من لوحة التحكم.", answer_en: "Absolutely — the system is built to let us add new services flexibly from the admin panel.", service_id: null, status: "published", display_order: 4 },
  { id: 5, question_ar: "هل تعملون مع الأفراد والشركات؟", question_en: "Do you work with individuals and companies?", answer_ar: "نعم، نعمل مع الأفراد والشركات الناشئة والمؤسسات.", answer_en: "Yes, we work with individuals, startups, and organizations.", service_id: null, status: "published", display_order: 5 },
  { id: 6, question_ar: "هل يمكن ربط الموقع بواتساب؟", question_en: "Can the site be connected to WhatsApp?", answer_ar: "نعم، يمكن إضافة زر واتساب عائم قابل للتفعيل من لوحة التحكم.", answer_en: "Yes — a floating WhatsApp button can be enabled from the admin panel.", service_id: null, status: "published", display_order: 6 },
  { id: 7, question_ar: "هل تدعمون اللغة العربية والإنجليزية؟", question_en: "Do you support Arabic and English?", answer_ar: "نعم، الموقع يدعم اللغتين بالكامل مع اتجاه RTL وLTR.", answer_en: "Yes, the site fully supports both languages with RTL and LTR.", service_id: null, status: "published", display_order: 7 },
  { id: 8, question_ar: "كيف يتم تحديد سعر المشروع؟", question_en: "How is the project price determined?", answer_ar: "حسب نطاق العمل، عدد الصفحات أو المزايا، والمدة الزمنية المطلوبة.", answer_en: "Based on the scope of work, number of pages or features, and the timeline required.", service_id: null, status: "published", display_order: 8 },
  { id: 9, question_ar: "هل تقدمون استضافة واسم نطاق؟", question_en: "Do you provide hosting and a domain?", answer_ar: "يمكننا مساعدتك في اختيار وربط الاستضافة واسم النطاق المناسبين.", answer_en: "We can help you choose and connect the right hosting and domain.", service_id: null, status: "published", display_order: 9 },
  { id: 10, question_ar: "هل يمكن طلب خدمة مخصصة؟", question_en: "Can I request a custom service?", answer_ar: "بالتأكيد، تواصل معنا ووضّح احتياجك وسنقترح الحل المناسب.", answer_en: "Of course — reach out with your need and we'll suggest the right solution.", service_id: null, status: "published", display_order: 10 },
];

export function getPublishedServices(): Service[] {
  const contentEnabled = getAllSettings().content_service_enabled === "true";
  try {
    const rows = db
      .prepare(`SELECT * FROM services WHERE status = 'published' ORDER BY display_order ASC, id ASC`)
      .all() as Service[];
    if (rows && rows.length > 0) {
      return rows.filter((s) => (s.slug === "content-writing" ? contentEnabled : true));
    }
  } catch (e) {
    console.warn("Using default static services fallback (serverless mode):", e);
  }
  return DEFAULT_SERVICES.filter((s) => s.status === "published" && (s.slug === "content-writing" ? contentEnabled : true));
}

export function getServiceBySlug(slug: string): Service | undefined {
  try {
    const row = db.prepare(`SELECT * FROM services WHERE slug = ?`).get(slug) as Service | undefined;
    if (row) return row;
  } catch (e) {
    console.warn("Using default static service fallback by slug:", e);
  }
  return DEFAULT_SERVICES.find((s) => s.slug === slug);
}

export function getPublishedProjects(limit?: number): Project[] {
  try {
    const q = `SELECT * FROM projects WHERE status = 'published' ORDER BY display_order ASC, id DESC` + (limit ? ` LIMIT ${limit}` : "");
    const rows = db.prepare(q).all() as Project[];
    if (rows) return rows;
  } catch (e) {
    console.warn("Using default static projects fallback:", e);
  }
  return [];
}

export function getPublishedFaqs(): Faq[] {
  try {
    const rows = db.prepare(`SELECT * FROM faqs WHERE status = 'published' ORDER BY display_order ASC, id ASC`).all() as Faq[];
    if (rows && rows.length > 0) return rows;
  } catch (e) {
    console.warn("Using default static FAQs fallback:", e);
  }
  return DEFAULT_FAQS;
}

export function getSiteSettings() {
  return getAllSettings();
}
