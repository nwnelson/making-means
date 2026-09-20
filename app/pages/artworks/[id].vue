<script lang="ts" setup>
import type { ArtworkRow, GalleryRow } from "~~/types/supabase/tables";
import VueEasyLightbox from "vue-easy-lightbox";

type ArtworkDetails = ArtworkRow & {
  artist: { id: string; name: string } | null;
};

const route = useRoute();
const id = computed(() => route.params.id as string);

const { getGalleryImages } = useGallery();
const { startLoading, stopLoading } = useLoading();

const {
  data: artwork,
  pending: pendingArtwork,
  error,
} = await useFetch<ArtworkDetails>(`/api/artworks/${id.value}`);

useSeoMeta({
  title: () => artwork.value?.title || "Artwork",
  description: () =>
    artwork.value?.description ||
    "View artwork details, pricing, and availability for this original piece exhibited on Making Means.",
  ogTitle: () => artwork.value?.title || "Artwork",
  ogDescription: () =>
    artwork.value?.description ||
    "View artwork details, pricing, and availability for this original piece exhibited on Making Means.",
  ogImage: () => artwork.value?.image_path || undefined,
});

const { data: galleryImages, pending: pendingGallery } = await useAsyncData<
  GalleryRow[]
>(`gallery-${route.params.id}`, () => getGalleryImages(id.value as string));

const currentIndex = ref(0);
const loading = computed(() => pendingArtwork.value || pendingGallery.value);

watch(loading, (val) => {
  if (val) {
    startLoading();
  } else {
    stopLoading();
  }
});

const currentImage = computed<GalleryRow | null>(() => {
  if (!galleryImages.value) return null;
  return galleryImages.value[currentIndex.value] ?? null;
});

const displayedImage = computed(
  () => currentImage.value?.image_path || artwork.value?.image_path || "",
);

const viewerImage = computed<string[]>(() => {
  const path = displayedImage.value;
  return path ? [path] : [];
});

const hasMultipleImages = computed(() => (galleryImages.value?.length ?? 0) > 1);

const formattedPrice = computed(() => {
  if (artwork.value?.price === null || artwork.value?.price === undefined) {
    return "Price available on request";
  }

  return `$ ${new Intl.NumberFormat("en-US").format(artwork.value.price)} USD`;
});
const nextImage = () => {
  const images = galleryImages.value;
  if (!images?.length || images?.length < 2) return;

  currentIndex.value = (currentIndex.value + 1) % images.length;
  if (imageLoaded.value) {
    imageLoaded.value = false;
  }
};

const prevImage = () => {
  const images = galleryImages.value;
  if (!images?.length || images?.length < 2) return;

  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
  if (imageLoaded.value) {
    imageLoaded.value = false;
  }
};

const imageLoaded = ref(false);

function loadImage() {
  imageLoaded.value = true;
}

const lightboxVisible = ref(false);

const viewLightBox = () => {
  lightboxVisible.value = true;
};

const closeLightBox = () => {
  lightboxVisible.value = false;
};

useHead({
  bodyAttrs: {
    class: "artwork-detail-route",
  },
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
    },
  ],
});
</script>

