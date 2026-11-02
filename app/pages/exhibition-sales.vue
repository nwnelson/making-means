<script lang="ts" setup>
definePageMeta({ layout: false });

useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
    },
  ],
});

useSeoMeta({
  title: "Exhibition & Sales",
  description:
    "Explore original artworks currently available through Making Means.",
  ogTitle: "Exhibition & Sales | Making Means",
  ogDescription:
    "Explore original artworks currently available through Making Means.",
});

const { getExhibitionArtworks } = useArtworks();
const { data: artworks, pending, error } = await getExhibitionArtworks(true);
const failedImages = ref(new Set<string>());

function imageFailed(id: string) {
  failedImages.value = new Set(failedImages.value).add(id);
}
</script>

<template>
  <main class="exhibition-page">
    <section class="exhibition-intro">
      <h1>Exhibition &amp; Sale</h1>
      <p>
        100% of artwork sale proceeds from the exhibition support The Oasis
        Bulawayo.
      </p>
    </section>

    <section class="exhibition-gallery" aria-label="Artwork for sale">
      <div v-if="pending" class="gallery-message">
        <h2>Loading artworks...</h2>
      </div>

      <div v-else-if="error" class="gallery-message">
        <h2>Artworks could not be loaded.</h2>
        <p>Please try again later.</p>
      </div>

      <div v-else-if="!artworks?.length" class="gallery-message">
        <h2>No artworks are currently available.</h2>
      </div>

      <div v-else class="hanging-grid">
        <article
          v-for="artwork in artworks"
          :key="artwork.id"
          class="hanging-artwork"
        >
          <div class="hangers" aria-hidden="true">
            <span class="hanger"><span class="clip" /></span>
            <span class="hanger"><span class="clip" /></span>
          </div>

          <NuxtLink
            :to="`/artworks/${artwork.id}`"
            class="artwork-mount"
            :aria-label="`View details for ${artwork.title || 'artwork'}`"
          >
            <NuxtImg
              v-if="artwork.image_path && !failedImages.has(artwork.id)"
              :src="artwork.image_path"
              :alt="artwork.title || 'Exhibition artwork'"
              class="artwork-image"
              format="webp"
              quality="80"
              sizes="(max-width: 700px) 82vw, (max-width: 1100px) 40vw, 25vw"
              @error="imageFailed(artwork.id)"
            />
            <span v-else class="artwork-fallback">Image unavailable</span>
          </NuxtLink>

          <div class="artwork-copy">
            <p class="artist-name">{{ artwork.artist?.name }}</p>
            <h2>{{ artwork.title }}</h2>
            <NuxtLink :to="`/artworks/${artwork.id}`" class="details-link">
              View artwork details
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <EntryContactStrip />
  </main>
</template>

<style scoped>
:global(:root) {
  --mm-gold: #d8c35a;
  --mm-green: #102117;
  --mm-black: #101a15;
  --mm-white: #fafaf7;
}

.exhibition-page {
  --exhibition-gold: var(--mm-gold, #d8c35a);
  --exhibition-green: var(--mm-green, #102117);
  --exhibition-ink: var(--mm-black, #101a15);
  --exhibition-white: var(--mm-white, #fafaf7);
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 7rem);
  border-top: clamp(0.65rem, 1vw, 1rem) solid var(--exhibition-green);
  background: var(--exhibition-green);
  color: var(--exhibition-white);
  font-family: Lato, Arial, sans-serif;
}

.exhibition-intro {
  padding: clamp(0.75rem, 1.5vw, 1.35rem) 1.25rem clamp(0.65rem, 1.2vw, 1rem);
  background: var(--exhibition-gold);
  color: var(--exhibition-ink);
  text-align: center;
}

.exhibition-intro h1,
.exhibition-intro p {
  margin: 0;
}

.exhibition-intro h1 {
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  font-weight: 400;
  letter-spacing: 0.16em;
  line-height: 1.05;
  text-transform: uppercase;
}

.exhibition-intro p {
  margin-top: 0.3rem;
  font-size: clamp(0.9rem, 1.2vw, 1.25rem);
  line-height: 1.3;
}

.exhibition-gallery {
  flex: 1;
  background: var(--exhibition-green);
}

.hanging-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 13.5rem));
  justify-content: space-evenly;
  gap: clamp(1.5rem, 4vw, 4rem);
  padding: 0 clamp(1.5rem, 5vw, 5rem) clamp(1rem, 2vw, 2rem);
}

