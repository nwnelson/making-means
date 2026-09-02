<script setup lang="ts">
defineProps<{
  title: string;
  message?: string;
}>();
</script>

<template>
  <div class="admin-empty">
    <div class="admin-empty__content">
      <h2>{{ title }}</h2>
      <p v-if="message">{{ message }}</p>
      <div v-if="$slots.default" class="admin-card__actions">
        <slot />
      </div>
    </div>
  </div>
</template>

