<script lang="ts" setup>
import type { ArtworkRow } from "~~/types/supabase/tables";
import { getShippingCountryOptions, type ShippingCountryCode } from "@utils/shippingCountries";

type ArtworkDetails = ArtworkRow & {
  artist: { id: string; name: string } | null;
};

definePageMeta({ layout: false });

useSeoMeta({
  title: "Confirm Payment",
  robots: "noindex, nofollow",
});

useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
    },
  ],
});

const route = useRoute();
const {
  data: artwork,
  pending,
  error,
} = await useFetch<ArtworkDetails>(() => `/api/artworks/${route.params.id}`);

const submitting = ref(false);
const verifyingShipping = ref(false);
const checkoutError = ref("");
const shippingError = ref("");
const country = ref<ShippingCountryCode>("US");
const shippingCountries = getShippingCountryOptions();
const shippingQuote = ref<{
  amount: number;
  amountCents: number;
  currency: "usd";
  continent: string;
  quoteToken: string;
} | null>(null);
const canPurchase = computed(() =>
  !!artwork.value && !artwork.value.sold &&
  artwork.value.price !== null && artwork.value.price > 0,
);

const formattedShipping = computed(() => shippingQuote.value
  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(shippingQuote.value.amount)
  : "");
const formattedPrice = computed(() =>
  artwork.value?.price == null
    ? "Price available on request"
    : `${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(artwork.value.price)} USD`,
);

async function payWithStripe() {
  if (!canPurchase.value || !shippingQuote.value || submitting.value) return;

  submitting.value = true;
  checkoutError.value = "";
  try {
    const { url } = await $fetch<{ url: string | null }>(
      "/api/stripe/create-checkout-session",
      {
        method: "POST",
        body: {
          artworkId: artwork.value?.id,
          quoteToken: shippingQuote.value.quoteToken,
        },
      },
    );
    if (!url) throw new Error("Missing checkout URL");
    window.location.assign(url);
  } catch {
    checkoutError.value = "We couldn't open checkout. Please try again.";
    submitting.value = false;
  }
}

async function verifyShipping() {
  if (!artwork.value || !country.value || verifyingShipping.value) return;
  const requestedCountry = country.value;
  verifyingShipping.value = true;
  shippingQuote.value = null;
  shippingError.value = "";
  checkoutError.value = "";
  try {
    const quote = await $fetch<NonNullable<typeof shippingQuote.value>>("/api/shipping/quote", {
      method: "POST",
      body: { artworkId: artwork.value.id, country: requestedCountry },
    });
    if (country.value === requestedCountry) shippingQuote.value = quote;
  } catch (error) {
    const requestError = error as { data?: { statusMessage?: string }; statusMessage?: string };
    shippingError.value = requestError.data?.statusMessage || requestError.statusMessage ||
      "Shipping is not configured for this country.";
  } finally {
    verifyingShipping.value = false;
  }
}

watch(country, () => {
  shippingQuote.value = null;
  shippingError.value = "";
  checkoutError.value = "";
});

</script>

