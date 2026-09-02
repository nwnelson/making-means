<script lang="ts" setup>
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

useSeoMeta({
  title: "Admin Orders",
  robots: "noindex, nofollow",
});

const { getOrders } = useOrders();
const { startLoading, stopLoading } = useLoading();

const { data: orders, pending, error } = await getOrders();

const selectedOrder = ref<string | null>(null);
const showOrderDetails = ref(false);
const showOrderOptions = ref(false);

function changeOrderStatus(id: string) {
  selectedOrder.value = id;
  showOrderOptions.value = true;
}

// TO DO: move to composable
// TO DO: find some better way than manually refreshing page`after status change
async function updateOrderStatus(item: string) {
  if (!item) return;

  try {
    startLoading();
    await $fetch("/api/orders/status", {
      method: "POST",
      body: {
        orderId: selectedOrder.value,
        status: item,
      },
    });
    toast.success("Status changed successfully!");
  } catch (err) {
    console.log("Error from backend: " + err);
    toast.error("Something went wrong!");
  } finally {
    selectedOrder.value = null;
    showOrderOptions.value = false;
    // window.location.reload();
    stopLoading();
    window.location.reload();
  }
}

function cancelStatusChange() {
  selectedOrder.value = null;
  showOrderOptions.value = false;
}

function cancelViewOrder() {
  selectedOrder.value = null;
  showOrderDetails.value = false;
}

function viewOrder(id: string) {
  if (!id) return;
  selectedOrder.value = id;
  showOrderDetails.value = true;
}
</script>

<template>
  <div class="admin-page">
    <PopupOptions
      v-if="showOrderOptions"
      :items="['PAID', 'SHIPPED', 'DELIVERED']"
      @cancel="cancelStatusChange"
      @select="updateOrderStatus"
    />
    <OrderPopup
      v-if="showOrderDetails"
      :order="orders?.find((o) => o.id === selectedOrder)"
      @cancel="cancelViewOrder"
    />
    <AdminPageHeader title="Orders" description="Review purchases, shipping details, and fulfillment status." />
    <AdminEmptyState v-if="error" title="Orders could not be loaded" message="Refresh the page to try again." />
    <div v-else-if="pending" class="admin-empty"><div class="admin-empty__content"><h2>Loading orders…</h2></div></div>
    <AdminEmptyState v-else-if="!orders?.length" title="No orders yet" message="New purchases will appear here." />
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Buyer</th><th>Amount</th><th>Status</th><th>Address</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td data-label="Buyer"><strong>{{ order.buyer_name }}</strong></td>
            <td data-label="Amount">${{ order.amount }}</td>
            <td data-label="Status"><AdminStatusBadge :status="order.status" /></td>
            <td data-label="Address">{{ order.address_line_1 }}</td>
            <td data-label="Created">{{ formatDateShort(order.created_at) ?? "" }}</td>
            <td data-label="Actions"><div class="admin-table__actions"><Button size="sm" @click.stop="changeOrderStatus(order.id)">Change status</Button><Button size="sm" variant="secondary" @click.stop="viewOrder(order.id)">View details</Button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
