import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import { getShippingContinent, type ShippingContinent } from "@utils/countryContinents";
import { isShippingCountryCode, type ShippingCountryCode } from "@utils/shippingCountries";

const QUOTE_LIFETIME_SECONDS = 30 * 60;

type QuotePayload = {
  artworkId: string;
  country: ShippingCountryCode;
  continent: ShippingContinent;
  amountCents: number;
  currency: "usd";
  expiresAt: number;
};

function getAdminClient() {
  const config = useRuntimeConfig();
  if (!config.public.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: "Shipping is unavailable." });
  }
  return createClient<Database>(config.public.supabaseUrl, config.supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createShippingQuoteToken(payload: QuotePayload, secret: string) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function readShippingQuoteToken(token: string, secret: string): QuotePayload {
  const [encoded, signature, extra] = token.split(".");
  const badToken = () => createError({ statusCode: 400, statusMessage: "Please recalculate shipping before checkout." });
  if (!encoded || !signature || extra) throw badToken();
  const expected = Buffer.from(sign(encoded, secret));
  const supplied = Buffer.from(signature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw badToken();

  let payload: QuotePayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as QuotePayload;
  } catch {
    throw badToken();
  }
  if (
    typeof payload.artworkId !== "string" ||
    !isShippingCountryCode(payload.country) ||
    getShippingContinent(payload.country) !== payload.continent ||
    !Number.isSafeInteger(payload.amountCents) || payload.amountCents < 0 ||
    payload.currency !== "usd" || !Number.isSafeInteger(payload.expiresAt) ||
    payload.expiresAt < Math.floor(Date.now() / 1000)
  ) throw badToken();
  return payload;
}

export async function getArtworkShippingRate(artworkId: string, continent: ShippingContinent) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("shipping_rates")
    .select("amount_cents")
    .eq("artwork_id", artworkId)
    .eq("continent", continent)
    .maybeSingle();

  if (error) {
    console.error("Failed to read artwork shipping rate", error.message);
    throw createError({ statusCode: 500, statusMessage: "Shipping rate could not be loaded." });
  }
  if (!data || data.amount_cents == null) {
    throw createError({ statusCode: 422, statusMessage: "Shipping is not configured for this artwork and destination." });
  }
  return data.amount_cents;
}

export async function requestArtworkShippingQuote(
  artworkId: string,
  country: ShippingCountryCode,
  signingSecret: string,
) {
  const continent = getShippingContinent(country);
  if (!continent) {
    throw createError({ statusCode: 400, statusMessage: "Shipping is not available for this country." });
  }

  const amountCents = await getArtworkShippingRate(artworkId, continent);
  const quote: QuotePayload = {
    artworkId,
    country,
    continent,
    amountCents,
    currency: "usd",
    expiresAt: Math.floor(Date.now() / 1000) + QUOTE_LIFETIME_SECONDS,
  };
  return {
    amount: amountCents / 100,
    amountCents,
    currency: quote.currency,
    continent,
    quoteToken: createShippingQuoteToken(quote, signingSecret),
  };
}
