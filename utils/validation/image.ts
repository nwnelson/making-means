import type { UploadInput } from "~~/server/services/storage.service";

export function getImageValidationMessage(file?: UploadInput | null) {
  if (!file) return "Please select an image.";

  const type = file.contentType;
  if (
    !type ||
    !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(type)
  ) {
    return "Unsupported image type. Please use JPEG, PNG, GIF, or WebP.";
  }

  // Check file size
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file?.size && file.size > maxSizeInBytes) {
    return "Image is too large. The maximum file size is 5 MB.";
  }

  return null;
}

export async function validateImageFile(file?: UploadInput | null) {
  return getImageValidationMessage(file) === null;
}
