<script lang="ts" setup>
const supabase = useSupabaseClient();
const { startLoading, stopLoading } = useLoading();

const isOpen = ref(false);

const toggleNav = () => {
  isOpen.value = !isOpen.value;
};

const closeNav = () => {
  isOpen.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeNav();
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const logout = async () => {
  try {
    startLoading();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    await navigateTo("/admin/login");
  } catch (err) {
    console.error("Unexpected logout error:", err);
  } finally {
    stopLoading();
  }
};
</script>

<template>
  <div class="admin-nav-root">
    <header class="admin-mobile-bar">
      <NuxtLink to="/admin/dashboard" class="admin-mobile-brand">Making Means <span>Admin</span></NuxtLink>
      <button class="admin-menu-button" type="button" aria-label="Open admin navigation" :aria-expanded="isOpen" @click="toggleNav">
        <span /><span /><span />
      </button>
    </header>

    <button v-if="isOpen" class="admin-nav-backdrop" type="button" aria-label="Close admin navigation" @click="closeNav" />

    <aside class="admin-sidebar" :class="{ 'admin-sidebar--open': isOpen }">
      <div class="admin-sidebar-header">
        <NuxtLink to="/admin/dashboard" class="admin-brand" @click="closeNav">
          <span class="admin-brand-mark">MM</span>
          <span class="admin-brand-copy"><strong>Making Means</strong><small>Admin</small></span>
        </NuxtLink>
        <button class="admin-close-button" type="button" aria-label="Close admin navigation" @click="closeNav">×</button>
      </div>

      <nav class="admin-navigation" aria-label="Admin navigation">
        <NuxtLink to="/admin/dashboard" class="admin-nav-link" @click="closeNav">Dashboard</NuxtLink>
        <NuxtLink to="/admin/orders" class="admin-nav-link" @click="closeNav">Orders</NuxtLink>
        <NuxtLink to="/admin/artworks" class="admin-nav-link" @click="closeNav">Artworks</NuxtLink>
        <NuxtLink to="/admin/artists/artists" class="admin-nav-link" @click="closeNav">Artists</NuxtLink>
        <NuxtLink to="/admin/collections/collections" class="admin-nav-link" @click="closeNav">Collections</NuxtLink>
        <NuxtLink to="/admin/coverImages" class="admin-nav-link" @click="closeNav">Cover images</NuxtLink>
        <NuxtLink to="/admin/settings" class="admin-nav-link" @click="closeNav">Settings</NuxtLink>
      </nav>

      <div class="admin-sidebar-footer">
        <NuxtLink to="/" class="admin-nav-link admin-nav-link--quiet" @click="closeNav">View site</NuxtLink>
        <button class="admin-signout" type="button" @click="logout">Sign out</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.admin-mobile-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1rem;
  background: var(--mm-gold);
  color: var(--mm-green);
  border-bottom: 1px solid rgb(16 33 23 / 20%);
}

.admin-mobile-brand,
.admin-brand {
  color: inherit;
  text-decoration: none;
}

.admin-mobile-brand {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.admin-mobile-brand span {
  font-weight: 400;
}

.admin-menu-button {
  width: 2.75rem;
  height: 2.75rem;
  padding: 0.55rem;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.admin-menu-button span {
  display: block;
  height: 2px;
  margin: 0.35rem 0;
  background: var(--mm-green);
}

.admin-nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 940;
  border: 0;
  background: rgb(0 0 0 / 48%);
}

.admin-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 950;
  transform: translateX(-100%);
  display: flex;
  flex-direction: column;
  width: min(20rem, 88vw);
  padding: 1.25rem;
  background: var(--mm-green);
  color: var(--mm-white);
  transition: transform 180ms ease;
}

.admin-sidebar--open {
  transform: translateX(0);
}

.admin-sidebar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 2rem;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-brand-mark {
  display: grid;
  width: 3rem;
  aspect-ratio: 1;
  place-items: center;
  background: var(--mm-gold);
  color: var(--mm-green);
  font-family: "Times New Roman", serif;
  font-size: 1.15rem;
}

.admin-brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.admin-brand-copy strong {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.admin-brand-copy small {
  margin-top: 0.3rem;
  color: var(--mm-gold);
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.admin-close-button {
  color: var(--mm-white);
  background: none;
  border: 0;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.admin-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.admin-nav-link,
.admin-signout {
  display: block;
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.admin-nav-link:hover,
.admin-nav-link:focus-visible,
.admin-signout:hover,
.admin-signout:focus-visible {
  background: rgb(255 255 255 / 7%);
}

.admin-nav-link.router-link-exact-active {
  border-left-color: var(--mm-gold);
  background: rgb(216 195 90 / 12%);
  color: var(--mm-gold);
}

.admin-sidebar-footer {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(250 250 247 / 18%);
}

.admin-nav-link--quiet,
.admin-signout {
  font-weight: 400;
}

@media (min-width: 1024px) {
  .admin-mobile-bar,
  .admin-nav-backdrop,
  .admin-close-button {
    display: none;
  }

  .admin-sidebar {
    width: 16rem;
    transform: none;
  }
}
</style>
