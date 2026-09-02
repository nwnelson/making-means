<script lang="ts" setup>
import { toast } from "vue-sonner";
type Collection = {
  id: string;
  collection_name: string;
  created_at: string;
  image_path: string;
};

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Admin Collections",
  robots: "noindex, nofollow",
});

const { startLoading, stopLoading } = useLoading();
const { deleteCollection } = useCollections();
// To Do: collections text now doesnt overflow correctly - but width:100% makes it too big - make cells smalelr

// To Do: refactor to use composable in a correct way
const {
  data: collections,
  pending,
  error,
} = await useFetch<Collection[]>("/api/collections/collections");

// same with this
async function removeCollection(id: string) {
  if (!id) return;
  try {
    startLoading();
    await deleteCollection(id);
    toast.success("Successfully deleted collection!");
    collections.value =
      collections.value?.filter((collection) => collection.id !== id) ?? [];
  } catch {
    toast.error("Something went wrong!");
  } finally {
    stopLoading();
  }
}

const addCollection = () => {
  navigateTo("/admin/newContent/addCollection");
};
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Collections" description="Manage the project’s artwork collections.">
      <template #actions><Button @click="addCollection">Add collection</Button></template>
    </AdminPageHeader>
    <AdminEmptyState v-if="error" title="Collections could not be loaded" message="Refresh the page to try again." />
    <div v-else-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading collections…</h2></div></div>
    <AdminEmptyState v-else-if="!collections?.length" title="No collections yet" message="Add a collection to organize artwork."><Button @click="addCollection">Add collection</Button></AdminEmptyState>
    <div v-else class="admin-cards">
      <article v-for="collection in collections" :key="collection.id" class="admin-card">
        <NuxtImg :src="collection.image_path ?? undefined" :alt="collection.collection_name" class="admin-card__image" />
        <div class="admin-card__body">
          <h2>{{ collection.collection_name }}</h2>
          <div class="admin-card__actions"><Button variant="danger" @click="removeCollection(collection.id)">Remove</Button></div>
        </div>
      </article>
    </div>
  </div>
</template>
