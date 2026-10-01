import type { ArtworkRow } from "~~/types/supabase/tables";
import type { ExhibitionArtwork, NewArtworkData } from "~~/types/artworks/artworks";
// import { useLoadingStore } from "~/stores/loading";

const { startLoading, stopLoading } = useLoading();

export function useArtworks() {
  const getArtworks = async () => {
    return useFetch<ArtworkRow[]>("/api/artworks/artworks", { lazy: true });
  };

  const getArtwork = async (id: string) => {
    return useFetch<ArtworkRow>(`/api/artworks/${id}`, {
      lazy: true,
    });
  };

  const getExhibitionArtworks = async () => {
    return useFetch<ExhibitionArtwork[]>("/api/artworks/exhibition");
  };

  const updateArtwork = async (id: string, form: FormData) => {
    return $fetch(`/api/artworks/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const addArtwork = async (artwork: NewArtworkData, image: File | null) => {
    // Validation
    if (
      !artwork.title ||
      !artwork.description ||
      !image ||
      !artwork.price ||
      !artwork.dimensions ||
      !artwork.artist
    ) {
      return {
        success: false,
        message: "Please enter all fields!",
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append("title", artwork.title);
    formData.append("description", artwork.description);
    formData.append("price", artwork.price);
    formData.append("dimensions", artwork.dimensions);
    formData.append("image", image);
    formData.append("artist", artwork.artist);
    formData.append("location", artwork.location || "");

    if (artwork.artwork_note) {
      formData.append("artwork_note", artwork.artwork_note);
    }

    try {
      startLoading();
      console.log("Submitting artwork...");
      const response = await fetch("/api/artworks/artwork", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            result?.data?.message ||
            result?.statusMessage ||
            "Failed to submit artwork. Please try again.",
        };
      }

      return {
        success: true,
        message: "Submitted artwork successfully!",
        data: result,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred! Please try again!",
      };
    } finally {
      stopLoading();
      // loadingStore.stopLoading();
    }
  };

  const removeArtwork = async (id: string) => {
    return $fetch(`/api/artworks/${id}`, {
      method: "DELETE",
    });
  };

  const addArtworkImages = async (artworkId: string, form: FormData) => {
    console.log("Submitting artwork images...");
    return await $fetch("/api/artworks/gallery/gallery", {
      method: "POST",
      body: form,
    });
  };

  const addCoverImage = async (form: FormData) => {
    console.log("Submitting artwork images...");
    return await $fetch("/api/artworks/coverImages/coverImage", {
      method: "POST",
      body: form,
    });
  };

  const removeCoverImage = async (id: number) => {
    return await $fetch(`/api/artworks/coverImages/${id}`, {
      method: "DELETE",
    });
  };

  return {
    getArtworks,
    getArtwork,
    getExhibitionArtworks,
    updateArtwork,
    addArtwork,
    removeArtwork,
    addArtworkImages,
    addCoverImage,
    removeCoverImage,
  };
}
