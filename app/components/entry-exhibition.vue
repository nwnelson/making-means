<template>
  <section class="entry-exhibition" aria-labelledby="exhibition-title">
    <div class="exhibition-content">
      <div>
        <h2 id="exhibition-title">ONLINE EXHIBITION NOW OPEN</h2>
        <p>Artwork sales begin <time datetime="2026-10-01">October 1, 2026</time>.</p>
      </div>
      <div class="exhibition-actions">
        <NuxtLink to="/exhibition-sales" class="exhibition-link">VIEW ARTWORKS</NuxtLink>
        <a href="#how-it-works" class="exhibition-link">HOW IT WORKS</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.entry-exhibition {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: -3rem;
  border-top: 1.25rem solid var(--mm-green);
  border-bottom: clamp(3rem, 5vw, 5rem) solid var(--mm-gold);
  font-family: Lato, Arial, sans-serif;
}

.exhibition-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(3rem, 10dvh, 7rem);
  padding: 0.75rem clamp(1.25rem, 11.25vw, 14rem) clamp(3rem, 7vw, 7rem);
}

.exhibition-content h2 {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 900;
  line-height: 1.15;
}

.exhibition-content p {
  margin: 1.5rem 0 0;
  font-size: clamp(1.4rem, 2.8vw, 2.8rem);
  line-height: 1.4;
}

.exhibition-actions {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.exhibition-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 39%;
  padding: 1.5rem 2rem;
  border-radius: 2.5rem;
  background: var(--mm-white);
  color: var(--mm-green);
  font-size: clamp(1.25rem, 2vw, 2rem);
  font-weight: 900;
  line-height: 1.15;
  text-align: center;
  text-decoration: none;
}

.exhibition-link:hover {
  background: var(--mm-gold);
}

.exhibition-link:focus-visible {
  outline: 3px solid var(--mm-gold);
  outline-offset: 5px;
}

@media (max-width: 800px) {
  .exhibition-content {
    padding: 0.75rem 1.25rem 3rem;
  }

  .exhibition-actions {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .exhibition-link {
    width: min(100%, 26rem);
  }
}
</style>
