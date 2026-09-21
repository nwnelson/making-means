import { NewArtworkData } from "~~/types/artworks/artworks";
import { MultiPartData } from "h3";

export const extractNewArtworkFormData = (form: MultiPartData[]) => {
  const artworkForm: NewArtworkData = {
    title: form.find((field) => field.name === "title")?.data?.toString() || "",
    description:
      form.find((field) => field.name === "description")?.data?.toString() ||
      "",
    location:
      form.find((field) => field.name === "location")?.data?.toString().trim() ||
      null,
    price: form.find((field) => field.name === "price")?.data?.toString() || "",
    dimensions:
      form.find((field) => field.name === "dimensions")?.data?.toString() || "",
    artist: form.find((field) => field.name === "artist")?.data?.toString() || "",
    artwork_note:
      form.find((field) => field.name === "artwork_note")?.data?.toString() ||
      "",
  };

  return artworkForm;
};
