<script lang="ts" setup>
import { toast } from "vue-sonner";

definePageMeta({ layout: "dashboard", middleware: "admin" });

const route = useRoute();
const artistId = computed(() => route.params.id as string);
const { getArtist, updateArtist } = useArtists();
const { startLoading, stopLoading } = useLoading();
const { data: artist, pending, error } = await getArtist(artistId.value);

useSeoMeta({
  title: () => artist.value?.name || "Edit Artist",
  robots: "noindex, nofollow",
});

const name = ref("");
const bio = ref("");
const portrait = ref<File | null>(null);

watch(
  artist,
  (value) => {
    if (!value) return;
    name.value = value.name;
    bio.value = value.bio;
  },
  { immediate: true },
);

function selectPortrait(event: Event) {
  portrait.value = (event.target as HTMLInputElement).files?.[0] || null;
}

async function save() {
  if (!name.value.trim() || !bio.value.trim()) {
    toast.error("Name and bio are required");
    return;
  }
  if (
    name.value.trim() === artist.value?.name &&
    bio.value.trim() === artist.value?.bio &&
    !portrait.value
  ) {
    toast.error("No changes have been made");
    return;
  }

  const form = new FormData();
  form.append("name", name.value);
  form.append("bio", bio.value);
  if (portrait.value) form.append("portrait", portrait.value);

  try {
    startLoading();
    await updateArtist(artistId.value, form);
    toast.success("Artist updated successfully");
    await navigateTo("/admin/artists/artists");
  } catch (error: unknown) {
    toast.error(getApiErrorMessage(error, "Failed to update artist"));
  } finally {
    stopLoading();
  }
}
</script>

<template>
  <div class="admin-page admin-page--narrow">
    <AdminPageHeader title="Edit artist" description="Update the artist’s public profile." />
    <div v-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading artist…</h2></div></div>
    <AdminEmptyState v-else-if="error" title="Artist could not be loaded" message="Return to Artists and try again." />
    <AdminPanel v-else-if="artist">
      <form class="admin-form" @submit.prevent="save">
        <NuxtImg :src="artist.image_path" :alt="`${artist.name} portrait`" class="admin-preview" />
        <div class="admin-field"><label for="artist-name">Name</label><input id="artist-name" v-model="name" type="text" ></div>
        <div class="admin-field"><label for="artist-bio">Biography</label><textarea id="artist-bio" v-model="bio" /></div>
        <div class="admin-field"><label for="artist-portrait">Replace portrait <span class="optional">Optional</span></label><input id="artist-portrait" type="file" accept="image/jpeg,image/png,image/gif,image/webp" @change="selectPortrait" ><p class="admin-field__help">Leave this empty to keep the current portrait.</p></div>
        <div class="admin-form-actions"><Button type="submit">Save changes</Button><Button variant="secondary" type="button" @click="navigateTo('/admin/artists/artists')">Cancel</Button></div>
      </form>
    </AdminPanel>
  </div>
</template>

<style scoped>
.optional { color: #68736c; font-weight: 400; letter-spacing: 0; text-transform: none; }
</style>
