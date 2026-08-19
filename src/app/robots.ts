import type { MetadataRoute } from "next";
import { CONTACT } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${CONTACT.domain}/sitemap.xml`,
    host: CONTACT.domain,
  };
}
