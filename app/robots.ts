import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/account/", "/notes/private/", "/admin/", "/internal/"],
    },
    sitemap: "https://keytake.ai/sitemap.xml",
  }
}
