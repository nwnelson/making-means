<script lang="ts" setup>
import oasisExterior from "~/assets/images/The Oasis space 3.jpg";
import oasisInterior from "~/assets/images/Oasis space 2.jpg";

definePageMeta({ layout: false });

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
  title: "The Oasis Bulawayo",
  description:
    "Discover The Oasis Bulawayo, a Pan-African platform and creative hub for entrepreneurs, artists, charities, churches, and community builders.",
  ogTitle: "The Oasis Bulawayo | Making Means",
  ogDescription:
    "Discover The Oasis Bulawayo, a Pan-African platform and creative hub for entrepreneurs, artists, charities, churches, and community builders.",
});
</script>

<template>
  <main class="oasis-page">
    <section class="oasis-hero">
      <div class="oasis-copy">
        <h1>The Oasis Bulawayo</h1>

        <p class="oasis-description">
          The Oasis is a Pan-African platform that brings together creators and
          empowers them to create solutions to the continent’s challenges
          through entrepreneurship and the arts. The multipurpose facility in
          Bulawayo is a hub, a place of convergence for entrepreneurs,
          creatives, charities, churches and any stakeholders with a concern
          to build Bulawayo. There are spaces available for hire including an
          auditorium, boardroom and other meeting spaces. Our co-working space
          is ideal for the entrepreneur who needs reliable power, internet and
          a creative environment. Our recording studio is available for
          artists and content creators. The Oasis brings refreshment and
          revitalisation to the City!
        </p>

        <address class="oasis-details">
          <p>19 Falcon St, Belmont, Bulawayo, Zimbabwe</p>
          <p>
            <a href="tel:+263786365024">+263 78 636 5024</a>
            <span aria-hidden="true"> | </span>
            <a href="mailto:hello@theoasisbyo.com">hello@theoasisbyo.com</a>
          </p>
          <p>
            Twitter – TheOasisByo <span aria-hidden="true">|</span> Facebook –
            The Oasis <span aria-hidden="true">|</span> Instagram –
            theoasisbulawayo <span aria-hidden="true">|</span> LinkedIn–
            oasiscreatorshub
          </p>
        </address>
      </div>

      <div class="oasis-images" aria-label="The Oasis Bulawayo venue">
        <figure class="oasis-photo oasis-photo--exterior">
          <img
            :src="oasisExterior"
            alt="The exterior of The Oasis creators' hub in Bulawayo"
          >
        </figure>
        <figure class="oasis-photo oasis-photo--interior">
          <img
            :src="oasisInterior"
            alt="The auditorium inside The Oasis Bulawayo"
          >
        </figure>
      </div>
    </section>

    <EntryContactStrip />
  </main>
</template>

<style scoped>
.oasis-page {
  display: flex;
  min-height: calc(100dvh - 5.5rem);
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.oasis-hero {
  position: relative;
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: minmax(0, 1.08fr) minmax(24rem, 0.92fr);
  align-items: center;
  gap: clamp(1rem, 2vw, 2.5rem);
  min-height: 0;
  padding: clamp(2rem, 4dvh, 4rem) clamp(1.5rem, 3.8vw, 5rem);
  overflow: hidden;
}

.oasis-copy {
  position: relative;
  z-index: 2;
  min-width: 0;
}

.oasis-copy h1 {
  margin: 0 0 clamp(1rem, 2.4dvh, 2.2rem);
  color: var(--mm-gold);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(3.5rem, 5vw, 6.5rem);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 0.88;
}

.oasis-description {
  max-width: 64rem;
  margin: 0;
  font-size: clamp(1rem, 1.45vw, 1.85rem);
  font-weight: 700;
  line-height: 1.18;
}

.oasis-details {
  position: relative;
  z-index: 1;
  width: min(132%, 84rem);
  margin-top: clamp(1.35rem, 3dvh, 2.75rem);
  padding: clamp(1rem, 1.8dvh, 1.6rem) clamp(1rem, 1.2vw, 1.5rem);
  background: var(--mm-gold);
  color: var(--mm-black);
  font-style: normal;
}

.oasis-details p {
  margin: 0;
  font-size: clamp(0.9rem, 1.15vw, 1.45rem);
  line-height: 1.3;
}

.oasis-details p + p {
  margin-top: clamp(0.65rem, 1.35dvh, 1.15rem);
}

.oasis-details a {
  color: inherit;
  text-decoration: none;
}

.oasis-details a:hover,
.oasis-details a:focus-visible {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.oasis-images {
  position: relative;
  z-index: 3;
  width: min(100%, 50rem, calc((100dvh - 18rem) * 1.1));
  aspect-ratio: 1.1 / 1;
  justify-self: end;
}

.oasis-photo {
  position: absolute;
  margin: 0;
  padding: clamp(0.75rem, 1.45vw, 1.7rem);
  overflow: hidden;
  border-radius: 50%;
  background:
    radial-gradient(circle at 22% 18%, rgba(255, 245, 180, 0.7), transparent 20%),
    radial-gradient(circle at 78% 72%, rgba(179, 126, 19, 0.38), transparent 25%),
    var(--mm-gold);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.oasis-photo img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.oasis-photo--exterior {
  top: 0;
  left: 0;
  width: 58%;
  aspect-ratio: 1;
}

.oasis-photo--exterior img {
  object-position: 50% 48%;
}

.oasis-photo--interior {
  right: 0;
  bottom: 0;
  width: 58%;
  aspect-ratio: 1;
}

.oasis-photo--interior img {
  object-position: 54% 50%;
}

@media (min-width: 1101px) {
  .oasis-page {
    min-height: calc(100dvh - 7rem);
  }
}

@media (min-width: 1280px) and (min-height: 760px) {
  .oasis-page {
    height: calc(100dvh - 7rem);
  }

  .oasis-page :deep(.entry-contact) {
    flex: 0 0 8rem;
  }
}

@media (min-width: 1101px) and (max-height: 850px) {
  .oasis-hero {
    padding-block: 1.5rem;
  }

  .oasis-copy h1 {
    margin-bottom: 0.85rem;
    font-size: clamp(3.25rem, 4.2vw, 5rem);
  }

  .oasis-description {
    font-size: clamp(0.9rem, 1.22vw, 1.3rem);
    line-height: 1.14;
  }

  .oasis-details {
    margin-top: 1rem;
    padding-block: 0.8rem;
  }

  .oasis-details p {
    font-size: clamp(0.8rem, 1vw, 1.05rem);
  }

  .oasis-details p + p {
    margin-top: 0.55rem;
  }

  .oasis-images {
    width: min(100%, 38rem, calc((100dvh - 18rem) * 1.1));
  }
}

@media (max-width: 900px) {
  .oasis-hero {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 3rem 1.25rem;
    overflow: visible;
  }

  .oasis-copy h1 {
    font-size: clamp(3.5rem, 13vw, 5.5rem);
    line-height: 0.92;
  }

  .oasis-description {
    font-size: clamp(1rem, 3.8vw, 1.25rem);
    line-height: 1.35;
  }

  .oasis-details {
    width: 100%;
  }

  .oasis-details p {
    font-size: 0.95rem;
  }

  .oasis-images {
    width: min(100%, 34rem);
    aspect-ratio: 1 / 1.08;
    justify-self: center;
  }
}

@media (max-width: 480px) {
  .oasis-images {
    aspect-ratio: 1 / 1.22;
  }

  .oasis-photo--exterior {
    width: 64%;
  }

  .oasis-photo--interior {
    width: 64%;
  }
}
</style>
