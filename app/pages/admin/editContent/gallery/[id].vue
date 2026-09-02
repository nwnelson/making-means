<script lang="ts" setup>
import type { GalleryRow } from "~~/types/supabase/tables";
import { toast } from "vue-sonner";

// To Do: implement edit gallery functionality
// To Do: refactor - this is basically a copy of ArtworkGallery component

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Edit Gallery",
  robots: "noindex, nofollow",
});

const route = useRoute();

// To Do: fix - id will be undefined on first render
const artworkId = computed(() => route.params.id as string); // Issue

const { addArtworkImages } = useArtworks();
const { deleteImage } = useGallery();
const { startLoading, stopLoading } = useLoading();

const viewFileUpload = ref(false);

function toggleFileUpload() {
  viewFileUpload.value = !viewFileUpload.value;
}

async function uploadFiles(files: File[]) {
  console.log("Files to upload:", files);
  toggleFileUpload();

  const formData = new FormData();
  formData.append("artworkId", artworkId.value);
  files.forEach((image) => {
    formData.append(`image`, image);
  });

  try {
    startLoading();
    await addArtworkImages(artworkId.value, formData);
    toast.success("Successfully added images!");
  } catch {
    toast.error("something went wrong!");
  } finally {
    stopLoading();
  }
}

async function removePhoto(id: string) {
  console.log("removing photo!");
  const res = await deleteImage(id);
  toast(res.message);
}

const {
  data: gallery,
  pending,
  error,
} = useFetch<GalleryRow[]>(`/api/artworks/gallery/${artworkId.value}`);
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Artwork gallery" description="Manage the additional images shown with this artwork.">
      <template #actions><Button variant="ghost" @click="navigateTo('/admin/editContent/artworks/' + artworkId)">Back to artwork</Button><Button @click="toggleFileUpload">Add photos</Button></template>
    </AdminPageHeader>
    <FileUpload v-if="viewFileUpload" @close="toggleFileUpload" @upload="uploadFiles" />
    <AdminEmptyState v-if="error" title="Gallery could not be loaded" message="Refresh the page to try again." />
    <div v-else-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading gallery…</h2></div></div>
    <AdminEmptyState v-else-if="!gallery?.length" title="No gallery images" message="Add supporting images for this artwork."><Button @click="toggleFileUpload">Add photos</Button></AdminEmptyState>
    <div v-else class="gallery-admin-grid">
      <article v-for="g in gallery" :key="g.id" class="admin-card">
        <NuxtImg :src="g.image_path ?? undefined" alt="Artwork gallery image" class="admin-card__image" />
        <div class="admin-card__body"><div class="admin-card__actions"><Button variant="danger" @click="removePhoto(g.id)">Remove</Button></div></div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.gallery-admin-grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1rem; }
@media (min-width: 600px) { .gallery-admin-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1000px) { .gallery-admin-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
</style>
