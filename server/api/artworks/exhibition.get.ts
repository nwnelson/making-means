import { serverSupabaseClient } from "#supabase/server";
import { getExhibitionArtworks } from "@server/services/artworks.service";

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);
    return await getExhibitionArtworks(supabase, getQuery(event).includeSold === "true");
  } catch (error) {
    console.error("Failed to fetch exhibition artworks:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: { message: "Failed to fetch exhibition artworks" },
    });
  }
});
