<script setup lang="ts">
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Add Cover Image",
  robots: "noindex, nofollow",
});

const { addCoverImage } = useArtworks();
const { startLoading, stopLoading } = useLoading();

const image = ref<File | null>(null);

async function submit() {
  if (!image.value) return;
  const form = new FormData();
  form.append("image", image.value);
  try {
    startLoading();
    await addCoverImage(form);
    toast.success("Successfully added image!");
    await navigateTo("/admin/coverImages");
  } catch {
    toast.error("Something went wrong!");
  } finally {
    stopLoading();
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0] || null;
  image.value = selected;
};
</script>

<template>
  <div class="admin-page admin-page--narrow">
    <AdminPageHeader title="Add cover image" description="Upload an image for the landing-page presentation." />
    <AdminPanel>
      <form class="admin-form" @submit.prevent="submit">
        <div class="admin-field"><label for="cover-image">Image</label><input id="cover-image" name="image" accept="image/*" type="file" @change="onFileChange" ><p class="admin-field__help">Choose a high-quality image suitable for a large display.</p></div>
        <div class="admin-form-actions"><Button type="submit">Add image</Button><Button variant="secondary" type="button" @click="navigateTo('/admin/coverImages')">Cancel</Button></div>
      </form>
    </AdminPanel>
  </div>
</template>
