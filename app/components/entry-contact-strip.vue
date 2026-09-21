<script setup lang="ts">
import InstagramIcon from "~/components/icons/InstagramIcon.vue";
</script>

<template>
  <section class="entry-contact" aria-label="Contact information">
    <div>
      <h2>Contact:</h2>
      <a href="mailto:makingmeans@gmail.com">makingmeans@gmail.com</a>
    </div>
    <div>
      <h2>Developed by:</h2>
      <p>Nathan Nelson</p>
    </div>
    <a
      href="https://www.instagram.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Making Means on Instagram"
      class="entry-instagram"
    >
      <InstagramIcon size="lg" />
    </a>
  </section>
</template>

<style scoped>
.entry-contact {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 3rem;
  min-height: 8rem;
  padding: 1.5rem clamp(2rem, 18.6vw, 26rem);
  background: var(--mm-white);
  color: var(--mm-black);
  font-family: Lato, Arial, sans-serif;
}

.entry-contact h2,
.entry-contact p,
.entry-contact a {
  margin: 0;
  font-size: clamp(1.1rem, 1.5vw, 1.5rem);
  line-height: 1.25;
}

.entry-contact h2 {
  font-family: Lato, Arial, sans-serif;
  font-weight: 900;
}

.entry-contact a {
  color: inherit;
  text-decoration: none;
}

.entry-contact a:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.entry-instagram {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 800px) {
  .entry-contact {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 2rem 1.25rem;
  }

  .entry-instagram {
    justify-content: flex-start;
  }
}
</style>
