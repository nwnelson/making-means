import { z } from "zod";
import { SHIPPING_COUNTRY_CODES } from "@utils/shippingCountries";
import { requestArtworkShippingQuote } from "@server/services/shipping-quote.service";

const requestSchema = z.object({
  artworkId: z.uuid(),
  country: z.enum(SHIPPING_COUNTRY_CODES),
});

export default defineEventHandler(async (event) => {
  const parsed = requestSchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Select a valid shipping country." });
  }
  const config = useRuntimeConfig();
  return requestArtworkShippingQuote(parsed.data.artworkId, parsed.data.country, config.stripeSecretKey);
});
