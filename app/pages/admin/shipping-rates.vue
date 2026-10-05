<script lang="ts" setup>
import { toast } from "vue-sonner";
import { SHIPPING_CONTINENTS, type ShippingContinent } from "@utils/countryContinents";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({ title: "Shipping Rates", robots: "noindex, nofollow" });

const { getArtworks } = useArtworks();
const { data: artworks, pending: loadingArtworks, error: artworksError } = await getArtworks();

const selectedArtworkId = ref("");
const loadingRates = ref(false);
const saving = ref(false);
const ratesError = ref("");
const rateInputs = reactive<Record<ShippingContinent, string>>({
  africa: "",
  asia: "",
  europe: "",
  north_america: "",
  oceania: "",
  south_america: "",
});

function clearRates() {
  for (const continent of SHIPPING_CONTINENTS) rateInputs[continent.code] = "";
}

watch(artworks, (items) => {
  const firstArtwork = items?.[0];
  if (!selectedArtworkId.value && firstArtwork) selectedArtworkId.value = firstArtwork.id;
}, { immediate: true });

watch(selectedArtworkId, async (artworkId) => {
  clearRates();
  ratesError.value = "";
  if (!artworkId) return;

  loadingRates.value = true;
  try {
    const rows = await $fetch<Array<{ continent: ShippingContinent; amount_cents: number | null }>>(
      `/api/admin/shipping-rates/${artworkId}`,
    );
    if (selectedArtworkId.value !== artworkId) return;
    for (const row of rows) {
      rateInputs[row.continent] = row.amount_cents == null ? "" : (row.amount_cents / 100).toFixed(2);
    }
  } catch (error) {
    const requestError = error as { data?: { statusMessage?: string }; statusMessage?: string };
    ratesError.value = requestError.data?.statusMessage || requestError.statusMessage || "Rates could not be loaded.";
  } finally {
    loadingRates.value = false;
  }
});

function dollarsToCents(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error("Use an amount with up to two decimal places.");
  return Math.round(Number(normalized) * 100);
}

async function saveRates() {
  if (!selectedArtworkId.value || saving.value || loadingRates.value) return;
  saving.value = true;
  ratesError.value = "";
  try {
    await $fetch(`/api/admin/shipping-rates/${selectedArtworkId.value}`, {
      method: "PUT",
      body: {
        rates: SHIPPING_CONTINENTS.map(({ code }) => ({
          continent: code,
          amountCents: dollarsToCents(rateInputs[code]),
        })),
      },
    });
    toast.success("Shipping rates saved.");
  } catch (error) {
    const requestError = error as { data?: { statusMessage?: string }; statusMessage?: string; message?: string };
    const message = requestError.data?.statusMessage || requestError.statusMessage || requestError.message;
    ratesError.value = message || "Shipping rates could not be saved.";
    toast.error(ratesError.value);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="Shipping rates" description="Set a shipping price for each artwork and destination continent." />
    <AdminEmptyState v-if="artworksError" title="Artworks could not be loaded" message="Refresh the page and try again." />
    <AdminEmptyState v-else-if="!loadingArtworks && !artworks?.length" title="No artworks yet" message="Add an artwork before configuring shipping rates." />
    <AdminPanel v-else>
      <div class="admin-form">
        <div class="admin-field">
          <label for="shipping-rate-artwork">Artwork</label>
          <select id="shipping-rate-artwork" v-model="selectedArtworkId" :disabled="loadingArtworks || !artworks?.length">
            <option value="" disabled>Select an artwork</option>
            <option v-for="artwork in artworks" :key="artwork.id" :value="artwork.id">
              {{ artwork.title || 'Untitled artwork' }}
            </option>
          </select>
        </div>

        <div v-if="loadingRates" class="admin-empty"><div class="admin-empty__content"><h2>Loading rates…</h2></div></div>
        <div v-else-if="selectedArtworkId" class="rate-list">
          <p class="admin-form-note">Leave a rate blank if shipping to that continent is unavailable. Amounts are in USD.</p>
          <div v-for="continent in SHIPPING_CONTINENTS" :key="continent.code" class="admin-field rate-field">
            <label :for="`shipping-rate-${continent.code}`">{{ continent.label }}</label>
            <div class="rate-input">
              <span aria-hidden="true">$</span>
              <input
                :id="`shipping-rate-${continent.code}`"
                v-model="rateInputs[continent.code]"
                type="text"
                inputmode="decimal"
                placeholder="Not set"
                :aria-label="`${continent.label} shipping rate in US dollars`"
              >
            </div>
          </div>
          <p v-if="ratesError" class="admin-form-note admin-form-note--error" role="alert">{{ ratesError }}</p>
          <div class="admin-form-actions">
            <Button :disabled="saving || loadingRates" @click="saveRates">{{ saving ? 'Saving…' : 'Save rates' }}</Button>
          </div>
        </div>
      </div>
    </AdminPanel>
  </div>
</template>

<style scoped>
.rate-list { display: grid; gap: 0.25rem; }
.rate-field { display: grid; grid-template-columns: minmax(10rem, 1fr) minmax(12rem, 0.7fr); align-items: center; gap: 1rem; }
.rate-input { position: relative; }
.rate-input span { position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: #68736c; }
.rate-input input { padding-left: 1.7rem; }
.admin-form-note--error { color: #9a2f24; }
@media (max-width: 560px) { .rate-field { grid-template-columns: 1fr; gap: 0.35rem; } }
</style>
