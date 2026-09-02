<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Admin Dashboard",
  robots: "noindex, nofollow",
});

const { getStats } = useDashboard();
const { getArtworks } = useArtworks();
const { getOrders } = useOrders();
const { startLoading, stopLoading } = useLoading();

const {
  data: stats,
  pending: loadingStats,
  error: statsError,
} = await getStats();
const {
  data: artworks,
  pending: loadingArtworks,
  error: artworksError,
} = await getArtworks();
const {
  data: orders,
  pending: loadingOrders,
  error: ordersError,
} = await getOrders();

const isLoading = computed(
  () => loadingStats.value || loadingArtworks.value || loadingOrders.value,
);

watch(isLoading, (loading) => {
  if (loading) {
    startLoading();
  } else {
    stopLoading();
  }
});
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Dashboard" description="An overview of artwork, orders, and funds raised." />

    <div v-if="isLoading" class="admin-empty"><div class="admin-empty__content"><h2>Loading dashboard…</h2></div></div>
    <AdminEmptyState v-else-if="statsError || artworksError || ordersError" title="Dashboard could not be loaded" message="Refresh the page to try again." />

    <template v-else>
      <section class="admin-section" aria-labelledby="overview-heading">
        <div class="admin-section-heading"><h2 id="overview-heading">Overview</h2></div>
        <div class="admin-stats">
          <div class="admin-stat"><span class="admin-stat__value">{{ stats?.artworks ?? 0 }}</span><span class="admin-stat__label">Artworks</span></div>
          <div class="admin-stat"><span class="admin-stat__value">{{ formatFunds(stats?.fundsRaised || 0) }}</span><span class="admin-stat__label">Funds raised</span></div>
          <div class="admin-stat"><span class="admin-stat__value">{{ stats?.orders ?? 0 }}</span><span class="admin-stat__label">Orders</span></div>
        </div>
      </section>

      <div class="dashboard-columns">
        <AdminPanel class="admin-section">
          <div class="admin-section-heading"><h2>Recent artworks</h2><NuxtLink to="/admin/artworks" class="admin-text-link">View all</NuxtLink></div>
          <ul v-if="artworks?.length" class="admin-list">
            <li v-for="artwork in artworks.slice(0, 3)" :key="artwork.id">
              <NuxtLink :to="`/admin/editContent/artworks/${artwork.id}`" class="admin-list-row">
                <NuxtImg :src="artwork.image_path ?? undefined" :alt="artwork.title ?? 'Artwork'" class="admin-list-row__image" />
                <div class="admin-list-row__content"><p class="admin-list-row__title">{{ artwork.title }}</p><p class="admin-list-row__meta">Open artwork</p></div>
              </NuxtLink>
            </li>
          </ul>
          <AdminEmptyState v-else title="No artworks yet" message="New artworks will appear here." />
        </AdminPanel>

        <AdminPanel class="admin-section">
          <div class="admin-section-heading"><h2>Recent orders</h2><NuxtLink to="/admin/orders" class="admin-text-link">View all</NuxtLink></div>
          <ul v-if="orders?.length" class="admin-list">
            <li v-for="order in orders.slice(0, 3)" :key="order.id" class="admin-list-row">
              <div class="admin-list-row__content"><p class="admin-list-row__title">{{ order.buyer_name }}</p><p class="admin-list-row__meta">{{ formatFunds(order.amount) }}</p></div>
              <AdminStatusBadge :status="order.status" />
            </li>
          </ul>
          <AdminEmptyState v-else title="No orders yet" message="New orders will appear here." />
        </AdminPanel>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard-columns {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

@media (min-width: 800px) {
  .dashboard-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
