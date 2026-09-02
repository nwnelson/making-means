<script lang="ts" setup>
import type { ArtworkData } from "#types/artworks/artworks";
import type { DropDown } from "#types/dropdown/dropdown";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { startLoading, stopLoading } = useLoading();
const { getArtwork, updateArtwork, removeArtwork } = useArtworks();
const { getArtists } = useArtists();

const route = useRoute();

const artworkId = computed(() => route.params.id as string);

const { data: artwork, pending, error } = await getArtwork(artworkId.value);
const {
  data: artists,
  pending: artistsPending,
  error: artistsError,
} = await getArtists();

const artistItems = computed<DropDown[]>(
  () =>
    artists.value?.map((artist) => ({
      label: artist.name,
      value: artist.id,
    })) ?? [],
);

const artistName = ref("");

function selectArtist(artist: DropDown) {
  editedArtwork.value.artist = artist.value;
  artistName.value = artist.label;
}

useSeoMeta({
  title: () => artwork.value?.title || "Edit Artwork",
  robots: "noindex, nofollow",
});

const editedArtwork = ref<ArtworkData>({
  title: "",
  description: "",
  dimensions: "",
  price: "",
  artist: artwork.value?.artist_id || "",
  artwork_note: "",
});

const image = ref<File | null>(null);

const isEditing = ref(false);

function startEdit() {
  isEditing.value = true;
  editedArtwork.value = {
    title: artwork.value?.title || "",
    description: artwork.value?.description || "",
    dimensions: artwork.value?.dimensions || "",
    price: artwork.value?.price?.toString() || "",
    artist: artwork.value?.artist_id || "",
    artwork_note: artwork.value?.artwork_note || "",
  };
  artistName.value =
    artists.value?.find((artist) => artist.id === artwork.value?.artist_id)
      ?.name || "";
  image.value = null;
}

function stopEdit() {
  isEditing.value = false;
  editedArtwork.value = {
    title: "",
    description: "",
    dimensions: "",
    price: "",
    artist: artwork.value?.artist_id || "",
    artwork_note: "",
  };
  artistName.value = "";
  image.value = null;
}

// To Do: move to useArtworks composable
async function save() {
  console.log("saving!");
  isEditing.value = false;
  const newTitle = editedArtwork.value.title;
  const newDesc = editedArtwork.value.description;
  const newPrice = editedArtwork.value.price;
  const newDimensions = editedArtwork.value.dimensions;
  const newArtist = editedArtwork.value.artist;
  const newNote = editedArtwork.value.artwork_note || "";
  if (!newTitle || !newDesc || !newPrice || !newDimensions || !newArtist) {
    toast.error("Please change at least one field to update the artwork");
    return;
  }

  if (
    newTitle === artwork.value?.title &&
    newDesc === artwork.value?.description &&
    newPrice === artwork.value?.price?.toString() &&
    newDimensions === artwork.value?.dimensions &&
    newArtist === artwork.value?.artist_id &&
    newNote === artwork.value?.artwork_note
  ) {
    toast.error("No changes have been made!");
    return;
  }

  const form = new FormData();
  form.append("id", artworkId.value);
  form.append("title", newTitle);
  form.append("description", newDesc);
  form.append("dimensions", newDimensions);
  form.append("artist", newArtist);
  form.append("artwork_note", newNote);
  form.append("price", newPrice);

  try {
    startLoading();
    await updateArtwork(artworkId.value, form);
    toast.success("Artwork successfully updated!");
    await navigateTo("/admin/artworks");
  } catch (err) {
    console.log("Error updating artwork: " + err);
    toast.error("Something went wrong! Please try again");
  } finally {
    stopLoading();
  }
}

