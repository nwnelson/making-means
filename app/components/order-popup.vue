<script lang="ts" setup>
import type { OrderRow } from "~~/types/supabase/tables";
import { formatFunds } from "#imports";
defineProps<{ order?: OrderRow }>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();
</script>

<template>
  <div class="admin-dialog-backdrop" role="presentation" @click.self="emit('cancel')">
    <section class="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
      <h2 id="order-dialog-title">Order details</h2>
      <dl v-if="order" class="admin-detail-list">
        <div><dt>Buyer</dt><dd>{{ order.buyer_name }}</dd></div>
        <div><dt>Email</dt><dd>{{ order.buyer_email }}</dd></div>
        <div><dt>Shipping address</dt><dd>{{ order.address_line_1 }}<template v-if="order.address_line_2"><br>{{ order.address_line_2 }}</template></dd></div>
        <div><dt>Shipping paid</dt><dd>{{ formatFunds(order.shipping_cost) }}</dd></div>
        <div v-if="order.shipping_address_mismatch"><dt>Shipping check</dt><dd>Buyer’s shipping country differed from the country selected for the rate. Confirm the charge before fulfillment.</dd></div>
      </dl>
      <div class="admin-form-actions"><Button variant="secondary" @click="emit('cancel')">Close</Button></div>
    </section>
  </div>
</template>
