<script lang="ts" setup>
definePageMeta({ layout: "default" });

useHead({
  bodyAttrs: {
    class: "conversations-route",
  },
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
  title: "Conversations",
  description:
    "Conversations connecting participating artists, Zimbabweans abroad, and members of The Oasis Bulawayo.",
  ogTitle: "Conversations | Making Means",
  ogDescription:
    "Conversations connecting participating artists, Zimbabweans abroad, and members of The Oasis Bulawayo.",
});
</script>

<template>
  <main class="conversations-page">
    <div class="page-divider" aria-hidden="true" />

    <header class="conversations-banner">
      <h1>Conversations</h1>
    </header>

    <section class="conversations-content">
      <p class="conversations-introduction">
        <strong>Making Means</strong> is not only about moving artwork and
        resources between Zimbabweans abroad and communities at home. It is
        also about creating space for conversation, connection, and exchange.
      </p>

      <div class="conversation-feature">
        <p class="conversation-description">
          In this conversation, three Zimbabwean artists living abroad
speak with members of The Oasis Bulawayo about their
connections to Zimbabwe, their artistic practices, and the
creative communities they are part of.
The conversation explores what is happening within Bulawayo’s
creative community, some of the challenges it faces, and the
ways Zimbabwean artists living abroad remain connected to
home. Together, they consider the potential for greater
exchange between creative communities in Zimbabwe and
those living abroad, and reflect on what they hope might
emerge from Making Means in the years ahead.
        </p>

        <div class="video-frame">
          <iframe
            src="https://www.youtube.com/embed/WyZRulON4lo"
            title="Making Means conversation video"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(body.conversations-route) {
  --mm-gold: #d8c35a;
  --mm-green: #102117;
  --mm-black: #101a15;
  --mm-white: #fafaf7;
}

:global(body.conversations-route .page) {
  min-height: calc(100dvh - 7rem);
  padding: 0;
}

.conversations-page {
  display: flex;
  width: 100%;
  min-height: calc(100dvh - 15rem);
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.page-divider {
  flex: 0 0 clamp(1.1rem, 2dvh, 2rem);
  background: var(--mm-green);
}

.conversations-banner {
  display: grid;
  flex: 0 0 auto;
  min-height: clamp(6rem, 13dvh, 9rem);
  padding: 0.75rem 1.25rem;
  place-items: center;
  background: var(--mm-gold);
  color: var(--mm-green);
  text-align: center;
}

.conversations-banner h1 {
  margin: 0;
  font-family: Lato, Arial, sans-serif;
  font-size: clamp(2.4rem, 5vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.2em;
  line-height: 1;
  text-transform: uppercase;
}

.conversations-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  width: min(100%, 104rem);
  margin: 0 auto;
  padding: clamp(1.4rem, 3dvh, 2.5rem) clamp(2rem, 6vw, 7rem)
    clamp(1.5rem, 3dvh, 2.5rem);
}

.conversations-introduction {
  max-width: 78rem;
  margin: 0 auto;
  font-size: clamp(1.265rem, 1.925vw, 1.925rem);
  line-height: 1.28;
  text-align: center;
}

.conversations-introduction strong {
  color: var(--mm-gold);
  font-weight: 400;
}

.conversation-feature {
  display: grid;
  grid-template-columns: minmax(20rem, 0.9fr) minmax(28rem, 1.1fr);
  align-items: center;
  gap: clamp(3rem, 8vw, 9rem);
  margin-top: clamp(1.75rem, 4dvh, 3.5rem);
}

.conversation-description {
  max-width: 39rem;
  margin: 0;
  font-size: clamp(1.15rem, 1.65vw, 1.65rem);
  line-height: 1.28;
}

.video-frame {
  position: relative;
  width: min(100%, 38rem);
  aspect-ratio: 16 / 9;
  justify-self: center;
  overflow: hidden;
  border-radius: clamp(2rem, 4vw, 4rem);
  background: #000;
}

.video-frame iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 0;
  inset: 0;
}

@media (max-width: 1100px) {
  :global(body.conversations-route .page) {
    min-height: calc(100dvh - 5.5rem);
  }

  .conversations-page {
    min-height: calc(100dvh - 13.5rem);
  }

  .conversations-content {
    padding-right: clamp(1.5rem, 4vw, 3rem);
    padding-left: clamp(1.5rem, 4vw, 3rem);
  }

  .conversation-feature {
    grid-template-columns: minmax(17rem, 0.85fr) minmax(22rem, 1.15fr);
    gap: clamp(2rem, 5vw, 4rem);
  }
}

@media (min-width: 801px) {
  .page-divider {
    flex-basis: 1.5dvh;
  }

  .conversations-banner {
    min-height: clamp(4rem, 10dvh, 7rem);
  }

  .conversations-banner h1 {
    font-size: clamp(2.25rem, min(4vw, 5.5dvh), 4rem);
  }

  .conversations-content {
    width: min(90%, 94rem);
    padding-block: 2dvh;
  }

  .conversations-introduction,
  .conversation-description {
    font-size: clamp(1rem, min(1.35vw, 2.2dvh), 1.4rem);
    line-height: 1.3;
  }

  .conversations-introduction {
    font-size: clamp(1.1rem, min(1.485vw, 2.42dvh), 1.54rem);
  }

  .conversation-feature {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: 4vw;
    margin-top: 2.5dvh;
  }

  .video-frame {
    width: min(100%, 34rem, 52dvh);
  }
}

@media (max-width: 800px) {
  .conversations-page {
    min-height: 0;
  }

  .page-divider {
    flex-basis: 1rem;
  }

  .conversations-banner {
    min-height: 6rem;
  }

  .conversations-banner h1 {
    letter-spacing: 0.12em;
  }

  .conversations-content {
    padding: 2rem 1.25rem 3rem;
  }

  .conversation-feature {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 2.5rem;
  }

  .conversation-description,
  .video-frame {
    width: min(100%, 38rem);
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .conversations-banner h1 {
    font-size: clamp(1.85rem, 10vw, 2.4rem);
    letter-spacing: 0.08em;
  }

  .conversations-introduction,
  .conversation-description {
    font-size: 1.05rem;
  }

  .conversations-introduction {
    font-size: 1.155rem;
  }

  .video-frame {
    border-radius: 1.75rem;
  }
}
</style>
