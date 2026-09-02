<script setup lang="ts">
import type { CoverImageRow } from "~~/types/supabase/tables";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Admin Cover Images",
  robots: "noindex, nofollow",
});

const { removeCoverImage } = useArtworks();
const { startLoading, stopLoading } = useLoading();

const {
  data: coverImages,
  pending,
  error,
} = await useFetch<CoverImageRow[]>("/api/artworks/coverImages/coverImages");

async function addImage() {
  await navigateTo("/admin/newContent/addCoverImages");
}

async function removeImage(id: number) {
  try {
    startLoading();
    await removeCoverImage(id);
    toast.success("Image has been removed!");
  } catch {
    toast.error("Something went wrong");
  } finally {
    stopLoading();
  }
}
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Cover images" description="Manage images used by the landing-page presentation.">
      <template #actions><Button @click="addImage">Add image</Button></template>
    </AdminPageHeader>
    <AdminEmptyState v-if="error" title="Cover images could not be loaded" message="Refresh the page to try again." />
    <div v-else-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading cover images…</h2></div></div>
    <AdminEmptyState v-else-if="!coverImages?.length" title="No cover images yet" message="Add an image for the landing page."><Button @click="addImage">Add image</Button></AdminEmptyState>
    <div v-else class="admin-cards">
      <article v-for="image in coverImages" :key="image.id" class="admin-card">
        <NuxtImg :src="image.image_path ?? undefined" alt="Landing page cover" class="admin-card__image" />
        <div class="admin-card__body"><div class="admin-card__actions"><Button variant="danger" @click="removeImage(image.id)">Remove</Button></div></div>
      </article>
    </div>
  </div>
</template>