.hanging-artwork {
  position: relative;
  width: min(100%, clamp(11rem, 24dvh, 13.5rem));
  min-width: 0;
  padding-top: clamp(3.5rem, 5vw, 5rem);
  justify-self: center;
}

.hangers {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  justify-content: space-around;
  height: clamp(4rem, 5.5vw, 5.5rem);
  padding: 0 9%;
  pointer-events: none;
}

.hanger {
  position: relative;
  width: 2px;
  height: 100%;
  background: #dedbd0;
  box-shadow: 1px 0 1px rgb(0 0 0 / 35%);
}

.clip {
  position: absolute;
  right: 50%;
  bottom: 0;
  width: clamp(1.8rem, 2.5vw, 2.6rem);
  height: clamp(0.9rem, 1.25vw, 1.3rem);
  transform: translateX(50%);
  border: 1px solid #827f76;
  border-radius: 45% 45% 0.25rem 0.25rem;
  background: linear-gradient(160deg, #f3f0e8 8%, #a7a39a 52%, #e3dfd6 100%);
  box-shadow: 0 0.25rem 0.3rem rgb(0 0 0 / 40%);
  z-index: 2;
}

.clip::before {
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
  display: flex;
  width: 100%;
  aspect-ratio: 4 / 5.65;
  align-items: center;
  justify-content: center;
  padding: clamp(0.6rem, 0.9vw, 0.9rem);
  background: #fff;
  color: var(--exhibition-ink);
  text-decoration: none;
  box-shadow: 0 0.45rem 0.85rem rgb(0 0 0 / 18%);
}

.artwork-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.artwork-fallback {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  background: #f1efe8;
  color: #535b56;
}

.artwork-copy {
  padding-top: 0.45rem;
  line-height: 1.08;
}

.artwork-copy p,
.artwork-copy h2 {
  margin: 0;
  font-size: clamp(0.85rem, 1vw, 1rem);
  font-weight: 400;
}

.artwork-copy h2 {
  min-height: 1.1em;
}

.details-link {
  display: inline-block;
  margin-top: 0.25rem;
  color: inherit;
  font-size: clamp(0.75rem, 0.9vw, 0.9rem);
  font-weight: 900;
  line-height: 1.15;
  text-decoration: none;
  text-transform: uppercase;
}

.artwork-mount:hover + .artwork-copy .details-link,
.artwork-mount:focus-visible + .artwork-copy .details-link,
.details-link:hover,
.details-link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.gallery-message {
  display: grid;
  min-height: 32rem;
  place-content: center;
  padding: 4rem 1.25rem;
  text-align: center;
}

.gallery-message h2,
.gallery-message p {
  margin: 0;
}

.gallery-message p {
  margin-top: 0.5rem;
}

@media (max-width: 900px) {
  .hanging-grid {
    grid-template-columns: repeat(2, minmax(0, 13.5rem));
    padding-right: clamp(1.5rem, 8vw, 5rem);
    padding-left: clamp(1.5rem, 8vw, 5rem);
  }
}

@media (max-width: 600px) {
  .exhibition-page {
    min-height: calc(100dvh - 5.5rem);
  }

  .exhibition-intro h1 {
    letter-spacing: 0.1em;
  }

  .hanging-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-right: clamp(2rem, 10vw, 4rem);
    padding-left: clamp(2rem, 10vw, 4rem);
  }

  .hanging-artwork {
    width: 100%;
    padding-top: 6rem;
  }

  .hangers {
    height: 6.75rem;
  }

  .artwork-copy p,
  .artwork-copy h2 {
    font-size: 1.1rem;
  }

  .details-link {
    font-size: 1rem;
  }
}
</style>