async function deleteArtwork() {
  console.log("deleting artwork!");
  isEditing.value = false;

  try {
    startLoading();
    await removeArtwork(artworkId.value);
    toast.success("Artwork deleted successfully!");
    navigateTo("/admin/artworks");
  } catch (error) {
    console.log("error deleting artwork: " + error);
    toast.error("Something went wrong. Please try again later!");
  } finally {
    stopLoading();
  }
}
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader :title="isEditing ? 'Edit artwork' : (artwork?.title || 'Artwork')" :description="isEditing ? 'Update artwork details and attribution.' : 'Review this artwork and manage its content.'">
      <template #actions><Button variant="ghost" @click="navigateTo('/admin/artworks')">Back to artworks</Button></template>
    </AdminPageHeader>

    <div v-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading artwork…</h2></div></div>
    <AdminEmptyState v-else-if="error" title="Artwork could not be loaded" message="Return to Artworks and try again." />

    <template v-else-if="artwork">
      <div v-if="!isEditing" class="artwork-editor-layout">
        <AdminPanel><NuxtImg :src="artwork.image_path ?? undefined" :alt="artwork.title ?? 'Artwork'" class="artwork-editor-image" /></AdminPanel>
        <AdminPanel>
          <dl class="admin-detail-list">
            <div><dt>Title</dt><dd>{{ artwork.title }}</dd></div>
            <div><dt>Description</dt><dd>{{ artwork.description }}</dd></div>
            <div><dt>Dimensions</dt><dd>{{ artwork.dimensions }}</dd></div>
            <div><dt>Price</dt><dd>${{ artwork.price || 0 }}</dd></div>
            <div v-if="artwork.artwork_note"><dt>Artwork note</dt><dd>{{ artwork.artwork_note }}</dd></div>
          </dl>
          <div class="admin-form-actions artwork-actions">
            <Button @click="startEdit">Edit artwork</Button>
            <Button variant="secondary" @click="navigateTo('/admin/editContent/gallery/' + artwork.id)">Manage gallery</Button>
            <Button variant="danger" @click="deleteArtwork">Delete artwork</Button>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel v-else class="edit-form-panel">
        <form class="admin-form" @submit.prevent="save">
          <div class="admin-field"><label for="edit-artwork-title">Title</label><input id="edit-artwork-title" v-model="editedArtwork.title" type="text" ></div>
          <div class="admin-field"><label for="edit-artwork-description">Description</label><textarea id="edit-artwork-description" v-model="editedArtwork.description" /></div>
          <div class="admin-field"><label for="edit-artwork-price">Price <span class="field-unit">USD</span></label><input id="edit-artwork-price" v-model="editedArtwork.price" type="text" inputmode="decimal" ></div>
          <div class="admin-field"><label for="edit-artwork-dimensions">Dimensions</label><input id="edit-artwork-dimensions" v-model="editedArtwork.dimensions" type="text" ></div>
          <div class="admin-field"><label for="edit-artwork-note">Artwork note <span class="field-unit">Optional</span></label><textarea id="edit-artwork-note" v-model="editedArtwork.artwork_note" /></div>
          <div class="admin-field"><span class="admin-field__label">Artist</span><DropDown label="Choose artist" :items="artistItems" @select="selectArtist" /><p v-if="artistName" class="admin-form-note">Selected: <strong>{{ artistName }}</strong></p><p v-if="artistsError" class="admin-form-note">Artists could not be loaded.</p></div>
          <div class="admin-form-actions"><Button type="submit" :disabled="artistsPending || !!artistsError || !artists?.length">Save changes</Button><Button variant="secondary" type="button" @click="stopEdit">Cancel</Button></div>
        </form>
      </AdminPanel>
    </template>
  </div>
</template>

<style scoped>
.artwork-editor-layout { display: grid; gap: 1.5rem; }
.artwork-editor-image {
  display: block;
  width: 100%;
  max-width: 100%;
  max-height: 70vh;
  height: auto;
  object-fit: contain;
}
.artwork-actions { margin-top: 1.5rem; }
.edit-form-panel { max-width: 46rem; }
.field-unit { color: #68736c; font-weight: 400; letter-spacing: 0; text-transform: none; }
@media (min-width: 900px) { .artwork-editor-layout { grid-template-columns: minmax(0, 1.2fr) minmax(20rem, 0.8fr); align-items: start; } }
</style>
