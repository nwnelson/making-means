<script lang="ts" setup>
import Instagram from "~/assets/icons/instagram.svg";

definePageMeta({
  layout: false,
});

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
  title: "Contact",
  description:
    "Contact Making Means about artwork, collaborations, exhibitions, and general inquiries.",
  ogTitle: "Contact | Making Means",
  ogDescription:
    "Contact Making Means about artwork, collaborations, exhibitions, and general inquiries.",
});
</script>

<template>
  <main class="contact-page">
    <section class="contact-content" aria-labelledby="contact-heading">
      <h1 id="contact-heading">Contact</h1>

      <p class="contact-introduction">
        Questions about Making Means, the 2026 exhibition, the artworks, or
        future collaborations? We'd love to hear from you.
      </p>

      <div class="contact-actions">
        <a class="contact-action" href="mailto:makingmeans@gmail.com">
          <span>makingmeans@gmail.com</span>
        </a>
        <a
          class="contact-action"
          href="https://www.instagram.com/making.means/"
          target="_blank"
          rel="noreferrer"
          aria-label="Follow Making Means on Instagram"
        >
          <Instagram class="contact-instagram" aria-hidden="true" />
          <span>Instagram</span>
        </a>
      </div>

      <p class="contact-closing">
        Artists, creative organisations, and potential collaborators are welcome
        to get in touch about future editions.
      </p>
    </section>

    <EntryContactStrip />
  </main>
</template>

<style scoped>
.contact-page {
  display: flex;
  min-height: calc(100dvh - 7rem);
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.contact-content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.75rem, 5dvh, 4rem);
  padding: clamp(2rem, 4.5dvh, 4rem) 12vw clamp(3rem, 12dvh, 10rem);
  text-align: center;
}

.contact-content h1 {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(2.5rem, min(4.5vw, 8dvh), 5.5rem);
  font-weight: 400;
  letter-spacing: 0.35em;
  line-height: 1.1;
  text-indent: 0.35em;
  text-transform: uppercase;
}

.contact-introduction,
.contact-closing {
  width: 100%;
  max-width: 76ch;
  margin: 0;
  font-size: clamp(1.1rem, min(1.9vw, 3.4dvh), 2.5rem);
  line-height: 1.5;
}

.contact-introduction {
  color: var(--mm-gold);
  text-transform: uppercase;
}

.contact-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 6vw, 7.5rem);
  width: 100%;
  max-width: 88rem;
}

.contact-action {
  display: flex;
  min-height: clamp(4.5rem, 11.5dvh, 8.25rem);
  align-items: center;
  justify-content: center;
  gap: clamp(0.75rem, 1.25vw, 1.5rem);
  padding: 1rem;
  border-radius: clamp(2rem, 3vw, 4rem);
  background: var(--mm-gold);
  color: var(--mm-green);
  font-size: clamp(1rem, 2vw, 2.75rem);
  line-height: 1.2;
  text-decoration: none;
}

.contact-action span {
  text-decoration: underline;
  text-underline-offset: 0.12em;
  overflow-wrap: anywhere;
}

.contact-action:hover {
  filter: brightness(1.08);
}

.contact-action:focus-visible {
  outline: 2px solid var(--mm-white);
  outline-offset: 0.35rem;
}

.contact-instagram {
  flex: 0 0 auto;
  width: clamp(2rem, 3.5vw, 4.5rem);
  height: clamp(2rem, 3.5vw, 4.5rem);
}

@media (max-width: 1100px) {
  .contact-page {
    min-height: calc(100dvh - 5.5rem);
  }
}

@media (max-width: 800px) {
  .contact-content {
    gap: 2.5rem;
    padding: 2.5rem 1.25rem 3rem;
  }

  .contact-content h1 {
    letter-spacing: 0.2em;
    text-indent: 0.2em;
  }

  .contact-actions {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    max-width: 28rem;
  }

  .contact-action {
    font-size: clamp(1rem, 4.5vw, 1.5rem);
  }
}
</style>
