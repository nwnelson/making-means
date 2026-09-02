<script lang="ts" setup>
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Add Collection",
  robots: "noindex, nofollow",
});

const newCollection = ref("");

async function submit() {
  if (!newCollection.value) {
    toast.error("Please enter a valid value!");
  }

  const collectionName = newCollection.value;

  const res = await $fetch("/api/collections/collection", {
    method: "POST",
    body: { name: collectionName },
  });

  toast(res.message);

  await navigateTo("/admin/collections/collections");
}
</script>

<template>
  <div class="admin-page admin-page--narrow">
    <AdminPageHeader title="Add collection" description="Create a new collection for organizing artwork." />
    <AdminPanel>
      <form class="admin-form" @submit.prevent="submit">
        <div class="admin-field"><label for="collection-name">Collection name</label><input id="collection-name" v-model="newCollection" type="text" ></div>
        <div class="admin-form-actions"><Button type="submit">Create collection</Button><Button variant="secondary" type="button" @click="navigateTo('/admin/collections/collections')">Cancel</Button></div>
      </form>
    </AdminPanel>
  </div>
</template>
