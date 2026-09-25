<script lang="ts" setup>
definePageMeta({ layout: false });

const route = useRoute();
const artistId = computed(() => route.params.id as string);

const { getArtist } = useArtists();
const { data: artist, pending, error } = await getArtist(artistId.value);

const { getExhibitionArtworks } = useArtworks();
const { data: artworks } = await getExhibitionArtworks();
const artistArtwork = computed(() =>
  artworks.value?.find((artwork) => artwork.artist?.id === artistId.value),
);

const firstName = computed(() => artist.value?.name.trim().split(/\s+/)[0] || "Artist");

useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Lato:wght@400;700;900&display=swap",
    },
  ],
});

useSeoMeta({
  title: () => artist.value?.name || "Artist",
  description: () =>
    artist.value?.bio || "Learn more about this Making Means artist.",
  ogTitle: () =>
    artist.value?.name ? `${artist.value.name} | Making Means` : "Artist | Making Means",
  ogDescription: () =>
    artist.value?.bio || "Learn more about this Making Means artist.",
  ogImage: () => artist.value?.image_path || undefined,
});
</script>

<template>
  <main class="artist-bio-page">
    <section v-if="artist" class="artist-bio-layout">
      <div class="artist-portrait-column">
        <div class="artist-portrait-frame">
          <NuxtImg
            v-if="artist.image_path"
            :src="artist.image_path"
            :alt="`Portrait of ${artist.name}`"
            class="artist-portrait"
            format="webp"
            quality="80"
            sizes="(max-width: 800px) 72vw, 38vw"
          />
          <div v-else class="artist-portrait-fallback">
            Portrait unavailable
          </div>
        </div>

        <NuxtLink
          v-if="artistArtwork"
          :to="`/artworks/${artistArtwork.id}`"
          class="artist-artwork-link"
        >
          View {{ firstName }}&rsquo;s Artwork
        </NuxtLink>
      </div>

      <article class="artist-biography">
        <h1>{{ artist.name }}</h1>
        <p>{{ artist.bio }}</p>
      </article>
    </section>

    <section v-else-if="pending" class="artist-bio-message">
      <p>Loading artist...</p>
    </section>

    <section v-else class="artist-bio-message">
      <h1>Artist unavailable</h1>
      <p v-if="error">Please return to the artists page and try again.</p>
      <NuxtLink to="/artists/all">View all artists</NuxtLink>
    </section>

    <EntryContactStrip />
  </main>
</template>

<style scoped>
.artist-bio-page {
  --artist-gold: var(--mm-gold, #d8c35a);
  --artist-green: var(--mm-green, #102117);
  --artist-ink: var(--mm-black, #101a15);
  --artist-white: var(--mm-white, #fafaf7);
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 7rem);
  background: var(--artist-green);
  color: var(--artist-white);
  font-family: Lato, Arial, sans-serif;
}

.artist-bio-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.85fr) minmax(27rem, 1.35fr);
  align-items: center;
  gap: clamp(2.5rem, 5vw, 6rem);
  flex: 1;
  width: min(100%, 112rem);
  min-height: calc(100dvh - 15rem);
  margin: 0 auto;
  padding: clamp(1.5rem, 3.5dvh, 3rem) clamp(2rem, 5vw, 6rem);
}

.artist-portrait-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 2dvh, 1.5rem);
  min-width: 0;
}

.artist-portrait-frame {
  --portrait-ring-width: clamp(0.8rem, 1.5vw, 1.6rem);
  position: relative;
  display: grid;
  width: min(100%, 54dvh, 38rem);
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
}

.artist-portrait-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle at 18% 24%, rgb(255 255 255 / 30%) 0 1px, transparent 2px),
    radial-gradient(circle at 72% 68%, rgb(95 65 8 / 22%) 0 1px, transparent 2px),
    linear-gradient(135deg, #e8cf60 0%, var(--artist-gold) 48%, #b99a32 100%);
  background-size: 7px 7px, 9px 9px, auto;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 14%);
}

.artist-portrait,
.artist-portrait-fallback {
  position: absolute;
  inset: var(--portrait-ring-width);
  z-index: 1;
  width: calc(100% - (var(--portrait-ring-width) * 2));
  height: calc(100% - (var(--portrait-ring-width) * 2));
  aspect-ratio: 1;
  border-radius: 50%;
}

.artist-portrait {
  display: block;
  object-fit: cover;
}

.artist-portrait-fallback {
  display: grid;
  place-items: center;
  background: #24372c;
  color: var(--artist-white);
  text-align: center;
}

.artist-artwork-link {
  display: inline-flex;
  max-width: 100%;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  background: var(--artist-white);
  color: var(--artist-ink);
  font-size: clamp(0.95rem, 1.6vw, 1.5rem);
  font-weight: 900;
  line-height: 1.05;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
}

.artist-artwork-link:hover,
.artist-artwork-link:focus-visible {
  background: var(--artist-gold);
}

.artist-artwork-link:focus-visible {
  outline: 0.2rem solid var(--artist-white);
  outline-offset: 0.2rem;
}

.artist-biography {
  min-width: 0;
}

.artist-biography h1 {
  margin: 0 0 clamp(0.75rem, 1.5dvh, 1.25rem);
  color: var(--artist-gold);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(3rem, 5.3vw, 6rem);
  font-weight: 500;
  line-height: 0.9;
}

.artist-biography p {
  margin: 0;
  max-width: 55rem;
  font-size: clamp(0.95rem, 1.35vw, 1.45rem);
  line-height: 1.28;
  white-space: pre-line;
}

.artist-bio-message {
  display: grid;
  flex: 1;
  min-height: calc(100dvh - 15rem);
  padding: 2rem;
  place-content: center;
  text-align: center;
}

.artist-bio-message h1,
.artist-bio-message p {
  margin: 0 0 0.75rem;
}

.artist-bio-message a {
  color: inherit;
  text-underline-offset: 0.18em;
}

@media (max-width: 900px) {
  .artist-bio-page {
    min-height: calc(100dvh - 5.5rem);
  }

  .artist-bio-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    min-height: 0;
    padding: 2.5rem 1.25rem 3rem;
  }

  .artist-portrait-frame {
    width: min(72vw, 30rem);
  }

  .artist-biography {
    width: min(100%, 45rem);
    margin: 0 auto;
  }

  .artist-biography h1 {
    text-align: center;
  }
}

@media (max-height: 760px) and (min-width: 901px) {
  .artist-bio-layout {
    gap: 3rem;
    padding-block: 1.25rem;
  }

  .artist-portrait-frame {
    width: min(100%, 48dvh, 30rem);
  }

  .artist-biography h1 {
    font-size: clamp(2.75rem, 4.5vw, 4.75rem);
  }

  .artist-biography p {
    font-size: clamp(0.85rem, 1.2vw, 1.15rem);
    line-height: 1.22;
  }
}
</style>
