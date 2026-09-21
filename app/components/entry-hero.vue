<template>
  <section class="entry-hero" aria-labelledby="entry-edition-title">
    <svg class="entry-mark" viewBox="0 0 662 766" role="img" aria-label="Making Means">
      <rect width="662" height="766" fill="var(--mm-gold)" />
      <g fill="var(--mm-green)" font-family="Times New Roman, Times, serif" font-size="360">
        <text x="60" y="440">M</text>
        <text x="318" y="568" textLength="255" lengthAdjust="spacingAndGlyphs">M</text>
      </g>
      <rect x="286" width="98" height="766" fill="var(--mm-green)" />
      <text
        transform="translate(326 196) rotate(90)"
        fill="var(--mm-gold)"
        font-family="Times New Roman, Times, serif"
        font-size="44"
        letter-spacing="2"
      >MAKING MEANS</text>
    </svg>

    <section class="entry-copy" aria-labelledby="entry-edition-title">
      <p class="entry-intro">
        <strong>MAKING MEANS</strong> connects Zimbabwean artists living abroad
        with local creative organizations in Zimbabwe, creating opportunities
        for collaboration through art, conversation, and exchange. Through an
        online exhibition and sale of artworks, the project explores how these
        collaborations can generate resources for locally led creative
        initiatives.
      </p>

      <h1 id="entry-edition-title">2026 EDITION</h1>
      <p class="entry-banner">3 artists. One collaboration. A conversation across borders.</p>
      <p class="entry-edition-description">
        For the inaugural edition, three Zimbabwean artists living abroad have
        created original works in support of
        <a href="/the-oasis">The Oasis Bulawayo</a>,
        an organisation supporting creatives and entrepreneurs in Bulawayo.
      </p>
    </section>
  </section>
</template>

<style scoped>
.entry-hero {
  --entry-content-height: clamp(26rem, min(42vw, 66dvh), 48rem);

  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(3rem, 7vw, 8rem);
  min-height: 0;
  padding: clamp(3.5rem, 6vw, 6.5rem) clamp(3rem, 5.45vw, 7.75rem);
  background: var(--mm-green);
  color: var(--mm-white);
}

.entry-mark {
  display: block;
  flex: 0 0 auto;
  width: calc(var(--entry-content-height) * 662 / 766);
  max-width: 100%;
  height: var(--entry-content-height);
}

.entry-copy {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  min-width: 0;
  min-height: var(--entry-content-height);
  max-width: 68rem;
  font-family: Lato, Arial, sans-serif;
  font-size: clamp(1.4rem, 1.9vw, 2.3rem);
  line-height: 1.4;
}

.entry-copy p,
.entry-copy h1 {
  margin: 0;
}

.entry-intro strong,
.entry-copy h1,
.entry-edition-description a {
  color: var(--mm-gold);
  font-weight: 900;
}

.entry-copy h1 {
  font-size: clamp(2rem, 2.8vw, 2.8rem);
  line-height: 1;
}

.entry-banner {
  padding: 0.5rem 1rem;
  background: var(--mm-gold);
  color: var(--mm-green);
}

.entry-edition-description a {
  text-decoration: none;
}

.entry-edition-description a:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

@media (min-width: 1201px) and (max-height: 950px) {
  .entry-hero {
    --entry-content-height: clamp(23rem, 54dvh, 33rem);

    padding-block: clamp(1.5rem, 3dvh, 2.5rem);
  }

  .entry-copy {
    font-size: clamp(1.25rem, 2.8dvh, 1.75rem);
  }
}

@media (max-width: 1200px) {
  .entry-hero {
    --entry-content-height: min(28rem, calc(100vw - 2.5rem));

    flex-direction: column;
    gap: clamp(2.5rem, 7vw, 4rem);
    padding: 2.5rem 1.25rem 4rem;
  }

  .entry-copy {
    flex: none;
    gap: clamp(2rem, 6vw, 3.5rem);
    width: min(100%, 42rem);
    min-height: 0;
    font-size: clamp(1.25rem, 3vw, 1.75rem);
  }
}
</style>
