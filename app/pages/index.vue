<script lang="ts" setup>
definePageMeta({ layout: false });

useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap",
    },
  ],
});

useSeoMeta({
  title: "Original Artwork Portfolio",
  description:
    "Discover original mixed media artwork by Jamie Nelson, explore featured pieces, and browse a visual-first artist portfolio.",
  ogTitle: "Jamie Nelson Art",
  ogDescription:
    "Discover original mixed media artwork by Jamie Nelson, explore featured pieces, and browse a visual-first artist portfolio.",
});
</script>

<template>
  <div class="entry-page">
    <main>
      <EntryHero />
      <EntryExhibition />
      <EntryHowItWorks />
    </main>
    <EntryContactStrip />
  </div>
</template>

<style scoped>
.entry-page {
  background: var(--mm-green);
  color: var(--mm-white);
}

.entry-page :deep(.entry-hero) {
  min-height: calc(100dvh - 5.5rem - 4rem);
}

@media (min-width: 1101px) {
  .entry-page :deep(.entry-hero) {
    min-height: calc(100dvh - 7rem - 4rem);
  }
}
</style>
