import type { MetadataRoute } from "next";

import { getDb } from "@/lib/mongodb";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the newest content edit as lastModified when the DB is reachable.
  let lastModified = new Date();
  try {
    const db = await getDb();
    const collections = ["projects", "certifications", "content"];
    const newest = await Promise.all(
      collections.map((name) =>
        db
          .collection(name)
          .find<{ updatedAt?: Date }>({}, { projection: { updatedAt: 1 } })
          .toArray()
      )
    );
    const dates = newest
      .flat()
      .map((doc) => doc.updatedAt)
      .filter((d): d is Date => d instanceof Date && !isNaN(d.getTime()));
    if (dates.length > 0) {
      lastModified = new Date(Math.max(...dates.map((d) => d.getTime())));
    }
  } catch {
    // DB unreachable — fall back to request time.
  }

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/certification`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/skills`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