<template>
  <main class="confirmation-page">
    <section class="confirmation-content" aria-labelledby="confirmation-heading">
      <h1 id="confirmation-heading">Confirm Payment</h1>
      <p v-if="pending" role="status">Loading artwork…</p>
      <div v-else-if="error || !artwork" class="confirmation-message">
        <p>Artwork unavailable. Please try again later.</p>
        <NuxtLink to="/artworks/available" class="back-link">Browse artworks</NuxtLink>
      </div>
      <template v-else>
        <p class="introduction">Review your artwork before continuing to checkout.</p>
        <div class="purchase-layout">
          <div class="artwork-preview">
            <NuxtImg
              v-if="artwork.image_path"
              :src="artwork.image_path"
              :alt="artwork.title || 'Artwork'"
              format="webp"
              quality="80"
              sizes="(max-width: 700px) 80vw, 400px"
            />
            <span v-else>Image unavailable</span>
          </div>
          <div class="purchase-summary">
            <p v-if="artwork.artist" class="artist-name">{{ artwork.artist.name }}</p>
            <h2>{{ artwork.title }}</h2>
            <p v-if="artwork.dimensions">{{ artwork.dimensions }}</p>
            <p v-if="artwork.location">Location: {{ artwork.location }}</p>
            <div class="price-row">
              <span>Artwork subtotal</span>
              <strong>{{ formattedPrice }}</strong>
            </div>
            <p v-if="!canPurchase" class="availability" role="status">
              {{ artwork.sold ? 'This artwork has been sold.' : 'This artwork is not available for purchase.' }}
            </p>
            <div v-if="canPurchase" class="shipping-estimate">
              <label class="shipping-field" for="shipping-country">
                Select your country
                <select id="shipping-country" v-model="country" autocomplete="country">
                  <option v-for="option in shippingCountries" :key="option.code" :value="option.code">
                    {{ option.name }}
                  </option>
                </select>
              </label>
              <button
                type="button"
                class="shipping-rate-button"
                :disabled="verifyingShipping || !country"
                :aria-busy="verifyingShipping"
                @click="verifyShipping"
              >
                {{ verifyingShipping ? 'Calculating…' : 'Calculate shipping' }}
              </button>
              <p v-if="shippingQuote" class="shipping-rate" role="status">
                Shipping to {{ shippingQuote.continent.replaceAll('_', ' ') }}:
                <strong>{{ formattedShipping }}</strong>
              </p>
              <p v-if="shippingError" class="checkout-error" role="alert">{{ shippingError }}</p>
            </div>
            <button
              v-if="canPurchase"
              type="button"
              class="confirm-button"
              :disabled="submitting || !country || !shippingQuote"
              :aria-busy="submitting"
              @click="payWithStripe"
            >
              {{ submitting ? 'Opening checkout…' : 'Confirm & Continue' }}
            </button>
            <p v-if="checkoutError" class="checkout-error" role="alert">{{ checkoutError }}</p>
            <p v-if="canPurchase" class="checkout-note">Complete your payment securely with Stripe.</p>
            <NuxtLink :to="`/artworks/${artwork.id}`" class="back-link">Back to artwork</NuxtLink>
          </div>
        </div>
      </template>
    </section>
    <EntryContactStrip />
  </main>
</template>

<style scoped>
.confirmation-page {
  display: flex;
  min-height: calc(100dvh - 7rem);
  flex-direction: column;
  background: var(--mm-green);
  color: var(--mm-white);
  font-family: Lato, Arial, sans-serif;
}

.confirmation-content {
  flex: 1;
  width: min(100%, 76rem);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem);
}

.confirmation-content h1 {
  margin: 0;
  color: var(--mm-gold);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
}

.introduction {
  margin: 1rem 0 3rem;
  text-align: center;
}

.purchase-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.artwork-preview {
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: var(--mm-white);
  color: var(--mm-green);
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 20%);
}

.artwork-preview img {
  display: block;
  width: 100%;
  max-height: 26rem;
  object-fit: contain;
}

.purchase-summary { min-width: 0; }
.purchase-summary p { margin: 0.5rem 0; }
.purchase-summary h2 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.artist-name { color: var(--mm-gold); }
.price-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--mm-gold);
}
.checkout-note { font-size: 0.9rem; }
.shipping-estimate { margin-top: 1.5rem; }
.shipping-estimate h3 { margin: 0 0 0.75rem; font-size: 1.1rem; }
.shipping-field { display: grid; gap: 0.35rem; font-size: 0.9rem; }
.shipping-field select, .shipping-field input { width: 100%; min-width: 0; min-height: 2.75rem; padding: 0.55rem 0.7rem; border: 1px solid #c9d0ca; border-radius: 0.3rem; background: var(--mm-white); color: #17261f; font: inherit; }
.shipping-rate { color: var(--mm-gold); text-transform: capitalize; }
.shipping-rate-button { width: 100%; min-height: 2.75rem; border: 1px solid var(--mm-gold); border-radius: 0.3rem; background: transparent; color: var(--mm-white); font: inherit; font-weight: 700; cursor: pointer; }
.shipping-rate-button:disabled { opacity: 0.6; cursor: wait; }
.confirm-button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border: 0;
  border-radius: 2.5rem;
  background: var(--mm-gold);
  color: var(--mm-green);
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}
.confirm-button:hover:not(:disabled) { filter: brightness(1.08); }
.confirm-button:disabled { opacity: 0.7; cursor: wait; }
.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--mm-gold);
  text-underline-offset: 0.2em;
}
.confirm-button:focus-visible, .back-link:focus-visible, .shipping-rate-button:focus-visible {
  outline: 2px solid var(--mm-white);
  outline-offset: 0.35rem;
}
.checkout-note { text-align: center; }
.checkout-error, .availability { color: var(--mm-gold); }
.confirmation-message { padding: 3rem 0; text-align: center; }

@media (max-width: 1100px) {
  .confirmation-page { min-height: calc(100dvh - 5.5rem); }
}
@media (max-width: 700px) {
  .purchase-layout { grid-template-columns: 1fr; }
  .artwork-preview { width: min(100%, 24rem); margin: 0 auto; }
  .introduction { margin-bottom: 2rem; }
}
</style>
