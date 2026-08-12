import type { MetadataRoute } from "next";

import { getAllGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/program",
    "/methodology",
    "/guides",
    "/tools",
    "/privacy",
    "/contact",
  ].map((route) => ({
    url: absoluteUrl(route || "/"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "/guides" || route === "/tools" ? 0.9 : 0.6,
  }));

  const guideRoutes = getAllGuides().map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: guide.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes, ...toolRoutes];
}
