<template>
  <section class="entry-exhibition" aria-labelledby="exhibition-title">
    <div class="exhibition-content">
      <div class="exhibition-columns">
        <div class="exhibition-panel">
          <h2 id="exhibition-title">ONLINE EXHIBITION</h2>
          <p>
            100% of artwork sale proceeds support The Oasis Bulawayo.
            <strong>Now Open</strong>
          </p>
          <NuxtLink to="/exhibition-sales" class="exhibition-link">
            EXPLORE THE EXHIBITION
          </NuxtLink>
        </div>
        <div class="exhibition-panel exhibition-call">
          <h2>OPEN CALL: BULAWAYO ARTISTS</h2>
          <p>
            In collaboration with The Oasis Bulawayo, we're inviting artists and
            creatives in Bulawayo to register for an upcoming local exhibition and
            creative gathering.
            <strong>Deadline: <time datetime="2026-11-12">12 November 2026</time></strong>
          </p>
          <NuxtLink to="/the-oasis#making-means-x-the-oasis" class="exhibition-link">
            FIND OUT MORE/REGISTER
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
  border-bottom: clamp(3rem, 5vw, 5rem) solid var(--mm-gold);
  font-family: Lato, Arial, sans-serif;
}

.exhibition-content {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 3vw, 3rem);
  padding: 0.75rem clamp(1.25rem, 11.25vw, 14rem) clamp(3rem, 7vw, 7rem);
}

.exhibition-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.exhibition-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: clamp(1.5rem, 4vw, 4rem);
}

.exhibition-call {
  border-left: clamp(0.25rem, 0.6vw, 0.75rem) solid var(--mm-gold);
  padding-right: 0;
  padding-left: clamp(1.5rem, 4vw, 4rem);
}

.exhibition-panel h2 {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(1.35rem, 2vw, 2.5rem);
  font-weight: 900;
  line-height: 1.15;
}

.exhibition-panel p {
  margin: 1.5rem 0 2.5rem;
  font-size: clamp(1.25rem, 1.8vw, 2.25rem);
  line-height: 1.65;
}

.exhibition-panel strong {
  display: block;
  margin-top: 0.5rem;
  font-weight: 900;
}

.exhibition-call p {
  font-size: clamp(1.1rem, 1.4vw, 1.75rem);
}

.exhibition-link {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin-top: auto;
  padding: 1.5rem 1rem;
  border: 0;
  border-radius: 2.5rem;
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
