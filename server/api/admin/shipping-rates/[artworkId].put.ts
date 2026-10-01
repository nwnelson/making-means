import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { SHIPPING_CONTINENT_CODES } from "@utils/countryContinents";

const rateSchema = z.object({
  continent: z.enum(SHIPPING_CONTINENT_CODES),
  amountCents: z.number().int().min(0).max(100_000_000).nullable(),
});

const requestSchema = z.object({ rates: z.array(rateSchema).length(SHIPPING_CONTINENT_CODES.length) });

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const artworkId = getRouterParam(event, "artworkId");
  if (!artworkId) throw createError({ statusCode: 400, statusMessage: "Select an artwork." });

  const parsed = requestSchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Enter a valid rate for every continent." });
  }
  const uniqueContinents = new Set(parsed.data.rates.map((rate) => rate.continent));
  if (uniqueContinents.size !== SHIPPING_CONTINENT_CODES.length) {
    throw createError({ statusCode: 400, statusMessage: "Include each continent exactly once." });
  }

  const supabase = await serverSupabaseClient(event);
  const { error } = await supabase.from("shipping_rates").upsert(
    parsed.data.rates.map((rate) => ({
      artwork_id: artworkId,
      continent: rate.continent,
      amount_cents: rate.amountCents,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "artwork_id,continent" },
  );
  if (error) {
    console.error("Failed to save artwork shipping rates", error.message);
    throw createError({ statusCode: 500, statusMessage: "Shipping rates could not be saved." });
  }
  return { success: true };
});
