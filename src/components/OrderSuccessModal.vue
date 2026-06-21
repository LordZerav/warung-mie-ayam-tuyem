<template>
  <div v-if="isOpen" class="modal-overlay animate-fade" @click.self="$emit('close')">
    <div class="modal-container animate-pop">
      <div class="success-animation">
        <div class="check-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>
      
      <h2>Pesanan Dibuat!</h2>
      <p class="subtitle">Silakan selesaikan konfirmasi di WhatsApp admin kami.</p>
      
      <div class="order-summary-card">
        <div class="summary-item">
          <span class="label">ID Pesanan:</span>
          <span class="value order-id">{{ order.id }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Metode:</span>
          <span class="value capitalize">{{ getFulfillmentLabel(order.fulfillment_type) }}</span>
        </div>
        <div v-if="order.table_number" class="summary-item">
          <span class="label">Meja:</span>
          <span class="value">Meja {{ order.table_number }}</span>
        </div>
        <div v-if="order.pickup_time" class="summary-item">
          <span class="label">Waktu Ambil:</span>
          <span class="value">{{ order.pickup_time }} WIB</span>
        </div>
        <div class="summary-item">
          <span class="label">Total Pembayaran:</span>
          <span class="value total">{{ formatPrice(order.total_price) }}</span>
        </div>
      </div>

      <div class="action-box">
        <p class="notice">Apabila WhatsApp tidak terbuka secara otomatis, klik tombol di bawah ini untuk mengirim pesanan secara manual.</p>
        <a :href="whatsappUrl" target="_blank" class="btn btn-accent btn-block wa-redirect-btn">
          <span>Kirim WhatsApp Sekarang</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>
        <button @click="$emit('close')" class="btn btn-outline btn-block done-btn">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    required: true
  },
  whatsappUrl: {
    type: String,
    required: true
  }
});

defineEmits(['close']);

const formatPrice = (price) => {
  if (!price) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const getFulfillmentLabel = (type) => {
  switch (type) {
    case 'dine_in': return 'Makan di Tempat';
    case 'take_away': return 'Ambil Sendiri';
    case 'delivery': return 'Delivery / Antar';
    default: return type;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(28, 25, 23, 0.6);
  backdrop-filter: blur(4px);
  z-index: 110;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background-color: var(--bg-card);
  width: 90%;
  max-width: 450px;
  padding: 32px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
}

.success-animation {
  width: 80px;
  height: 80px;
  background-color: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--primary-hover);
}

.check-icon {
  animation: pulse 1.5s infinite;
}

h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 6px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.order-summary-card {
  width: 100%;
  background-color: #fafaf9;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.label {
  color: var(--text-muted);
}

.value {
  font-weight: 600;
  color: var(--text-main);
}

.value.order-id {
  font-family: monospace;
  font-size: 1.05rem;
  color: var(--primary-hover);
  background-color: var(--primary-light);
  padding: 2px 6px;
  border-radius: 4px;
}

.value.total {
  color: var(--accent);
  font-weight: 800;
}

.capitalize {
  text-transform: capitalize;
}

.action-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 8px;
}

.wa-redirect-btn {
  background-color: #25d366; /* Official WA Green */
  color: #ffffff;
  border-color: #25d366;
}

.wa-redirect-btn:hover {
  background-color: #128c7e;
  border-color: #128c7e;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
}

.done-btn {
  padding: 12px;
}
</style>
