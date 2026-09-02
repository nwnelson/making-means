<script lang="ts" setup>
import { formatDateShort } from "#imports";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Admin Artworks",
  robots: "noindex, nofollow",
});

const { getArtworks } = useArtworks();
const { startLoading, stopLoading } = useLoading();

const imagesLoaded = ref(false);

const { data: artworks, error, pending } = await getArtworks();

watch(pending, (newVal) => {
  if (newVal) {
    startLoading();
  } else {
    stopLoading();
  }
});

watch(artworks, async (val) => {
  if (val) {
    const imagePromises = val.map((artwork) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = artwork?.image_path ?? "";
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
      });
    });

    await Promise.all(imagePromises);
    imagesLoaded.value = true;
  }
});

const addArtwork = () => {
  navigateTo("/admin/newContent/addArtwork");
};

const editArtwork = (artworkId: string) => {
  navigateTo(`/admin/editContent/artworks/${artworkId}`);
};
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Artworks" description="Manage exhibition artwork and gallery images.">
      <template #actions><Button @click="addArtwork">Add artwork</Button></template>
    </AdminPageHeader>
    <AdminEmptyState v-if="error" title="Artworks could not be loaded" message="Refresh the page to try again." />
    <AdminEmptyState v-else-if="!pending && !artworks?.length" title="No artworks yet" message="Add the first artwork to begin building the exhibition."><Button @click="addArtwork">Add artwork</Button></AdminEmptyState>
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Image</th><th>Title</th><th>Price</th><th>Created</th><th><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="artwork in artworks" :key="artwork.id">
            <td data-label="Image"><NuxtImg v-if="imagesLoaded" :src="artwork.image_path ?? undefined" :alt="artwork.title ?? 'Artwork'" class="admin-table__image" placeholder /><Lottie v-else name="img-placeholder" class="admin-table__image" /></td>
            <td data-label="Title"><strong>{{ artwork.title }}</strong></td>
            <td data-label="Price">${{ artwork.price ?? 0 }}</td>
            <td data-label="Created">{{ formatDateShort(artwork.created_at) ?? "" }}</td>
            <td data-label="Actions"><div class="admin-table__actions"><Button variant="secondary" size="sm" @click="editArtwork(artwork.id)">Edit</Button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
