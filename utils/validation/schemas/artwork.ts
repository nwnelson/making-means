import { z } from "zod";
import { priceSchema, FileType } from "./common";

const artworkFields = {
  title: z.string().min(1, { message: "Title is required" }).max(50, { message: "Title is too long" }),
  description: z.string().min(1, { message: "Description is required" }).max(5000, { message: "Description is too long (maximum 5,000 characters)" }),
  location: z.string().nullable().optional(),
  price: priceSchema,
  dimensions: z.string().min(1, { message: "Dimensions are required" }).max(50, { message: "Dimensions is too long" }),
};

export const artworkFormSchema = z.object({
  ...artworkFields,
  artwork_note: z.string().optional(),
  artist: z.uuid({ message: "Artist is required" }),
}).strict().strip();

export const existingArtworkFormSchema = z.object({
  id: z.uuid(),
  ...artworkFields,
  image: z.custom<File>((v) => v instanceof FileType).optional(),
}).strict().strip();

export type ArtworkForm = z.infer<typeof artworkFormSchema>;
export type ExistingArtworkForm = z.infer<typeof existingArtworkFormSchema>;
