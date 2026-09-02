<script lang="ts" setup>
import { toast } from "vue-sonner";

definePageMeta({ layout: "dashboard", middleware: "admin" });
useSeoMeta({ title: "Add Artist", robots: "noindex, nofollow" });

const { addArtist } = useArtists();
const { startLoading, stopLoading } = useLoading();
const name = ref("");
const bio = ref("");
const portrait = ref<File | null>(null);

function selectPortrait(event: Event) {
  portrait.value = (event.target as HTMLInputElement).files?.[0] || null;
}

async function submit() {
  if (!name.value.trim() || !bio.value.trim() || !portrait.value) {
    toast.error("Name, bio, and portrait are required");
    return;
  }

  const form = new FormData();
  form.append("name", name.value);
  form.append("bio", bio.value);
  form.append("portrait", portrait.value);

  try {
    startLoading();
    await addArtist(form);
    toast.success("Artist created successfully");
    await navigateTo("/admin/artists/artists");
  } catch (error: unknown) {
    toast.error(getApiErrorMessage(error, "Failed to create artist"));
  } finally {
    stopLoading();
  }
}
</script>

<template>
  <div class="admin-page admin-page--narrow">
    <AdminPageHeader title="Add artist" description="Create a profile for a participating artist." />
    <AdminPanel>
      <form class="admin-form" @submit.prevent="submit">
        <div class="admin-field"><label for="artist-name">Name</label><input id="artist-name" v-model="name" type="text" autocomplete="name" ></div>
        <div class="admin-field"><label for="artist-bio">Biography</label><textarea id="artist-bio" v-model="bio" /><p class="admin-field__help">This biography will appear on the public artist page.</p></div>
        <div class="admin-field"><label for="artist-portrait">Portrait</label><input id="artist-portrait" type="file" accept="image/jpeg,image/png,image/gif,image/webp" @change="selectPortrait" ><p class="admin-field__help">Use a clear JPEG, PNG, GIF, or WebP image.</p></div>
        <div class="admin-form-actions"><Button type="submit">Create artist</Button><Button variant="secondary" type="button" @click="navigateTo('/admin/artists/artists')">Cancel</Button></div>
      </form>
    </AdminPanel>
  </div>
</template>