<template>
  <main class="artwork-page">
    <ClientOnly>
      <VueEasyLightbox
        :imgs="viewerImage"
        :visible="lightboxVisible"
        @hide="closeLightBox"
      />
    </ClientOnly>

    <div v-if="artwork" class="artwork-layout">
      <section class="artwork-display" aria-label="Artwork image">
        <div class="suspension" aria-hidden="true">
          <span class="suspension-wire"><span class="mounting-clip" /></span>
          <span class="suspension-wire"><span class="mounting-clip" /></span>
        </div>

        <div class="artwork-mount">
          <button
            v-if="hasMultipleImages"
            type="button"
            class="gallery-control gallery-control--previous"
            aria-label="View previous artwork image"
            @click="prevImage"
          >
            ‹
          </button>

          <button
            type="button"
            class="artwork-image-shell"
            aria-label="Open artwork image"
            @click="viewLightBox"
          >
            <NuxtImg
              v-if="displayedImage"
              :src="displayedImage"
              :alt="artwork.title || 'Artwork image'"
              class="artwork-image"
              format="webp"
              quality="80"
              sizes="(max-width: 700px) 76vw, (max-width: 1100px) 42vw, 30vw"
              :class="{ 'artwork-image--visible': imageLoaded }"
              @load="loadImage"
            />
            <Lottie
              v-if="displayedImage && !imageLoaded"
              name="img-placeholder"
              class="image-placeholder"
            />
            <span v-if="!displayedImage" class="image-unavailable">
              Image unavailable
            </span>
          </button>

          <button
            v-if="hasMultipleImages"
            type="button"
            class="gallery-control gallery-control--next"
            aria-label="View next artwork image"
            @click="nextImage"
          >
            ›
          </button>
        </div>
      </section>

      <section class="artwork-information" aria-label="Artwork information">
        <p class="artwork-description">
          {{ artwork.description }}
        </p>

        <div class="artwork-metadata">
          <p v-if="artwork.artist">{{ artwork.artist.name }}</p>
          <h1>{{ artwork.title }}, 2026</h1>
          <p>{{ artwork.dimensions }}</p>
          <p class="metadata-emphasis">Location: Portugal</p>
          <p class="metadata-emphasis">Price: {{ formattedPrice }}</p>
          <p class="shipping-note">(Shipping calculated separately)</p>
        </div>

        <div class="artwork-sales-notice">
          <p class="sales-notice-title">NOT YET AVAILABLE FOR PURCHASE</p>
          <p>Sales begin <time datetime="2026-10-01">October 1, 2026</time>.</p>
        </div>
      </section>
    </div>

    <div v-else-if="error" class="artwork-message">
      <h1>Artwork unavailable</h1>
      <p>Please try again later.</p>
    </div>
  </main>
</template>

<style scoped>
:global(body.artwork-detail-route) {
  --mm-gold: #d8c35a;
  --mm-green: #102117;
  --mm-black: #101a15;
  --mm-white: #fafaf7;
}

:global(body.artwork-detail-route .page) {
  min-height: calc(100dvh - 7rem);
  padding: 0;
}

