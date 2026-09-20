<script lang="ts" setup>
import type { NewArtworkData } from "#types/artworks/artworks.ts";
import type { DropDown } from "#types/dropdown/dropdown";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Add Artwork",
  robots: "noindex, nofollow",
});

const { addArtwork } = useArtworks();
const { getArtists } = useArtists();

const image = ref<File | null>(null);

const artwork = reactive<NewArtworkData>({
  title: "",
  description: "",
  price: "",
  dimensions: "",
  artist: "",
  artwork_note: "",
});

const artistName = ref<string>("");

// To Do: research which is better - this way or using async data in artworks/id.vue
const {
  data: artists,
  pending: loadingArtists,
  error: artistError,
} = await getArtists();

const artistItems = computed<DropDown[]>(
  () =>
    artists.value?.map((artist) => ({
      label: artist.name,
      value: artist.id,
    })) ?? [],
);

function selectArtist(artist: DropDown) {
  if (!artist) return;
  artwork.artist = artist.value;
  artistName.value = artist.label;
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0] || null;
  image.value = selected;
};

const submit = async () => {
  // To Do: send ArtworkData object instead of fields
  const response = await addArtwork(
    artwork.title,
    artwork.description,
    image.value,
    artwork.dimensions,
    artwork.price,
    artwork.artist,
    artwork.artwork_note || "",
  );

  if (!response.success) {
    toast.error(response.message);
    return;
  }

  toast.success(response.message);
  artwork.title = "";
  artwork.description = "";
  image.value = null;
  artwork.price = "";
  artwork.dimensions = "";
  artwork.artist = "";
  artistName.value = "";
  artwork.artwork_note = "";

  await navigateTo("/admin/artworks");
};
</script>

<template>
  <div class="admin-page admin-page--narrow">
    <AdminPageHeader title="Add artwork" description="Create a new artwork record for the exhibition." />
    <AdminPanel>
    <form class="admin-form" @submit.prevent="submit">
      <div class="admin-field"><label for="artwork-title">Title</label><input id="artwork-title" v-model="artwork.title" type="text" ></div>
      <div class="admin-field"><label for="artwork-description">Description</label><textarea id="artwork-description" v-model="artwork.description" maxlength="5000" /></div>
      <div class="admin-field"><label for="artwork-price">Price <span class="field-unit">USD</span></label><input id="artwork-price" v-model="artwork.price" type="text" inputmode="decimal" ></div>
      <div class="admin-field"><label for="artwork-dimensions">Dimensions</label><input id="artwork-dimensions" v-model="artwork.dimensions" type="text" ><p class="admin-field__help">Include the unit, for example 50 × 70 cm.</p></div>
      <div class="admin-field"><label for="artwork-note">Artwork note <span class="field-unit">Optional</span></label><textarea id="artwork-note" v-model="artwork.artwork_note" /></div>
      <div class="admin-field"><label for="artwork-image">Artwork image</label><input id="artwork-image" name="image" accept="image/*" type="file" @change="onFileChange" ></div>
      <div class="admin-field">
        <span class="admin-field__label">Artist</span>
        <DropDown label="Choose artist" :items="artistItems" @select="selectArtist" />
        <p v-if="artistName" class="selected-artist">Selected: <strong>{{ artistName }}</strong></p>
      </div>
      <p v-if="!loadingArtists && !artistError && artists?.length === 0">
        Add an artist before adding artwork.
      </p>
      <p v-if="artistError">Artists could not be loaded.</p>
      <div class="admin-form-actions"><Button type="submit" :disabled="loadingArtists || !!artistError || !artists?.length">Create artwork</Button><Button variant="secondary" type="button" @click="navigateTo('/admin/artworks')">Cancel</Button></div>
    </form>
    </AdminPanel>
  </div>
</template>

<style scoped>
.field-unit { color: #68736c; font-weight: 400; letter-spacing: 0; text-transform: none; }
.selected-artist { margin: 0; color: #526058; }
</style>
