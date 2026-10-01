<script lang="ts" setup>
definePageMeta({ layout: false });

useHead({
  bodyAttrs: { class: "impact-route" },
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
    <div class="impact-content" tabindex="0" role="region" aria-label="Impact information">
      <div class="impact-opening">
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
              their own experiences as practicing artists. In this way, Making Means creates an exchange that goes beyond
              financial support:
              participating artists share their skills, knowledge, and
              experiences with the next generation of Zimbabwean creatives at
              home.
            </p>
          </article>
        </section>
      </div>

      <div class="impact-followup">
        <section class="impact-transparency" aria-labelledby="transparency-title">
          <h2 id="transparency-title">Financial Transparency</h2>
          <div class="transparency-copy">
            <p>
              Making Means is an independently coordinated pilot project. Because The Oasis is
              based in Zimbabwe, payments for artwork purchases are temporarily received
              and held in the project coordinator's account before being transferred to The
              Oasis Bulawayo.
            </p>
            <p>
              100% of the artwork sale proceeds are designated for The Oasis. No artwork sale
              proceeds are retained by the project coordinator for personal profit.
            </p>
            <p>
              This page will be updated throughout the project with information about how
              funds are transferred and used, so that buyers and supporters can follow the
              impact of their purchases.
            </p>
          </div>
          <ol class="funding-flow" aria-label="How artwork proceeds are used">
            <li>Artwork purchase</li>
            <li>Funds temporarily held by project coordinator</li>
            <li>Transfer to The Oasis Bulawayo</li>
            <li>Art workshop &amp; exhibition</li>
          </ol>
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
    </div>

    <EntryContactStrip />
  </main>
</template>

<style scoped>
:global(body.impact-route) {
  --mm-gold: #d8c35a;
  --mm-green: #102117;
  --mm-black: #101a15;
  --mm-white: #fafaf7;
  overflow: hidden;
}

/* The header and contact strip stay in flow around one scrollable region. */
:global(body.impact-route #__nuxt) {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

:global(body.impact-route .entry-header) { flex: 0 0 auto; }

.impact-page {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.impact-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  container-type: size;
}

.impact-content:focus-visible {
  outline: 2px solid var(--mm-gold);
  outline-offset: -2px;
}

/* Reserve enough space for the next heading in the initial viewport.
   A minimum, rather than fixed height, lets text grow on narrow screens. */
.impact-opening {
  display: flex;
  flex-direction: column;
  min-height: calc(100cqh - 6rem);
}

.impact-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 3cqh, 2.5rem) 1.25rem;
  text-align: center;
}

.impact-page h1,
.impact-page h2,
.impact-page p { margin: 0; }

.impact-intro h1 {
  color: var(--mm-gold);
  font-size: clamp(3rem, min(4.4vw, 10cqh), 5rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  line-height: 1;
  text-indent: 0.22em;
  text-transform: uppercase;
}

.impact-intro p {
  max-width: 70ch;
  margin-top: 1.25rem;
  font-size: clamp(1.1rem, min(1.5vw, 3.5cqh), 1.6rem);
  font-weight: 700;
  line-height: 1.45;
}

.impact-intro strong { color: var(--mm-gold); font-weight: 900; }

.impact-details {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: clamp(2rem, 8vw, 10rem);
  padding: clamp(1.5rem, 3cqh, 3rem) clamp(1.25rem, 4vw, 5rem);
  background: var(--mm-gold);
  color: var(--mm-black);
}

.impact-details h2,
.impact-next h2 {
  font-size: clamp(1.75rem, min(2.5vw, 6cqh), 3rem);
  font-weight: 900;
  line-height: 1.15;
}

.impact-details h2 { margin-bottom: 1.75rem; }
.impact-details p {
  font-size: clamp(1.1rem, min(1.5vw, 3.5cqh), 1.65rem);
  line-height: 1.4;
  text-align: justify;
}

.impact-followup {
  display: flex;
  flex-direction: column;
  min-height: 100cqh;
}

.impact-transparency {
  flex: 1;
  padding: 1.75rem clamp(1.25rem, 4vw, 5rem) 2.5rem;
  text-align: center;
}

.impact-transparency h2 {
  color: var(--mm-gold);
  font-size: clamp(1.6rem, 2.2vw, 2.4rem);
  font-weight: 900;
  line-height: 1.2;
}

.transparency-copy {
  max-width: 65ch;
  margin: 2rem auto 0;
  font-size: clamp(1.1rem, min(1.5vw, 3.5cqh), 1.65rem);
  line-height: 1.45;
}

.funding-flow {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  margin: 2.5rem 0 0;
  padding: 0;
  color: var(--mm-gold);
  font-size: clamp(1rem, 1.4vw, 1.5rem);
  font-weight: 900;
  list-style: none;
}

.funding-flow li + li::before { content: "→"; margin-right: 0.35rem; }

.impact-next {
  padding: 1.5rem clamp(1.25rem, 10vw, 12rem) 2.25rem;
  background: var(--mm-gold);
  color: var(--mm-black);
  text-align: center;
}

.impact-next p {
  max-width: 75ch;
  margin: 1.75rem auto 0;
  font-size: clamp(1.1rem, min(1.5vw, 3.5cqh), 1.65rem);
  line-height: 1.45;
}

.impact-page :deep(.entry-contact) {
  flex: 0 0 auto;
  min-height: 5.75rem;
  padding-block: 1rem;
}

@media (max-width: 800px) {
  .impact-details { grid-template-columns: 1fr; gap: 2rem; }
  .impact-details h2 { margin-bottom: 1rem; }
  .impact-details p { text-align: left; }
  .funding-flow { flex-direction: column; gap: 0.75rem; }
  .funding-flow li + li::before { content: "↓"; display: block; margin: 0 0 0.75rem; }
  .impact-page :deep(.entry-contact) {
    grid-template-columns: 1fr 1fr auto;
    gap: 0.75rem;
    min-height: 0;
    padding: 0.75rem 1rem;
  }
  .impact-page :deep(.entry-contact h2),
  .impact-page :deep(.entry-contact p),
  .impact-page :deep(.entry-contact a) { font-size: clamp(0.65rem, 2.5vw, 1rem); overflow-wrap: anywhere; }
  .impact-page :deep(.entry-instagram svg) { width: 2rem; height: 2rem; }
}
</style>
