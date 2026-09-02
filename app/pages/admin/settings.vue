<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  admin: "middleware",
});

useSeoMeta({
  title: "Admin Settings",
  robots: "noindex, nofollow",
});
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Settings" description="Configuration options for the admin area." />
    <AdminEmptyState title="No settings available" message="Settings will appear here when configuration options are added." />
  </div>
</template>
