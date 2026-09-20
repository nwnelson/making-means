<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import type { CollectionDetails } from "~~/types/collections/collection";
type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later
type ArtworkCard = Pick<
  ArtworkRow,
  "id" | "title" | "image_path" | "price"
> & {
  artist?: { id: string; name: string };
};

const props = defineProps<{
  artworks: ArtworkCard[];
  collection?: CollectionDetails;
  title?: string;
  description?: string;
  showArtist?: boolean;
  showPrice?: boolean;
}>();

const loadedImages = ref(new Set<string>());
const failedImages = ref(new Set<string>());

function loadImage(id: string) {
  loadedImages.value = new Set(loadedImages.value).add(id);
}

function failImage(id: string) {
  failedImages.value = new Set(failedImages.value).add(id);
}

async function viewArtwork(id: string) {
  // if (sold) return;
  await navigateTo(`/artworks/${id}`);
}
</script>

<template>
  <div class="textBlock">
    <h1>{{ props.title || props.collection?.collection_name || "All Artworks" }}</h1>
  </div>
  <div v-if="props.description || props.collection" class="colDescription">
    <p>{{ props.description || props.collection?.desc }}</p>
  </div>
  <div class="artworksGrid">
    <div
      v-for="artwork in props.artworks"
      :key="artwork.id"
      @click="viewArtwork(artwork.id)"
      class="artworkContainer clickable"
    >
      <div class="imageWrapper">
        <NuxtImg
          v-if="artwork.image_path && !failedImages.has(artwork.id)"
          :src="artwork?.image_path ?? undefined"
          :alt="artwork.title || 'Artwork'"
          class="artwork"
          format="webp"
          quality="70"
          width="80"
          height="80"
          sizes="80px"
          :class="{ visible: loadedImages.has(artwork.id) }"
          @load="loadImage(artwork.id)"
          @error="failImage(artwork.id)"
        />
        <Lottie
          v-if="
            artwork.image_path &&
            !loadedImages.has(artwork.id) &&
            !failedImages.has(artwork.id)
          "
          name="img-placeholder"
          class="artwork visible imgOverlay"
        />
        <div v-if="!artwork.image_path || failedImages.has(artwork.id)" class="imageFallback">
          Image unavailable
        </div>
      </div>
      <div class="artDetails">
        <div class="artTitle">{{ artwork?.title }}</div>
        <div v-if="props.showArtist" class="artAttribution">
          {{ artwork.artist?.name }}
        </div>
        <div v-if="props.showPrice && artwork.price !== null" class="center">
          ${{ artwork.price }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.colDescription {
  font-size: 0.9rem;
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 0 1rem 1rem 1rem;
}

.colDescription p {
  max-width: 90%;
  text-align: center;
  font-style: italic;
}

.artworkContainer {
  width: 100%;
  position: relative;
  padding: 0.5rem;
  background-color: var(--theme-white);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.imageWrapper {
  position: relative;
  width: 5rem;
  height: 5rem;
}

.artDetails {
  font-size: 0.7rem;
  line-height: 1rem;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.center {
  width: 100%;
  display: flex;
  justify-content: center;
}

.artTitle {
  width: 5rem;
  min-width: 0;
  flex-shrink: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.artAttribution {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
}

.cutoffTxtSm {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.soldArtwork {
  opacity: 0.4;
  filter: grayscale(70%);
}

.artworksGrid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.imgOverlay {
  position: absolute;
  width: 5rem;
  height: 5rem;
  margin: auto;
  opacity: 1;
  inset: 0;
  z-index: 10;
  background: var(--theme-off-white);
}

.imageFallback {
  display: grid;
  width: 5rem;
  height: 5rem;
  place-items: center;
  border-radius: 8px;
  background: var(--theme-white);
  color: var(--theme-grey);
  font-size: 0.65rem;
  text-align: center;
}

.artwork {
  width: 5rem;
  height: 5rem;
  border-radius: 8px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork.visible {
  opacity: 1;
}

.clickable {
  cursor: pointer;
}

@media (min-width: 768px) {
  .artworksGrid {
    width: 80%;
  }
  .colDescription p {
    max-width: 80%;
  }
}

@media (min-width: 1024px) {
  .artworksGrid {
    grid-template-columns: repeat(4, 1fr);
  }

  .artDetails {
    font-size: 0.9rem;
  }

  .artTitle {
    width: 100%;
  }

  .colDescription {
    max-width: 50%;
  }
}
</style>
