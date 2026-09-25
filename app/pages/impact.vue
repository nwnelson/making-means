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
  title: "Impact",
  description:
    "Learn how Making Means supports young creatives in Bulawayo through art, entrepreneurship, and meaningful exchange.",
  ogTitle: "Impact | Making Means",
  ogDescription:
    "Learn how Making Means supports young creatives in Bulawayo through art, entrepreneurship, and meaningful exchange.",
});
</script>

<template>
  <main class="impact-page">
    <div class="impact-content">
      <section class="impact-intro">
        <h1>Impact</h1>
        <p>
          <strong>Making Means</strong> is about more than selling artwork. It is
          about creating meaningful exchanges between Zimbabwean artists living
          abroad and creative communities at home.
        </p>
      </section>

      <section class="impact-details" aria-label="2026 impact project">
        <article>
          <h2>2026 Pilot Project</h2>
          <p>
            100% of artwork sale proceeds from the exhibition will support an
            art workshop and exhibition in Bulawayo, hosted
            by The Oasis Bulawayo on November 27, 2026. These funds will make
            possible: materials, facilitators, technical support, and refreshments. The artworks
            help make the event possible.
          </p>
        </article>

        <article>
          <h2>Sharing More Than Resources</h2>
          <p>
            The artists participating in this online exhibition will
            also join the local event virtually, leading workshops based on
            their own experiences as practicing artists. In this way, the
            project creates an exchange that goes beyond financial support.
            In this way, Making Means creates an exchange that goes beyond
            financial support:
            participating artists share their skills, knowledge, and
            experiences with the next generation of Zimbabwean creatives at
            home.
          </p>
        </article>
      </section>

      <section class="impact-next">
        <h2>What Happens Next?</h2>
        <p>
          Check back after November 27 to see the event in action, how the funds
          from the exhibition were used, and the impact of the collaboration on
          young creatives in Bulawayo.
        </p>
      </section>
    </div>

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

.impact-page {
  display: flex;
  min-height: calc(100dvh - 5.5rem);
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.impact-content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

.impact-intro,
.impact-next {
  background: var(--mm-green);
  text-align: center;
}

.impact-intro {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4dvh, 3rem) clamp(1.25rem, 10vw, 12rem);
}

.impact-intro h1,
.impact-intro p,
.impact-details h2,
.impact-details p,
.impact-next h2,
.impact-next p {
  margin: 0;
}

.impact-intro h1 {
  color: var(--mm-gold);
  font-size: clamp(3rem, 5vw, 5.5rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  line-height: 1;
  text-indent: 0.22em;
  text-transform: uppercase;
}

.impact-intro p {
  max-width: 90ch;
  width: min(100%, 66vw);
  margin-top: clamp(1.25rem, 2vw, 2rem);
  font-size: clamp(1.15rem, 1.6vw, 1.925rem);
  font-weight: 700;
  line-height: 1.45;
}

.impact-intro strong {
  color: var(--mm-gold);
  font-weight: 900;
}

.impact-details {
  display: grid;
  flex: 1.55 1 auto;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: clamp(3rem, 8vw, 10rem);
  padding: clamp(1.5rem, 3.5dvh, 3rem) clamp(2rem, 3.8vw, 5rem);
  background: var(--mm-gold);
  color: var(--mm-black);
}

.impact-details article {
  align-self: start;
}

.impact-details h2 {
  margin-bottom: clamp(1.1rem, 2vw, 2.1rem);
  font-size: clamp(1.75rem, 2.5vw, 3.35rem);
  font-weight: 900;
  line-height: 1.1;
}

.impact-details p {
  font-size: clamp(1.1rem, 1.6vw, 1.925rem);
  line-height: 1.45;
  text-align: justify;
}

.impact-next {
  display: flex;
  flex: 0.65 1 auto;
  min-height: 9rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1.4rem, 2.2vw, 2.5rem) clamp(1.25rem, 10vw, 12rem);
}

.impact-next h2 {
  color: var(--mm-gold);
  font-size: clamp(1.45rem, 1.8vw, 2rem);
  font-weight: 900;
  line-height: 1.2;
}

.impact-next p {
  max-width: 90ch;
  width: min(100%, 66vw);
  margin-top: 0.65rem;
  font-size: clamp(1.1rem, 1.6vw, 1.925rem);
  line-height: 1.4;
}

@media (min-width: 1101px) {
  .impact-page {
    min-height: calc(100dvh - 7rem);
  }
}

@media (min-width: 1280px) and (min-height: 850px) {
  .impact-page :deep(.entry-contact) {
    flex: 0 0 auto;
  }
}

@media (min-width: 1280px) and (min-height: 850px) and (max-height: 1019px) {
  .impact-intro {
    min-height: 0;
    padding-block: 1.5rem;
  }

  .impact-intro h1 {
    font-size: 3.5rem;
  }

  .impact-intro p {
    margin-top: 0.75rem;
    font-size: 1.2rem;
    line-height: 1.3;
  }

  .impact-details {
    padding-block: 1.5rem;
  }

  .impact-details h2 {
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  .impact-details p {
    font-size: 1.1rem;
    line-height: 1.35;
  }

  .impact-next {
    min-height: 0;
    padding-block: 1.2rem;
  }

  .impact-next h2 {
    font-size: 1.4rem;
  }

  .impact-next p {
    font-size: 1.1rem;
    line-height: 1.3;
  }
}

@media (max-width: 800px) {
  .impact-intro p,
  .impact-next p {
    width: 100%;
  }

  .impact-details p {
    text-align: left;
  }

  .impact-intro {
    min-height: 0;
  }

  .impact-details {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2.5rem 1.25rem;
  }

  .impact-details h2 {
    margin-bottom: 0.8rem;
  }

  .impact-next {
    min-height: 0;
    padding: 2.5rem 1.25rem;
  }
}
</style>
