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
  title: "Artists",
  description:
    "Meet the artists represented by Making Means and learn about their work.",
  ogTitle: "Artists | Making Means",
  ogDescription:
    "Meet the artists represented by Making Means and learn about their work.",
});

const { getArtists } = useArtists();
const { data: artists, pending, error } = await getArtists();
</script>

<template>
  <main class="artists-page">
    <section class="artists-heading">
      <h1>This Year&rsquo;s Artists</h1>
    </section>

    <section class="artists-list" aria-label="This year's artists">
      <p v-if="pending" class="artists-message">Loading artists...</p>
      <p v-else-if="error" class="artists-message">
        Artists could not be loaded.
      </p>
      <p v-else-if="!artists?.length" class="artists-message">
        No artists to show.
      </p>

      <ul v-else>
        <li v-for="artist in artists" :key="artist.id">
          <NuxtLink :to="`/artists/${artist.id}`">
            <NuxtImg
              v-if="artist.image_path"
              :src="artist.image_path"
              :alt="`Portrait of ${artist.name}`"
              class="artist-portrait"
              format="webp"
              quality="80"
              sizes="(max-width: 700px) 80vw, (max-width: 1000px) 40vw, 22vw"
              width="600"
              height="600"
            />
            <span v-else class="artist-portrait artist-portrait--fallback">
              Portrait unavailable
            </span>
            <span class="artist-name">{{ artist.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <EntryContactStrip />
  </main>
</template>

<style scoped>
.artists-page {
  --artists-gold: var(--mm-gold, #d8c35a);
  --artists-green: var(--mm-green, #102117);
  --artists-white: var(--mm-white, #fafaf7);
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 7rem);
  background: var(--artists-green);
  color: var(--artists-white);
  font-family: Lato, Arial, sans-serif;
}

.artists-heading {
  display: grid;
  padding: clamp(2.5rem, 4vw, 5.25rem) 1.25rem;
  place-items: center;
  color: var(--artists-gold);
  text-align: center;
}

.artists-heading h1 {
  margin: 0;
  font-size: clamp(2rem, 4.4vw, 5.75rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  line-height: 1.15;
  text-transform: uppercase;
}

.artists-list {
  display: grid;
  flex: 1;
  min-height: 0;
  padding: clamp(2rem, 3.2vw, 4.25rem) 7.65vw clamp(3rem, 5vw, 6.5rem);
  place-items: center;
}

.artists-list ul {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 3.5rem 9.35vw;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.artists-list li {
  min-width: 0;
  max-width: 100%;
  text-align: center;
}

.artists-list li a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.75rem, 1vw, 1.25rem);
  color: inherit;
  font-size: clamp(1.1rem, 1.85vw, 2.4rem);
  font-weight: 400;
  line-height: 1.15;
  text-decoration: none;
}

.artist-name {
  text-decoration: underline;
  text-decoration-thickness: 0.06em;
  text-underline-offset: 0.1em;
}

.artist-portrait {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  border-radius: clamp(0.9rem, 1.2vw, 1.6rem);
  object-fit: cover;
}

.artist-portrait--fallback {
  display: grid;
  place-items: center;
  padding: 1rem;
  background: #24372c;
  font-size: 1rem;
}

.artists-list li a:focus-visible {
  outline: 2px solid var(--artists-gold);
  outline-offset: 0.5rem;
}

.artists-list li a:hover,
.artists-list li a:focus-visible {
  color: var(--artists-gold);
}

.artists-message {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  text-align: center;
}

@media (min-width: 1001px) {
  .artists-heading {
    padding-block: clamp(1.25rem, 3dvh, 3rem);
  }

  .artists-heading h1 {
    font-size: clamp(2rem, min(4.4vw, 6dvh), 5.75rem);
  }

  .artists-list {
    min-height: auto;
    padding-block: 2dvh 4dvh;
  }

  .artist-portrait {
    width: min(100%, max(8rem, calc(100dvh - 28rem)));
  }

  .artists-list li a {
    font-size: clamp(1.1rem, min(1.85vw, 3dvh), 2.4rem);
  }

  .artists-page :deep(.entry-contact) {
    flex-shrink: 0;
  }
}

@media (max-width: 1100px) {
  .artists-page {
    min-height: calc(100dvh - 5.5rem);
  }
}

@media (max-width: 1000px) {
  .artists-list ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 5vw;
  }
}

@media (max-width: 700px) {
  .artists-heading h1 {
    letter-spacing: 0.12em;
  }

  .artists-list {
    padding: 1rem 10vw 3rem;
  }

  .artists-list ul {
    grid-template-columns: minmax(0, 1fr);
    max-width: 25rem;
    gap: 2.5rem;
  }

  .artists-list li a {
    font-size: 1.5rem;
  }
}
</style>
