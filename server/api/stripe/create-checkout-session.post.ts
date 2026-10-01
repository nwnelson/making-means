import { Stripe } from "stripe";
import { serverSupabaseClient } from "#supabase/server";
import {
  getArtworkShippingRate,
  readShippingQuoteToken,
} from "@server/services/shipping-quote.service";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);
  const currency = "usd";

  const body = await readBody(event);
  const artworkId = body?.artworkId;
  const quoteToken = body?.quoteToken;

  if (typeof artworkId !== "string" || typeof quoteToken !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Calculate shipping before checkout." });
  }

  try {
    const quote = readShippingQuoteToken(quoteToken, config.stripeSecretKey);
    if (quote.artworkId !== artworkId) {
      throw createError({ statusCode: 400, statusMessage: "The shipping estimate does not match this artwork." });
    }
    const currentShippingRate = await getArtworkShippingRate(artworkId, quote.continent);
    if (currentShippingRate !== quote.amountCents) {
      throw createError({ statusCode: 409, statusMessage: "The shipping rate changed. Please calculate it again." });
    }

    const supabase = await serverSupabaseClient(event);
    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .select("title,price,sold")
      .eq("id", artworkId)
      .maybeSingle();
    if (artworkError || !artwork || artwork.sold || artwork.price == null || artwork.price <= 0) {
      throw createError({ statusCode: 409, statusMessage: "This artwork is not available for purchase." });
    }
    const amount = Math.round(Number(artwork.price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: artwork.title || "Artwork",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: [
          quote.country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry,
        ],
      },
      shipping_options: [{
        shipping_rate_data: {
          display_name: `Shipping to ${quote.continent.replaceAll("_", " ")}`.slice(0, 100),
          type: "fixed_amount",
          fixed_amount: { amount: quote.amountCents, currency },
        },
      }],
      metadata: {
        artworkId: artworkId,
        price: amount,
        shippingQuoteCountry: quote.country,
        shippingRateContinent: quote.continent,
      },
      success_url: `${
        getRequestURL(event).origin
      }/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getRequestURL(event).origin}/payments/cancel`,
    });

    return { url: session.url };
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    console.error("Error creating Stripe checkout session:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create checkout session!" });
  }
});
