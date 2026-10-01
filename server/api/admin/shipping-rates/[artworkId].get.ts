import { serverSupabaseClient } from "#supabase/server";
import { requireAdmin } from "@server/utils/auth/requireAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const artworkId = getRouterParam(event, "artworkId");
  if (!artworkId) throw createError({ statusCode: 400, statusMessage: "Select an artwork." });

  const supabase = await serverSupabaseClient(event);
  const { data, error } = await supabase
    .from("shipping_rates")
    .select("artwork_id,continent,amount_cents,updated_at")
    .eq("artwork_id", artworkId)
    .order("continent");
  if (error) {
    console.error("Failed to load artwork shipping rates", error.message);
    throw createError({ statusCode: 500, statusMessage: "Shipping rates could not be loaded." });
  }
  return data;
});
