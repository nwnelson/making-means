<script lang="ts" setup>
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Available Artwork",
  description:
    "Browse available original artworks from Making Means artists and find pieces ready for purchase.",
  ogTitle: "Available Artwork",
  ogDescription:
    "Browse available original artworks from Making Means artists and find pieces ready for purchase.",
});

const { getArtworks } = useArtworks();
const imagesLoaded = ref(false);

const { data: artworks, pending, error } = await getArtworks();

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery :artworks="availableArtworks" />
  </div>
</template>
