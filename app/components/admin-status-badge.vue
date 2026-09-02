<script setup lang="ts">
const props = defineProps<{ status?: string | null }>();
const statusClass = computed(() => props.status?.toLowerCase() || "default");
</script>

<template>
  <span class="admin-badge" :class="`admin-badge--${statusClass}`">{{ status || "Unknown" }}</span>
</template>
