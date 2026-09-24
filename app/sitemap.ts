import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getPublishedServices } from "@/lib/data";

const BASE_URL = process.env.SITE_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/services", "/projects", "/about", "/how-we-work", "/faq", "/contact", "/quote", "/privacy", "/terms"];
  const services = getPublishedServices();

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({ url: `${BASE_URL}/${locale}${p}`, lastModified: new Date() });
    }
    for (const s of services) {
      entries.push({ url: `${BASE_URL}/${locale}/services/${s.slug}`, lastModified: new Date() });
    }
  }
  return entries;
}
