<script lang="ts" setup>
import type { DropDown } from "#types/dropdown/dropdown";

defineProps<{ label: string; items: DropDown[] }>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const closeOptions = () => {
  if (isOpen.value) isOpen.value = false;
};

const emit = defineEmits<{
  (e: "select", item: DropDown): void;
}>();

const selectItem = (item: DropDown) => {
  console.log("selected item: " + item.value);
  emit("select", item);
  closeOptions();
};
</script>

<template>
  <div class="dropdown">
    <div class="dropdownContainer">
      <Button variant="secondary" type="button" @click.stop="toggle">{{ label }}</Button>
      <div v-show="isOpen" class="dropdownOptions" :class="{ active: isOpen }">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="dropdownItem"
          @click="selectItem(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  cursor: pointer;
  display: inline-block;
}

.dropdownContainer {
  display: inline-block;
  position: relative;
}

.dropdownOptions {
  position: absolute;
  top: 100%;
  margin: 0;
  z-index: 10;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 12rem;
  border: 1px solid rgb(16 33 23 / 30%);
  box-shadow: 0 0.7rem 1.5rem rgb(16 33 23 / 15%);
}

.dropdownItem {
  padding: 0.7rem 0.8rem;
  border: 0;
  border-bottom: 1px solid rgb(16 33 23 / 12%);
  background: var(--mm-white);
  color: var(--mm-green);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.dropdownItem:hover,
.dropdownItem:focus-visible {
  background: rgb(216 195 90 / 20%);
}
</style>
