import { createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";

const siteUrl = "https://makingmeans.com";
const publicPaths = [
  "/",
  "/exhibition-sales",
  "/artists/all",
  "/the-oasis",
  "/impact",
  "/stories",
  "/about",
  "/contact",
  "/artworks/available",
  "/artworks/gallery",
  "/collections/collections",
  "/commissions",
];

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]!);
}

export default defineEventHandler(async (event) => {
  const { url, key } = useRuntimeConfig(event).public.supabase;
  // Never use a visitor's session or a service-role key for the public sitemap.
  const supabase = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const results = await Promise.allSettled(
    (["artists", "artworks", "collections"] as const).map(async (table) => {
      const paths: string[] = [];
      let offset = 0;
      while (true) {
        const { data, error } = await supabase
          .from(table)
          .select("id")
          .order("id", { ascending: true })
          .range(offset, offset + 499)
          .abortSignal(AbortSignal.timeout(10000));

        if (error || !data) throw new Error(`Unable to load sitemap ${table}`);
        if (data.length === 0) break;
        paths.push(...data.map(({ id }) => `/${table}/${encodeURIComponent(id)}`));
        offset += data.length;
        if (offset > 50000) throw new Error("Sitemap requires an index");
      }
      return paths;
    }),
  );

  // A failed query must not publish a successful but incomplete sitemap.
  if (results.some((result) => result.status === "rejected")) {
    throw createError({ statusCode: 503, statusMessage: "Sitemap temporarily unavailable" });
  }

  const paths = [...publicPaths];
  for (const result of results) {
    if (result.status === "fulfilled") paths.push(...result.value);
  }
  const uniquePaths = [...new Set(paths)];
  if (uniquePaths.length > 50000) {
    throw createError({ statusCode: 503, statusMessage: "Sitemap requires an index" });
  }

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=300");
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + uniquePaths.map((path) => `  <url><loc>${escapeXml(siteUrl + path)}</loc></url>`).join("\n")
    + "\n</urlset>\n";
});
