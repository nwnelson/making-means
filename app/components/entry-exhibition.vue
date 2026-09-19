<template>
  <section class="entry-exhibition" aria-labelledby="exhibition-title">
    <div class="sales-announcement">
      <div class="sales-announcement-track">
        <div
          v-for="copy in 2"
          :key="copy"
          class="sales-announcement-group"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <span>SALES BEGIN OCTOBER 1</span>
          <span aria-hidden="true">SALES BEGIN OCTOBER 1</span>
          <span aria-hidden="true">SALES BEGIN OCTOBER 1</span>
        </div>
      </div>
    </div>

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
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 7rem);
  border-top: 1.25rem solid var(--mm-green);
  border-bottom: clamp(3rem, 5vw, 5rem) solid var(--mm-gold);
  font-family: Lato, Arial, sans-serif;
}

.sales-announcement {
  overflow: hidden;
  padding-block: 0.5rem;
  background: var(--mm-white);
  color: var(--mm-green);
  font-size: clamp(1rem, 1.65vw, 1.75rem);
  line-height: 1.4;
  text-align: center;
}

.sales-announcement-track {
  display: flex;
  animation: sales-scroll 60s linear infinite;
}

.sales-announcement-group {
  display: flex;
  flex: 0 0 100%;
  justify-content: space-around;
}

.sales-announcement-group span {
  flex: 1;
  padding-inline: 1.25rem;
  white-space: nowrap;
}

.sales-announcement:hover .sales-announcement-track {
  animation-play-state: paused;
}

@keyframes sales-scroll {
  to {
    transform: translateX(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sales-announcement-track {
    animation: none;
  }
}

.exhibition-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: clamp(3rem, 10dvh, 7rem);
  padding: clamp(3rem, 7vw, 7rem) clamp(1.25rem, 11.25vw, 14rem);
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
  .entry-exhibition {
    min-height: calc(100dvh - 5.5rem);
  }

  .sales-announcement span[aria-hidden] {
    display: none;
  }

  .exhibition-content {
    padding: 3rem 1.25rem;
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
