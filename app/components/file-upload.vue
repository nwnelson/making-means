<script lang="ts" setup>
import { ref } from "vue";
import Button from "./button.vue";

const emit = defineEmits(["close", "upload"]);

// Each entry represents one file input; `null` means no file selected yet
const fileInputs = ref<(File | null)[]>([null]);

const onFileChange = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  fileInputs.value[index] = file;

  // If user selected a file in the last input, append a new empty input
  if (file && index === fileInputs.value.length - 1) {
    fileInputs.value.push(null);
  }
};

const removeInput = (index: number) => {
  fileInputs.value.splice(index, 1);
  if (fileInputs.value.length === 0) fileInputs.value.push(null);
};

const submit = () => {
  const files = fileInputs.value.filter(Boolean) as File[];
  if (files.length === 0) return;

  // Emit an `upload` event with the selected files; parent can handle upload
  emit("upload", files);
};
</script>

<template>
  <div class="admin-dialog-backdrop" role="presentation" @click.self="emit('close')">
    <section class="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title">
      <h2 id="upload-dialog-title">Upload gallery images</h2>
      <form class="admin-form" @submit.prevent="submit">
        <p class="admin-form-note">Select one or more supporting images.</p>

        <div v-for="(f, i) in fileInputs" :key="i" class="file-row">
          <label class="file-label" :for="`file-upload-${i}`">Image {{ i + 1 }}</label>
          <input
            :id="`file-upload-${i}`"
            type="file"
            accept="image/*"
            @change="(e) => onFileChange(e, i)"
          >

          <span v-if="f" class="filename">{{ f.name }}</span>

          <button
            v-if="fileInputs.length > 1"
            type="button"
            class="remove"
            @click="() => removeInput(i)"
          >
            Remove
          </button>
        </div>

        <div class="admin-form-actions"><Button type="submit">Upload images</Button><Button type="button" variant="secondary" @click="emit('close')">Cancel</Button></div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.file-row {
  display: grid;
  gap: 0.4rem;
  padding: 0.8rem;
  border: 1px solid rgb(16 33 23 / 15%);
}
.file-label { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
.filename {
  font-size: 0.9rem;
  color: #68736c;
}
.remove {
  background: transparent;
  border: none;
  color: #a62525;
  padding: 0;
  text-align: left;
  cursor: pointer;
}
</style>
