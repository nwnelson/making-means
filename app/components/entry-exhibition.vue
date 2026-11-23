<template>
  <section class="entry-exhibition" aria-labelledby="exhibition-title">
    <div class="exhibition-content">
      <div class="exhibition-columns">
        <div class="exhibition-panel">
          <h2 id="exhibition-title">ONLINE EXHIBITION</h2>
          <p>
            100% of artwork sale proceeds go towards supporting the upcoming
            event at The Oasis Bulawayo.
            <strong>Now Open</strong>
          </p>
          <NuxtLink to="/exhibition-sales" class="exhibition-link">
            EXPLORE THE EXHIBITION
          </NuxtLink>
        </div>
        <div class="exhibition-panel exhibition-call">
          <h2>JOIN US IN BULAWAYO</h2>
          <p>
            The Oasis Bulawayo invites you to an evening of art talks and exhibition,
            celebrating the culmination of this year's creative initiative.
            <strong><time datetime="2026-11-27">27 November 2026</time> | 4:30–7 PM</strong>
          </p>
          <NuxtLink to="/the-oasis#making-means-x-the-oasis" class="exhibition-link">
            VIEW EVENT DETAILS
          </NuxtLink>
        </div>
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
  font-family: Lato, Arial, sans-serif;
}

.exhibition-content {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 3vw, 3rem);
  padding: 3rem clamp(1.25rem, 5.6vw, 7rem) 0;
}

.exhibition-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.exhibition-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2.5rem clamp(1.5rem, 7vw, 8.5rem) 1rem 0;
}

.exhibition-call {
  border-left: clamp(0.25rem, 0.6vw, 0.75rem) solid var(--mm-gold);
  padding-right: 0;
  padding-left: clamp(1.5rem, 7vw, 8.5rem);
}

.exhibition-panel h2 {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(1.35rem, 2.3vw, 2.9rem);
  font-weight: 900;
  line-height: 1.15;
}

.exhibition-panel p {
  margin: 1.5rem 0 2.5rem;
  font-size: clamp(1.25rem, 2.15vw, 2.6rem);
  line-height: 1.65;
}

.exhibition-panel strong {
  display: block;
  margin-top: 0.5rem;
  font-weight: 900;
}

.exhibition-call p {
  font-size: clamp(1.1rem, 1.85vw, 2.25rem);
}

.exhibition-link {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 90%;
  align-self: center;
  margin-top: auto;
  padding: 1.5rem 1rem;
  border: 0;
  border-radius: 5rem;
  background: var(--mm-white);
  color: var(--mm-green);
  font-family: inherit;
  font-size: clamp(1rem, 1.5vw, 1.875rem);
  font-weight: 900;
  line-height: 1.15;
  text-align: center;
  text-decoration: none;
}

.exhibition-link:hover:not(:disabled) {
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

  .exhibition-columns {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .exhibition-panel {
    padding: 0;
  }

  .exhibition-call {
    border-top: 0.25rem solid var(--mm-gold);
    border-left: 0;
    padding-top: 2rem;
  }

  .exhibition-link {
    align-self: center;
    width: min(100%, 26rem);
  }
}
</style>
