<script lang="ts" setup>
defineProps<{
  items: string[];
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "select", value: string): void;
}>();

function selectItem(item: string) {
  emit("select", item);
}
</script>

<template>
  <div class="admin-dialog-backdrop" role="presentation" @click.self="emit('cancel')">
    <section class="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="status-dialog-title">
      <h2 id="status-dialog-title">Change order status</h2>
      <div class="status-options">
        <Button
          v-for="item in items"
          :key="item"
          variant="secondary"
          @click="selectItem(item)"
        >{{ item }}</Button>
      </div>
      <div class="admin-form-actions"><Button variant="ghost" @click="emit('cancel')">Cancel</Button></div>
    </section>
  </div>
</template>

<style scoped>
.status-options { display: grid; gap: 0.6rem; }
</style>
