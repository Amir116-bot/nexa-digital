import type Database from "better-sqlite3";
import { hashPassword } from "../lib/auth";

export function seed(db: Database.Database) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nexadigital.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  db.prepare(
    `INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')`
  ).run(adminEmail, hashPassword(adminPassword), "Admin");

  const services = [
    {
      slug: "web-design-development",
      name_ar: "تصميم وتطوير المواقع",
      name_en: "Web Design & Development",
      desc_ar: "نصمم ونطور مواقع عصرية وسريعة ومتجاوبة تعكس هوية نشاطك وتساعدك على تحقيق أهدافك.",
      desc_en: "We design and build modern, fast, responsive websites that reflect your brand and help you reach your goals.",
      features_ar: JSON.stringify([
        "مواقع تعريفية","مواقع الشركات","المتاجر الإلكترونية","صفحات الهبوط",
        "أنظمة إدارة المحتوى","تحسين السرعة وتجربة المستخدم","تهيئة أساسية لمحركات البحث"
      ]),
      features_en: JSON.stringify([
        "Brochure websites","Corporate websites","E-commerce stores","Landing pages",
        "Content management systems","Speed & UX optimization","Basic SEO setup"
      ]),
      category: "development",
      icon: "Globe",
      display_order: 1,
    },
    {
      slug: "app-development",
      name_ar: "تطوير التطبيقات",
      name_en: "App Development",
      desc_ar: "نحوّل فكرتك إلى تطبيق عملي وسهل الاستخدام للهواتف والأجهزة المختلفة.",
      desc_en: "We turn your idea into a practical, easy-to-use app for phones and other devices.",
      features_ar: JSON.stringify([
        "تطبيقات Android","تطبيقات iOS","تطبيقات Flutter أو React Native",
        "تصميم واجهات المستخدم","ربط قواعد البيانات وواجهات API","لوحات تحكم للتطبيقات"
      ]),
      features_en: JSON.stringify([
        "Android apps","iOS apps","Flutter or React Native apps",
        "UI design","Database & API integration","App admin dashboards"
      ]),
      category: "development",
      icon: "Smartphone",
      display_order: 2,
    },
    {
      slug: "graphic-design",
      name_ar: "التصميم الجرافيكي",
      name_en: "Graphic Design",
      desc_ar: "نصمم مواد بصرية تساعد علامتك التجارية على الظهور بشكل مميز ومتناسق.",
      desc_en: "We design visual materials that help your brand stand out with a consistent identity.",
      features_ar: JSON.stringify([
        "تصميم الشعارات","الهوية البصرية","منشورات وسائل التواصل","الإعلانات الرقمية",
        "البروشورات والملفات التعريفية","تصميم العروض التقديمية","تصميم الصور المصغرة"
      ]),
      features_en: JSON.stringify([
        "Logo design","Brand identity","Social media posts","Digital ads",
        "Brochures & profiles","Presentation design","Thumbnail design"
      ]),
      category: "design",
      icon: "Palette",
      display_order: 3,
    },
    {
      slug: "content-writing",
      name_ar: "كتابة المحتوى والمقالات",
      name_en: "Content & Article Writing",
      desc_ar: "خدمة اختيارية تشمل كتابة مقالات المواقع والمحتوى التسويقي ووصف المنتجات.",
      desc_en: "An optional service covering website articles, marketing content, and product descriptions.",
      features_ar: JSON.stringify([
        "كتابة مقالات المواقع","كتابة المحتوى التسويقي","وصف المنتجات","كتابة صفحات المواقع",
        "مقالات التخرج والأبحاث وفق الضوابط الأكاديمية والأخلاقية","التدقيق اللغوي وإعادة الصياغة","الترجمة"
      ]),
      features_en: JSON.stringify([
        "Website articles","Marketing content","Product descriptions","Website page copy",
        "Academic/research writing support, within academic and ethical guidelines","Proofreading & rewriting","Translation"
      ]),
      category: "content",
      icon: "PenLine",
      display_order: 4,
      status: "hidden", // toggle from admin panel to publish
    },
  ];

  const insertService = db.prepare(`
    INSERT OR IGNORE INTO services
    (slug, name_ar, name_en, desc_ar, desc_en, features_ar, features_en, category, icon, status, display_order)
    VALUES (@slug, @name_ar, @name_en, @desc_ar, @desc_en, @features_ar, @features_en, @category, @icon, @status, @display_order)
  `);
  for (const s of services) {
    insertService.run({ status: "published", ...s });
  }

  const faqs = [
    { q_ar: "كم يستغرق تنفيذ الموقع؟", q_en: "How long does building a website take?",
      a_ar: "تختلف المدة حسب حجم المشروع، لكن غالبًا ما تتراوح بين أسبوعين وستة أسابيع.",
      a_en: "It depends on the project's size, but it usually ranges from two to six weeks." },
    { q_ar: "هل يمكن تعديل الموقع بعد التسليم؟", q_en: "Can the site be edited after delivery?",
      a_ar: "نعم، عبر لوحة تحكم سهلة الاستخدام أو بطلب تعديل منا حسب الاتفاق.",
      a_en: "Yes, either through an easy-to-use admin panel or by requesting edits from us, as agreed." },
    { q_ar: "هل تقدمون خدمات الصيانة؟", q_en: "Do you offer maintenance services?",
      a_ar: "نعم، نقدم باقات صيانة ودعم مستمر بعد التسليم.", a_en: "Yes, we offer maintenance and ongoing support packages after delivery." },
    { q_ar: "هل يمكن إضافة خدمات جديدة لاحقًا؟", q_en: "Can new services be added later?",
      a_ar: "بالتأكيد، النظام مصمم ليكون مرنًا لإضافة خدمات جديدة من لوحة التحكم.",
      a_en: "Absolutely — the system is built to let us add new services flexibly from the admin panel." },
    { q_ar: "هل تعملون مع الأفراد والشركات؟", q_en: "Do you work with individuals and companies?",
      a_ar: "نعم، نعمل مع الأفراد والشركات الناشئة والمؤسسات.", a_en: "Yes, we work with individuals, startups, and organizations." },
    { q_ar: "هل يمكن ربط الموقع بواتساب؟", q_en: "Can the site be connected to WhatsApp?",
      a_ar: "نعم، يمكن إضافة زر واتساب عائم قابل للتفعيل من لوحة التحكم.",
      a_en: "Yes — a floating WhatsApp button can be enabled from the admin panel." },
    { q_ar: "هل تدعمون اللغة العربية والإنجليزية؟", q_en: "Do you support Arabic and English?",
      a_ar: "نعم، الموقع يدعم اللغتين بالكامل مع اتجاه RTL وLTR.", a_en: "Yes, the site fully supports both languages with RTL and LTR." },
    { q_ar: "كيف يتم تحديد سعر المشروع؟", q_en: "How is the project price determined?",
      a_ar: "حسب نطاق العمل، عدد الصفحات أو المزايا، والمدة الزمنية المطلوبة.",
      a_en: "Based on the scope of work, number of pages or features, and the timeline required." },
    { q_ar: "هل تقدمون استضافة واسم نطاق؟", q_en: "Do you provide hosting and a domain?",
      a_ar: "يمكننا مساعدتك في اختيار وربط الاستضافة واسم النطاق المناسبين.",
      a_en: "We can help you choose and connect the right hosting and domain." },
    { q_ar: "هل يمكن طلب خدمة مخصصة؟", q_en: "Can I request a custom service?",
      a_ar: "بالتأكيد، تواصل معنا ووضّح احتياجك وسنقترح الحل المناسب.",
      a_en: "Of course — reach out with your need and we'll suggest the right solution." },
  ];

  const insertFaq = db.prepare(`
    INSERT INTO faqs (question_ar, question_en, answer_ar, answer_en, status, display_order)
    VALUES (?, ?, ?, ?, 'published', ?)
  `);
  faqs.forEach((f, i) => insertFaq.run(f.q_ar, f.q_en, f.a_ar, f.a_en, i + 1));

  const settings: Record<string, string> = {
    site_name: "Nexa Digital",
    tagline_ar: "نحوّل أفكارك إلى تجارب رقمية ناجحة",
    tagline_en: "We turn your ideas into successful digital experiences",
    email: "hello@nexadigital.com",
    phone: "+213500000000",
    whatsapp: "+213500000000",
    whatsapp_enabled: "true",
    address_ar: "الجزائر",
    address_en: "Algeria",
    instagram: "https://instagram.com/nexadigital",
    facebook: "https://facebook.com/nexadigital",
    tiktok: "",
    linkedin: "",
    telegram: "",
    content_service_enabled: "false",
    default_locale: "ar",
    dark_mode_enabled: "false",
    meta_title_ar: "Nexa Digital — وكالة رقمية",
    meta_title_en: "Nexa Digital — Digital Agency",
    meta_description_ar: "نحوّل أفكارك إلى تجارب رقمية ناجحة: تصميم مواقع، تطوير تطبيقات، وهوية بصرية.",
    meta_description_en: "We turn your ideas into digital experiences: websites, apps, and brand identity.",
    google_analytics_id: "",
    primary_color: "#0B1E3F",
    secondary_color: "#5B2EBD",
    accent_color: "#22D3C6",
  };
  const upsertSetting = db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO NOTHING
  `);
  for (const [k, v] of Object.entries(settings)) upsertSetting.run(k, v);

  console.log("Seed complete. Admin login:", adminEmail, "/", adminPassword);
}
