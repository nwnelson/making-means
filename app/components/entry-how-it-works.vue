<template>
  <section id="how-it-works" class="entry-how" aria-labelledby="how-title">
    <div class="how-copy">
      <h2 id="how-title">HOW IT WORKS</h2>
      <ol class="how-steps">
        <li>
          <h3>01 — Artists create</h3>
          <p>Zimbabwean artists living abroad create original artworks for the annual edition.</p>
        </li>
        <li>
          <h3>02 — Art is exhibited</h3>
          <p>The works are presented through an online exhibition.</p>
        </li>
        <li>
          <h3>03 — You purchase</h3>
          <p>Collectors can purchase original artworks from the online exhibition, with 100% of artwork proceeds supporting the local initiative.</p>
        </li>
        <li>
          <h3>04 — Artwork sales help fund a local creative initiative</h3>
          <p>Proceeds support a local event hosted by The Oasis Bulawayo, creating opportunities for artists and creatives in the community.</p>
        </li>
        <li>
          <h3>05 — We document the impact</h3>
          <p>Making Means follows and shares how the collaboration develops.</p>
        </li>
      </ol>
    </div>

    <div class="how-actions">
      <NuxtLink to="/artists/all" class="how-link">MEET THE ARTISTS</NuxtLink>
      <NuxtLink to="/the-oasis" class="how-link">MEET THE OASIS BULAWAYO</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.entry-how {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 4vw, 4rem);
  min-height: calc(100dvh - 7rem);
  padding: clamp(3rem, 6vw, 6rem) clamp(1.25rem, 5.45vw, 7.75rem);
  scroll-margin-top: 2rem;
  font-family: Lato, Arial, sans-serif;
}

.how-copy h2 {
  margin: 0 0 2rem;
  text-align: center;
  font-size: clamp(2rem, 2.8vw, 2.8rem);
  font-weight: 900;
  line-height: 1.1;
}

.how-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: clamp(1.25rem, 1.9vw, 2.3rem);
  line-height: 1.4;
}

.how-steps h3,
.how-steps p {
  margin: 0;
  font-size: inherit;
}

.how-steps h3 {
  margin-bottom: 0.2rem;
  color: var(--mm-gold);
  font-weight: 900;
}

.how-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  align-content: center;
  align-self: center;
  justify-items: center;
  gap: 3rem;
}

.how-link {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: min(100%, 40rem);
  padding: 1.5rem 2rem;
  border-radius: 2.5rem;
  background: var(--mm-gold);
  color: var(--mm-green);
  font-size: clamp(1.25rem, 2vw, 2rem);
  font-weight: 900;
  line-height: 1.15;
  text-align: center;
  text-decoration: none;
}

.how-link:hover {
  background: var(--mm-white);
}

.how-link:focus-visible {
  outline: 3px solid var(--mm-white);
  outline-offset: 5px;
}

@media (min-width: 1201px) and (max-height: 950px) {
  .how-steps {
    font-size: clamp(1.25rem, 2.8dvh, 1.75rem);
  }
}

@media (max-width: 1000px) {
  .entry-how {
    grid-template-columns: 1fr;
    min-height: calc(100dvh - 5.5rem);
  }

  .how-actions {
    gap: 1.5rem;
  }

  .how-link {
    width: min(100%, 26rem);
  }
}

@media (max-width: 600px) {
  .how-actions {
    grid-template-columns: 1fr;
  }
}
</style>
