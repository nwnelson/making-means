import * as Sentry from "@sentry/nuxt";
import { inquiryError } from "~~/shared/utils/inquiry-telemetry";
import { Resend } from "resend";
import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  country: z.string().trim().min(2).max(100),
  cityPostalCode: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(2000),
  website: z.string().max(200).optional().default(""),
  requestId: z.uuid(),
});

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

export default defineEventHandler(async (event) => {
  const startedAt = Date.now();
  const artworkId = getRouterParam(event, "id");
  const headerId = getHeader(event, "x-inquiry-request-id");
  const context = {
    feature: "artwork_inquiry",
    side: "backend",
    requestId: z.uuid().safeParse(headerId).success ? headerId! : "unknown",
    artworkId: z.uuid().safeParse(artworkId).success ? artworkId! : "invalid",
  };
  let stage = "validation";
  let providerCode = "unknown";
  Sentry.logger.info("Inquiry request received", context);
  try {
    if (!artworkId || !z.uuid().safeParse(artworkId).success) {
      throw createError({ statusCode: 400, statusMessage: "Artwork not found." });
    }

    const body = await readBody(event);
    const parsed = inquirySchema.safeParse(body);
    if (z.uuid().safeParse(body?.requestId).success) context.requestId = body.requestId;
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: "Please complete each field with valid information." });
    }

    // Silently accept bot submissions that fill the hidden honeypot field.
    if (parsed.data.website) {
      Sentry.logger.info("Inquiry bot submission ignored", context);
      return { success: true };
    }
    Sentry.logger.info("Inquiry validation passed", context);
    stage = "artwork_lookup";

    const supabase = await serverSupabaseClient(event);
    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .select("id,title,sold,artist:artists!artworks_artist_id_fkey(name)")
      .eq("id", artworkId)
      .maybeSingle();

    if (artworkError) {
      if (/^[A-Z0-9]{5}$/.test(artworkError.code)) providerCode = artworkError.code;
      throw createError({ statusCode: 500, statusMessage: "The inquiry could not be sent. Please try again.", cause: inquiryError("Inquiry artwork lookup failed", artworkError) });
    }
    if (!artwork) throw createError({ statusCode: 404, statusMessage: "This artwork could not be found." });
    if (artwork.sold) throw createError({ statusCode: 409, statusMessage: "This artwork has already been sold." });

    Sentry.logger.info("Inquiry artwork lookup succeeded", context);
    stage = "configuration";
    const config = useRuntimeConfig();
    if (!config.resendApiKey || !config.public.resendFromEmail || !config.public.adminEmail) {
      throw createError({ statusCode: 503, statusMessage: "The inquiry service is temporarily unavailable. Please try again later." });
    }

    const name = parsed.data.name;
    const email = parsed.data.email;
    const country = parsed.data.country;
    const cityPostalCode = parsed.data.cityPostalCode;
    const message = parsed.data.message;
    const artworkTitle = artwork.title || "Untitled artwork";
    const artistName = artwork.artist?.name || "Unknown artist";
    const artworkUrl = `https://makingmeans.com/artworks/${encodeURIComponent(artwork.id)}`;
    const subjectTitle = artworkTitle.replace(/[\r\n]+/g, " ").trim().slice(0, 120);
    const resend = new Resend(config.resendApiKey);

    stage = "email_send";
    Sentry.logger.info("Inquiry email send started", context);
    const { error } = await resend.emails.send(
      {
        from: config.public.resendFromEmail,
        to: [config.public.adminEmail],
        replyTo: email,
        subject: `Artwork purchase inquiry: ${subjectTitle}`,
        text: [
          "New artwork purchase inquiry",
          "",
          `Artwork: ${artworkTitle}`,
          `Artist: ${artistName}`,
          `Artwork page: ${artworkUrl}`,
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Country: ${country}`,
          `City / Postal Code: ${cityPostalCode}`,
          "",
          "Message:",
          message,
        ].join("\n"),
        html: `
          <h1>New artwork purchase inquiry</h1>
          <p><strong>Artwork:</strong> ${escapeHtml(artworkTitle)}</p>
          <p><strong>Artist:</strong> ${escapeHtml(artistName)}</p>
          <p><strong>Artwork page:</strong> <a href="${escapeHtml(artworkUrl)}">${escapeHtml(artworkUrl)}</a></p>
          <hr>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Country:</strong> ${escapeHtml(country)}</p>
          <p><strong>City / Postal Code:</strong> ${escapeHtml(cityPostalCode)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
      },
      { idempotencyKey: `artwork-inquiry/${parsed.data.requestId}` },
    );

    if (error) {
      const knownCodes = ["validation_error", "missing_api_key", "invalid_api_key", "restricted_api_key", "rate_limit_exceeded", "daily_quota_exceeded", "monthly_quota_exceeded", "application_error", "internal_server_error", "invalid_from_address", "not_found", "invalid_idempotent_request", "concurrent_idempotent_requests"];
      if (knownCodes.includes(error.name)) providerCode = error.name;
      throw createError({ statusCode: 502, statusMessage: "Your request could not be sent. Please try again.", cause: inquiryError("Inquiry email provider failed", error) });
    }

    Sentry.logger.info("Inquiry email accepted by provider", { ...context, durationMs: Date.now() - startedAt });
    return { success: true };
  } catch (error) {
    const status = isError(error) ? error.statusCode : 500;
    const details = { ...context, stage, status, providerCode, durationMs: Date.now() - startedAt };
    if (status >= 400 && status < 500) {
      Sentry.logger.warn("Inquiry request rejected", details);
      throw error;
    }
    Sentry.logger.error("Inquiry request failed", details);
    // Capture the same safe error that Nitro receives, so SDK deduplication applies.
    const failure = isError(error) ? error : createError({
      statusCode: 500,
      statusMessage: "The inquiry could not be sent. Please try again.",
      cause: inquiryError("Unexpected inquiry failure", error),
    });
    Sentry.captureException(failure, {
      tags: { feature: context.feature, side: context.side, stage },
      contexts: { inquiry: details },
    });
    throw failure;
  }
});