.artwork-page {
  --artwork-gold: var(--mm-gold, #d8c35a);
  --artwork-green: var(--mm-green, #102117);
  --artwork-white: var(--mm-white, #fafaf7);
  width: 100%;
  min-height: calc(100dvh - 15rem);
  background: var(--artwork-green);
  color: var(--artwork-white);
  font-family: Lato, Arial, sans-serif;
}

.artwork-layout {
  display: grid;
  grid-template-columns: minmax(20rem, 0.85fr) minmax(28rem, 1.35fr);
  align-items: center;
  gap: clamp(2.5rem, 5vw, 6rem);
  width: min(100%, 104rem);
  min-height: inherit;
  margin: 0 auto;
  padding: 0 clamp(2rem, 5vw, 6rem) clamp(1rem, 2vw, 2rem);
}

.artwork-display {
  position: relative;
  width: min(100%, 42dvh, 26rem);
  margin: 0 auto;
  padding-top: clamp(3rem, 6dvh, 4.5rem);
}

.suspension {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  justify-content: space-around;
  height: clamp(3.5rem, 6.5dvh, 5rem);
  padding: 0 11%;
  pointer-events: none;
}

.suspension-wire {
  position: relative;
  width: 2px;
  height: 100%;
  background: #dedbd0;
  box-shadow: 1px 0 1px rgb(0 0 0 / 35%);
}

.mounting-clip {
  position: absolute;
  right: 50%;
  bottom: 0;
  z-index: 3;
  width: clamp(2rem, 2.5vw, 2.75rem);
  height: clamp(1rem, 1.25vw, 1.4rem);
  transform: translateX(50%);
  border: 1px solid #827f76;
  border-radius: 45% 45% 0.25rem 0.25rem;
  background: linear-gradient(160deg, #f3f0e8 8%, #a7a39a 52%, #e3dfd6 100%);
  box-shadow: 0 0.25rem 0.3rem rgb(0 0 0 / 40%);
}

.mounting-clip::before {
  content: "";
  position: absolute;
  top: 17%;
  left: 50%;
  width: 28%;
  aspect-ratio: 1;
  transform: translateX(-50%);
  border: 1px solid #77736c;
  border-radius: 50%;
  background: #c9c5bb;
}

.artwork-mount {
  position: relative;
  display: grid;
  aspect-ratio: 4 / 4.65;
  place-items: center;
  padding: clamp(1.4rem, 2vw, 2.25rem) clamp(1.1rem, 1.7vw, 1.75rem)
    clamp(1rem, 1.5vw, 1.5rem);
  background: #fff;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 20%);
}

.artwork-image-shell {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 0;
  place-items: center;
  overflow: hidden;
  border: 0;
  background: #f4f2eb;
  cursor: zoom-in;
}

.artwork-image {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork-image--visible {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #f4f2eb;
}

.image-unavailable {
  color: var(--artwork-green);
}

.gallery-control {
  position: absolute;
  top: 50%;
  z-index: 4;
  display: grid;
  width: 2.25rem;
  aspect-ratio: 1;
  place-items: center;
  transform: translateY(-50%);
  border: 0;
  border-radius: 50%;
  background: var(--artwork-gold);
  color: var(--artwork-green);
  font: inherit;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
}

.gallery-control--previous {
  left: 0.45rem;
}

.gallery-control--next {
  right: 0.45rem;
}

.artwork-information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding-top: clamp(1rem, 2vw, 2rem);
}

.artwork-description {
  max-width: 58rem;
  margin: 0;
  font-size: clamp(0.95rem, 1.25vw, 1.3rem);
  line-height: 1.18;
  white-space: pre-line;
}

.artwork-metadata {
  margin-top: clamp(1rem, 2vw, 2rem);
}

.artwork-metadata p,
.artwork-metadata h1 {
  margin: 0;
  font-size: clamp(0.95rem, 1.1vw, 1.15rem);
  font-weight: 400;
  line-height: 1.15;
}

.artwork-metadata h1 {
  font-family: Lato, Arial, sans-serif;
}

.artwork-metadata .metadata-emphasis {
  font-weight: 900;
}

.artwork-metadata .shipping-note {
  margin-top: 0.15rem;
  font-style: italic;
}

.artwork-sales-notice {
  margin-top: clamp(1rem, 1.75vw, 1.75rem);
  padding: 0.65rem clamp(1.25rem, 2vw, 2rem);
  border-radius: 2.5rem;
  background: var(--artwork-gold);
  color: var(--artwork-green);
  font-size: clamp(1rem, 1.35vw, 1.4rem);
  line-height: 1.25;
}

.artwork-sales-notice p {
  margin: 0;
}

.sales-notice-title {
  font-weight: 900;
}

.artwork-message {
  display: grid;
  min-height: inherit;
  padding: 3rem 1.25rem;
  place-content: center;
  text-align: center;
}

.artwork-message h1,
.artwork-message p {
  margin: 0;
}

.artwork-message p {
  margin-top: 0.5rem;
}

@media (max-width: 1100px) {
  :global(body.artwork-detail-route .page) {
    min-height: calc(100dvh - 5.5rem);
  }

  .artwork-page {
    min-height: calc(100dvh - 13.5rem);
  }

  .artwork-layout {
    grid-template-columns: minmax(17rem, 0.8fr) minmax(23rem, 1.2fr);
    gap: clamp(2rem, 5vw, 4rem);
    padding-right: clamp(1.5rem, 4vw, 3rem);
    padding-left: clamp(1.5rem, 4vw, 3rem);
  }
}

@media (max-width: 800px) {
  .artwork-page {
    min-height: 0;
  }

  .artwork-layout {
    grid-template-columns: 1fr;
    gap: 2.25rem;
    padding: 0 1.25rem 3rem;
  }

  .artwork-display {
    width: min(100%, 27rem);
  }

  .artwork-information {
    width: min(100%, 38rem);
    margin: 0 auto;
    padding-top: 0;
  }
}

</style>
