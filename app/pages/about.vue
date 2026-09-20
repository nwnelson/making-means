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
  title: "About Making Means",
  description:
    "Learn how Making Means connects Zimbabwean artists living abroad with creative communities and organizations at home.",
  ogTitle: "About Making Means",
  ogDescription:
    "Learn how Making Means connects Zimbabwean artists living abroad with creative communities and organizations at home.",
});
</script>

<template>
  <main class="about-page">
    <section class="about-content">
      <h1>About Making Means</h1>

      <div class="about-columns">
        <div class="about-column">
          <p>
            <strong>Making Means</strong> is an initiative connecting
            Zimbabwean artists living abroad with locally led creative
            organisations and community projects in Zimbabwe. Through art,
            conversation, and collaboration, the initiative creates
            opportunities for meaningful connections and exchange across
            borders.
          </p>

          <p>
            <strong>Making Means</strong> brings artists living abroad into
            conversation and collaboration with creative communities at home.
            Through these connections, the project explores how creative
            exchange can extend beyond financial support to include knowledge,
            skills, relationships, visibility, and new opportunities.
          </p>
        </div>

        <div class="about-column">
          <p>
            Each edition will remain permanently on the
            <strong>Making Means</strong> website, creating an evolving digital
            archive of the artists, artworks, collaborations, conversations,
            and community projects connected through the initiative. Over
            time, the website will become more than an exhibition platform—it
            will serve as an archive of connections between Zimbabwean artists
            abroad and creative communities at home.
          </p>

          <p>
            The 2026 edition is the first <strong>Making Means</strong> pilot,
            developed in collaboration with The Oasis Bulawayo, an organisation
            supporting creatives and entrepreneurs in Bulawayo.
          </p>
        </div>
      </div>

      <p class="about-research">
        Making Means was developed as part of Jamie Stambolie Nelson's master's
        research in Cultural Management
      </p>
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

.about-page {
  display: flex;
  min-height: calc(100dvh - 5.5rem);
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.about-content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  padding: clamp(2.25rem, 4dvh, 4rem) clamp(1.25rem, 5.5vw, 7rem);
}

.about-content h1 {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(3rem, 4.75vw, 5.25rem);
  font-weight: 400;
  letter-spacing: 0.2em;
  line-height: 1;
  text-align: center;
  text-indent: 0.2em;
  text-transform: uppercase;
}

.about-columns {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(4rem, 7.5vw, 9rem);
  margin: clamp(2.5rem, 5dvh, 5rem) auto clamp(2rem, 4dvh, 4rem);
}

.about-column {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4dvh, 3.75rem);
}

.about-column p {
  margin: 0;
  font-size: clamp(1.05rem, 1.45vw, 1.75rem);
  font-weight: 400;
  line-height: 1.42;
}

.about-column strong {
  color: var(--mm-gold);
  font-weight: 700;
}

.about-research {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(1.1rem, 1.55vw, 1.85rem);
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
}

@media (min-width: 1101px) {
  .about-page {
    min-height: calc(100dvh - 7rem);
  }
}

@media (min-width: 1101px) and (max-height: 850px) {
  .about-content {
    padding-block: 1.5rem;
  }

  .about-content h1 {
    font-size: clamp(3rem, 4vw, 3.75rem);
  }

  .about-columns {
    margin-block: 1.75rem;
  }

  .about-column {
    gap: 1.4rem;
  }

  .about-column p {
    font-size: clamp(0.95rem, 1.2vw, 1.1rem);
    line-height: 1.3;
  }

  .about-research {
    font-size: clamp(1rem, 1.3vw, 1.2rem);
  }
}

@media (max-width: 800px) {
  .about-content {
    padding: 3rem 1.25rem;
  }

  .about-content h1 {
    font-size: clamp(2.5rem, 11vw, 3.5rem);
    line-height: 1.15;
  }

  .about-columns {
    grid-template-columns: 1fr;
    gap: 2.25rem;
    margin-block: 2.75rem;
  }

  .about-column {
    gap: 2.25rem;
  }

  .about-research {
    text-align: left;
  }
}
</style>
