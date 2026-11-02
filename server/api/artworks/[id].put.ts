import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { updateArtwork } from "@server/services/artworks.service";
import { serverSupabaseClient } from "#supabase/server";
import { validateNewArtworkForm } from "@utils/validation/form";
import { extractNewArtworkFormData } from "~~/server/utils/form/artworkForm";

export default defineEventHandler(async (event) => {
  console.log("updating artwork!");

  await requireAdmin(event);

  const supabase = await serverSupabaseClient(event);
  const form = await readMultipartFormData(event);
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form data provided",
      },
    });
  }

  // get parameters
  const id = form.find((field) => field.name === "id")?.data?.toString();
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  const artworkForm = extractNewArtworkFormData(form);
  const soldField = form.find((field) => field.name === "sold");
  if (soldField) {
    const sold = soldField.data.toString();
    if (sold !== "true" && sold !== "false") {
      throw createError({ statusCode: 400, statusMessage: "Invalid sold value" });
    }
    artworkForm.sold = sold === "true";
  }

  const validatedForm = await validateNewArtworkForm(artworkForm);
  if (!validatedForm.success) {
    console.log("Invalid form: " + JSON.stringify(validatedForm));
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Invalid form!",
      },
    });
  }
  try {
    await updateArtwork(supabase, id, artworkForm);
    return { success: true };
  } catch (err) {
    console.log("error updating artwork: " + err);
    throw new Error("Failed to update artist!");
  }
});
