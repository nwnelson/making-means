<script lang="ts" setup>
import { toast } from "vue-sonner";

definePageMeta({ layout: "dashboard", middleware: "admin" });
useSeoMeta({ title: "Admin Artists", robots: "noindex, nofollow" });

const { getArtists, removeArtist } = useArtists();
const { startLoading, stopLoading } = useLoading();
const { data: artists, pending, error } = await getArtists();

async function deleteSelectedArtist(id: string, name: string) {
  if (!window.confirm(`Delete ${name}?`)) return;

  try {
    startLoading();
    await removeArtist(id);
    artists.value = artists.value?.filter((artist) => artist.id !== id) || [];
    toast.success("Artist deleted successfully");
  } catch (error: unknown) {
    toast.error(getApiErrorMessage(error, "Failed to delete artist"));
  } finally {
    stopLoading();
  }
}
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Artists" description="Manage participating artists and their biographies.">
      <template #actions><Button @click="navigateTo('/admin/newContent/addArtist')">Add artist</Button></template>
    </AdminPageHeader>
    <AdminEmptyState v-if="error" title="Artists could not be loaded" message="Refresh the page to try again." />
    <div v-else-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading artists…</h2></div></div>
    <AdminEmptyState v-else-if="!artists?.length" title="No artists yet" message="Add the first participating artist."><Button @click="navigateTo('/admin/newContent/addArtist')">Add artist</Button></AdminEmptyState>
    <div v-else class="admin-cards">
      <article v-for="artist in artists" :key="artist.id" class="admin-card artist-card">
        <NuxtImg :src="artist.image_path" :alt="`${artist.name} portrait`" class="admin-card__image" />
        <div class="admin-card__body">
          <h2>{{ artist.name }}</h2>
          <p class="admin-card__copy">{{ artist.bio }}</p>
          <div class="admin-card__actions">
            <Button variant="secondary" @click="navigateTo(`/admin/editContent/artists/${artist.id}`)">Edit</Button>
            <Button variant="danger" @click="deleteSelectedArtist(artist.id, artist.name)">Remove</Button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.artist-card .admin-card__image { aspect-ratio: 16 / 10; object-position: center 25%; }
</style>
