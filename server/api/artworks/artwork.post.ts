import { addArtwork } from "@server/services/artworks.service";
import { validateNewArtworkForm } from "@utils/validation/form";
import { serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";
import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { UploadInput } from "~~/server/services/storage.service";
import type { NewArtworkData } from "#types/artworks/artworks";
import { extractNewArtworkFormData } from "~~/server/utils/form/artworkForm";
import { getImageValidationMessage } from "~~/utils/validation/image";

export default defineEventHandler(async (event) => {
  const adminUser = await requireAdmin(event);
  const form = await readMultipartFormData(event); // MultiPartData[]

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Please complete the artwork form.",
      },
    });
  }

  const artworkForm: NewArtworkData = extractNewArtworkFormData(form);

  const imageField = form.find((field) => field.name === "image");

  if (!artworkForm || !imageField) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Please provide an artwork image and complete all required fields.",
      },
    });
  }

  const validatedForm = await validateNewArtworkForm(artworkForm);
  if (!validatedForm.success) {
    // invalid form
    console.log("Invalid artwork form");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: validatedForm.error.issues[0]?.message || "Please check the artwork details.",
      },
    });
  }

  const image: UploadInput = {
    filename: imageField?.filename || "",
    buffer: imageField?.data || Buffer.from([]),
    size: imageField?.data ? imageField.data.length : 0,
    contentType: imageField?.type || "application/octet-stream",
  };

  // validate image
  const imageValidationMessage = getImageValidationMessage(image);
  if (imageValidationMessage) {
    console.log("Invalid image file!");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: imageValidationMessage,
      },
    });
  }
  console.log("image validation passed");

  try {
    const supabase = (await serverSupabaseClient(
      event,
    )) as SupabaseClient<Database>;

    await addArtwork(supabase, artworkForm, image);
  } catch (err) {
    console.log("error adding artwork: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create artwork",
      data: {
        message: "The artwork could not be uploaded. Please try again.",
      },
    });
  }

  return { success: true, message: "Artwork added successfully!" };
});
