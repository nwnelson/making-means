<script setup lang="ts">
import appLogo from "~/assets/icons/favicon.jpg";

const isOpen = ref(false);

const links = [
  { label: "HOME", to: "/" },
  { label: "EXHIBITION & SALE", to: "/exhibition-sales" },
  { label: "ARTISTS", to: "/artists/all" },
  { label: "THE OASIS", to: "/the-oasis" },
  { label: "IMPACT", to: "/impact" },
  { label: "CONVERSATIONS", to: "/stories" },
  { label: "ABOUT", to: "/about" },
  { label: "CONTACT", to: "/contact" },
];

const closeMenu = () => {
  isOpen.value = false;
};
</script>

<template>
  <header class="entry-header">
    <NuxtLink to="/" class="entry-logo-link" aria-label="Making Means home">
      <img :src="appLogo" alt="Making Means" class="entry-logo">
    </NuxtLink>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="entry-navigation"
      aria-label="Toggle navigation"
      @click="isOpen = !isOpen"
    >
      <span />
      <span />
      <span />
    </button>

    <nav
      id="entry-navigation"
      class="entry-navigation"
      :class="{ 'entry-navigation--open': isOpen }"
      aria-label="Primary navigation"
    >
      <NuxtLink
        v-for="link in links"
        :key="`${link.label}-${link.to}`"
        :to="link.to"
        class="entry-nav-link"
        @click="closeMenu"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.entry-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 2.25rem;
  min-height: 7rem;
  padding: 1.1rem 2.35rem;
  background: var(--mm-gold);
}

.entry-logo-link {
  display: block;
  flex: 0 0 9.1rem;
  height: 4.7rem;
  background: var(--mm-white);
}

.entry-logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.entry-navigation {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 1.35rem;
}

.entry-nav-link {
  color: var(--mm-black);
  font-family: Lato, Arial, sans-serif;
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  font-weight: 900;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}

.entry-nav-link:hover,
.entry-nav-link.router-link-exact-active {
  text-decoration: underline;
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.22em;
}

.menu-toggle {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  margin-left: auto;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  height: 0.16rem;
  margin: 0.45rem 0;
  background: var(--mm-black);
}

@media (max-width: 1100px) {
  .entry-header {
    min-height: 5.5rem;
    padding: 0.85rem 1.25rem;
  }

  .entry-logo-link {
    flex-basis: 7.6rem;
    height: 3.7rem;
  }

  .menu-toggle {
    display: block;
  }

  .entry-navigation {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 1rem 1.25rem 1.35rem;
    background: var(--mm-gold);
  }

  .entry-navigation--open {
    display: flex;
  }

  .entry-nav-link {
    padding: 0.7rem 0;
    font-size: 1.1rem;
  }
}
</style>
