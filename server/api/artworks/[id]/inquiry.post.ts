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
  const artworkId = getRouterParam(event, "id");
  if (!artworkId || !z.uuid().safeParse(artworkId).success) {
    throw createError({ statusCode: 400, statusMessage: "Artwork not found." });
  }

  const parsed = inquirySchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Please complete each field with valid information." });
  }

  // Silently accept bot submissions that fill the hidden honeypot field.
  if (parsed.data.website) return { success: true };

  const supabase = await serverSupabaseClient(event);
  const { data: artwork, error: artworkError } = await supabase
    .from("artworks")
    .select("id,title,sold,artist:artists!artworks_artist_id_fkey(name)")
    .eq("id", artworkId)
    .maybeSingle();

  if (artworkError) {
    console.error("Failed to load artwork for purchase inquiry", artworkError.message);
    throw createError({ statusCode: 500, statusMessage: "The inquiry could not be sent. Please try again." });
  }
  if (!artwork) throw createError({ statusCode: 404, statusMessage: "This artwork could not be found." });
  if (artwork.sold) throw createError({ statusCode: 409, statusMessage: "This artwork has already been sold." });

  const config = useRuntimeConfig();
  if (!config.resendApiKey || !config.public.resendFromEmail || !config.public.adminEmail) {
    console.error("Purchase inquiry email is missing Resend configuration.");
    throw createError({ statusCode: 503, statusMessage: "The inquiry service is temporarily unavailable. Please try again later." });
  }

  const name = parsed.data.name;
  const email = parsed.data.email;
  const country = parsed.data.country;
  const cityPostalCode = parsed.data.cityPostalCode;
  const message = parsed.data.message;
  const artistName = artwork.artist?.name || "Unknown artist";
  const artworkUrl = `https://makingmeans.com/artworks/${encodeURIComponent(artwork.id)}`;
  const subjectTitle = artwork.title.replace(/[\r\n]+/g, " ").trim().slice(0, 120);
  const resend = new Resend(config.resendApiKey);

  const { error } = await resend.emails.send(
    {
      from: config.public.resendFromEmail,
      to: [config.public.adminEmail],
      replyTo: email,
      subject: `Artwork purchase inquiry: ${subjectTitle}`,
      text: [
        "New artwork purchase inquiry",
        "",
        `Artwork: ${artwork.title}`,
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
        <p><strong>Artwork:</strong> ${escapeHtml(artwork.title)}</p>
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
    console.error("Failed to send purchase inquiry email", error.message);
    throw createError({ statusCode: 502, statusMessage: "Your request could not be sent. Please try again." });
  }

  return { success: true };
});
