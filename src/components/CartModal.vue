<template>
  <div v-if="isOpen" class="modal-overlay animate-fade" @click.self="$emit('close')">
    <div class="modal-container animate-slide-up">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-section">
          <h2>Keranjang Belanja</h2>
          <span class="count-badge">{{ totalItems }} Item</span>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Tutup">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-body">
        <!-- Empty State -->
        <div v-if="cart.length === 0" class="empty-cart">
          <span class="empty-emoji">🛒</span>
          <h3>Keranjang Anda Kosong</h3>
          <p>Tambahkan mie ayam atau minuman lezat untuk memulai pesanan Anda.</p>
          <button class="btn btn-primary" @click="$emit('close')">Kembali Pilih Menu</button>
        </div>

        <div v-else class="cart-content-grid">
          <!-- Items List -->
          <div class="items-section">
            <h3 class="section-title">Daftar Pesanan</h3>
            <div class="cart-items">
              <div v-for="item in cart" :key="item.id" class="cart-item">
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
                  
                  <!-- Item Note Input -->
                  <div class="item-note">
                    <input 
                      type="text" 
                      placeholder="Tambah catatan (misal: pedas sedang, tanpa sayur)" 
                      v-model="item.notes"
                      class="note-input"
                    />
                  </div>
                </div>
                
                <div class="item-actions">
                  <div class="qty-adjuster">
                    <button @click="$emit('decrease', item)" class="adjust-btn">-</button>
                    <span class="adjust-qty">{{ item.quantity }}</span>
                    <button @click="$emit('increase', item)" class="adjust-btn">+</button>
                  </div>
                  <button @click="$emit('remove', item)" class="remove-btn" title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="price-summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div v-if="form.fulfillmentType === 'delivery'" class="summary-row">
                <span>Ongkos Kirim (Delivery)</span>
                <span class="success-text">Gratis Ongkir UMKM</span>
              </div>
              <hr class="summary-divider" />
              <div class="summary-row total-row">
                <span>Total Bayar</span>
                <span class="total-price">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>
          </div>

          <!-- Checkout Form -->
          <form @submit.prevent="submitOrder" class="form-section">
            <h3 class="section-title">Detail Pengiriman & Pembayaran</h3>
            
            <div class="form-group">
              <label for="cust-name">Nama Pemesan <span class="required">*</span></label>
              <input 
                id="cust-name" 
                type="text" 
                v-model="form.customerName" 
                required 
                placeholder="Masukkan nama Anda"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="cust-phone">Nomor WhatsApp <span class="required">*</span></label>
              <input 
                id="cust-phone" 
                type="tel" 
                v-model="form.customerPhone" 
                required
                placeholder="Contoh: 08123456789"
                class="form-control"
              />
            </div>

            <!-- Fulfillment Tabs -->
            <div class="form-group">
              <label>Metode Pemesanan <span class="required">*</span></label>
              <div class="tab-group">
                <button 
                  type="button" 
                  class="tab-btn" 
                  :class="{ active: form.fulfillmentType === 'dine_in' }"
                  @click="form.fulfillmentType = 'dine_in'"
                >
                  🍽️ Dine-in
                </button>
                <button 
                  type="button" 
                  class="tab-btn" 
                  :class="{ active: form.fulfillmentType === 'take_away' }"
                  @click="form.fulfillmentType = 'take_away'"
                >
                  🛍️ Take Away
                </button>
                <button 
                  type="button" 
                  class="tab-btn" 
                  :class="{ active: form.fulfillmentType === 'delivery' }"
                  @click="form.fulfillmentType = 'delivery'"
                >
                  🛵 Delivery
                </button>
              </div>
            </div>

            <!-- Fulfillment Details Dynamic -->
            <div class="dynamic-inputs animate-fade">
              <!-- Dine-In -->
              <div v-if="form.fulfillmentType === 'dine_in'" class="form-group">
                <label for="table-num">Pilih Nomor Meja <span class="required">*</span></label>
                <select 
                  id="table-num" 
                  v-model="form.tableNumber" 
                  required 
                  class="form-control"
                >
                  <option value="" disabled selected>Pilih meja Anda</option>
                  <option v-for="table in tables" :key="table" :value="table">
                    Meja {{ table }}
                  </option>
                </select>
              </div>
              <div v-if="form.fulfillmentType === 'dine_in'" class="form-group">
                <label for="estimated-arrival">Estimasi Kedatangan (Jam) <span class="required">*</span></label>
                <input 
                  id="estimated-arrival" 
                  type="time" 
                  v-model="form.estimatedArrival" 
                  required 
                  class="form-control"
                />
              </div>

              <!-- Take Away -->
              <div v-if="form.fulfillmentType === 'take_away'" class="form-group">
                <label for="pickup-time">Perkiraan Waktu Pengambilan <span class="required">*</span></label>
                <input 
                  id="pickup-time" 
                  type="time" 
                  v-model="form.pickupTime" 
                  required 
                  class="form-control"
                />
              </div>

              <!-- Delivery -->
              <div v-if="form.fulfillmentType === 'delivery'" class="form-group">
                <div class="label-gps-row">
                  <label for="del-address">Alamat Pengiriman Lengkap <span class="required">*</span></label>
                  <button 
                    type="button" 
                    @click="getGmapsLocation" 
                    class="btn-gps" 
                    :disabled="gpsLoading"
                  >
                    <span v-if="gpsLoading">⏳ Mencari GPS...</span>
                    <span v-else>📍 Gunakan Lokasi GPS Saya</span>
                  </button>
                </div>
                <textarea 
                  id="del-address" 
                  rows="3" 
                  v-model="form.deliveryAddress" 
                  required 
                  placeholder="Nama jalan, nomor rumah, patokan..."
                  class="form-control"
                ></textarea>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="form-group">
              <label>Metode Pembayaran <span class="required">*</span></label>
              <div class="payment-grid">
                <label class="payment-card" :class="{ selected: form.paymentMethod === 'cash' }">
                  <input type="radio" value="cash" v-model="form.paymentMethod" class="radio-hidden" />
                  <span class="pay-icon">💵</span>
                  <span class="pay-label">Tunai / Kasir</span>
                </label>
                <label class="payment-card" :class="{ selected: form.paymentMethod === 'qris' }">
                  <input type="radio" value="qris" v-model="form.paymentMethod" class="radio-hidden" />
                  <span class="pay-icon">📱</span>
                  <span class="pay-label">QRIS QR Code</span>
                </label>
                <label class="payment-card" :class="{ selected: form.paymentMethod === 'transfer' }">
                  <input type="radio" value="transfer" v-model="form.paymentMethod" class="radio-hidden" />
                  <span class="pay-icon">🏦</span>
                  <span class="pay-label">Transfer Bank</span>
                </label>
              </div>
            </div>

            <!-- Payment Info Details -->
            <div class="payment-details animate-fade" v-if="form.paymentMethod !== 'cash'">
              <!-- QRIS Code -->
              <div v-if="form.paymentMethod === 'qris'" class="payment-instruction qris-section">
                <h4>QRIS Mie Ayam Baso Tuyem</h4>
                <div class="qris-box">
                  <!-- Custom QRIS Image if uploaded by user, else mock SVG fallback -->
                  <img 
                    v-if="!useMockQris" 
                    :src="'/qris.png'" 
                    alt="QRIS Mie Ayam Baso Tuyem" 
                    class="qris-image-file" 
                    @error="handleQrisError"
                  />
                  <!-- Mock QRIS Image -->
                  <div v-else class="mock-qris">
                    <div class="qris-brand">QRIS</div>
                    <div class="qris-qr">
                      <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0h30v30h-30zM10 10h10v10h-10zM70 0h30v30h-30zM80 10h10v10h-10zM0 70h30v30h-30zM10 80h10v10h-10zM40 10h10v20h-10zM50 40h10v10h-10zM70 50h20v10h-20zM30 40h20v10h-20zM60 70h30v10h-30zM70 80h10v20h-10zM40 70h10v10h-10z" />
                      </svg>
                    </div>
                    <div class="qris-footer">NMID: ID-DEMO-ONLY</div>
                  </div>
                </div>
                <p class="instruction-text">Silakan scan kode QRIS di atas melalui M-Banking atau E-Wallet Anda (Gopay, OVO, Dana, LinkAja). Simpan resi pembayaran untuk dikirim via WA.</p>
              </div>

              <!-- Transfer Bank -->
              <div v-if="form.paymentMethod === 'transfer'" class="payment-instruction">
                <h4>Informasi Rekening Bank</h4>
                <div class="bank-details-box">
                  <div class="bank-row">
                    <span class="bank-name">Bank Mandiri</span>
                    <span class="bank-account">137-00-1234567-8</span>
                    <span class="bank-owner">a.n. MIE AYAM BASO TUYEM</span>
                  </div>
                </div>
                <p class="instruction-text">Silakan transfer nominal total pembayaran ke nomor rekening di atas. Simpan bukti transfer untuk dilampirkan via WhatsApp.</p>
              </div>
            </div>

            <!-- Action Submit -->
            <button type="submit" class="btn btn-accent btn-block order-submit-btn">
              <span>Pesan Sekarang via WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getTables } from '../services/supabase';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cart: {
    type: Array,
    required: true
  },
  totalItems: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close', 'increase', 'decrease', 'remove', 'submit']);

const tables = ref([]);
const useMockQris = ref(false);
const gpsLoading = ref(false);

const mockGetTables = () => {
  return JSON.parse(localStorage.getItem('tuyem_tables'));
};

const mockUpdateTableStatus = (tableNum, newStatus) => {
  return true;
};

const handleQrisError = () => {
  useMockQris.value = true;
};

const getGmapsLocation = () => {
  if (!navigator.geolocation) {
    alert("Browser Anda tidak mendukung fitur lokasi GPS.");
    return;
  }
  
  gpsLoading.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const gmapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
      
      if (form.deliveryAddress) {
        form.deliveryAddress = `Lokasi GPS: ${gmapsLink}\nDetail Alamat: ${form.deliveryAddress}`;
      } else {
        form.deliveryAddress = `Lokasi GPS: ${gmapsLink}\nDetail Alamat: `;
      }
      gpsLoading.value = false;
    },
    (error) => {
      console.error(error);
      alert("Gagal mengambil lokasi GPS Anda. Pastikan izin lokasi browser aktif.");
      gpsLoading.value = false;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};
const form = reactive({
  customerName: '',
  customerPhone: '',
  fulfillmentType: 'dine_in', // dine_in, take_away, delivery
  tableNumber: '',
  estimatedArrival: '', // new field for dine-in estimated arrival time
  pickupTime: '',
  deliveryAddress: '',
  paymentMethod: 'cash' // cash, qris, transfer
});

// Load tables
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    try {
      tables.value = await getTables();
    } catch (e) {
      console.error('Failed to load active tables:', e);
    }
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const submitOrder = () => {
  if (!form.customerName || !form.customerPhone) {
    alert('Harap isi nama dan nomor WhatsApp Anda!');
    return;
  }
  if (form.fulfillmentType === 'dine_in') {
    if (!form.tableNumber) {
      alert('Harap pilih nomor meja Anda!');
      return;
    }
    if (!form.estimatedArrival) {
      alert('Harap masukkan estimasi kedatangan Anda!');
      return;
    }
  }
  if (form.fulfillmentType === 'take_away' && !form.pickupTime) {
    alert('Harap masukkan perkiraan waktu pengambilan!');
    return;
  }
  if (form.fulfillmentType === 'delivery' && !form.deliveryAddress) {
    alert('Harap masukkan alamat pengiriman!');
    return;
  }

  // Emit submit event with the order data
  emit('submit', { ...form });
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
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background-color: var(--bg-card);
  width: 95%;
  max-width: 900px;
  height: 90vh;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
}

.modal-header {
  padding: 20px 28px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-section h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
}

.count-badge {
  background-color: var(--primary-light);
  color: var(--primary-hover);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
}

.close-btn {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: var(--transition);
}

.close-btn:hover {
  background-color: #f5f5f4;
  color: var(--text-main);
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 28px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
}

.empty-emoji {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: pulse 2s infinite ease-in-out;
}

.empty-cart h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-cart p {
  color: var(--text-muted);
  max-width: 320px;
  margin-bottom: 24px;
}

.cart-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  height: 100%;
  align-items: start;
}

@media (max-width: 768px) {
  .cart-content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .modal-container {
    height: 95vh;
  }
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 6px;
}

.cart-items {
  max-height: 320px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 8px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f4;
}

.item-info {
  flex-grow: 1;
  padding-right: 16px;
}

.item-name {
  display: block;
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--text-main);
}

.item-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent);
}

.item-note {
  margin-top: 6px;
}

.note-input {
  width: 100%;
  border: none;
  border-bottom: 1px dashed var(--border);
  font-size: 0.8rem;
  padding: 2px 0;
  color: var(--text-muted);
  background: transparent;
}

.note-input:focus {
  border-bottom-color: var(--primary);
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-adjuster {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 2px;
  background-color: #fafaf9;
}

.adjust-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
}

.adjust-btn:hover {
  background-color: var(--border);
}

.adjust-qty {
  padding: 0 8px;
  font-weight: 700;
  font-size: 0.9rem;
}

.remove-btn {
  color: var(--text-muted);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.remove-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.price-summary {
  background-color: #fafaf9;
  border-radius: var(--radius-md);
  padding: 18px;
  border: 1px solid var(--border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.success-text {
  color: var(--success);
  font-weight: 600;
}

.summary-divider {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}

.total-row {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0;
}

.total-price {
  color: var(--accent);
  font-weight: 800;
}

/* Forms */
.form-section {
  background-color: #ffffff;
  padding: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: var(--text-main);
}

.required {
  color: var(--danger);
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.tab-group {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  background-color: #f5f5f4;
  padding: 4px;
  border-radius: var(--radius-md);
}

.tab-btn {
  padding: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--text-muted);
  text-align: center;
}

.tab-btn.active {
  background-color: #ffffff;
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

@media (max-width: 480px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
}

.payment-card {
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

.payment-card:hover {
  border-color: var(--primary-light);
}

.payment-card.selected {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

.radio-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pay-icon {
  font-size: 1.5rem;
}

.pay-label {
  font-size: 0.8rem;
  font-weight: 600;
}

.payment-details {
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 20px;
}

.payment-instruction h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary-hover);
  margin-bottom: 8px;
}

.qris-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qris-box {
  background-color: #ffffff;
  padding: 12px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  margin-bottom: 12px;
}

.mock-qris {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: monospace;
}

.qris-brand {
  font-weight: 800;
  color: #0d1e3d;
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.qris-footer {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.bank-details-box {
  background-color: #ffffff;
  padding: 12px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  width: 100%;
}

.bank-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bank-name {
  font-weight: 700;
  color: var(--text-main);
}

.bank-account {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: 1px;
}

.bank-owner {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.instruction-text {
  font-size: 0.8rem;
  color: #78350f;
  text-align: center;
  line-height: 1.4;
}

.order-submit-btn {
  padding: 14px;
  font-size: 1.05rem;
}

.label-gps-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  width: 100%;
}

.btn-gps {
  background-color: var(--primary-light);
  color: var(--primary-hover);
  border: 1px solid var(--primary);
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-gps:hover:not(:disabled) {
  background-color: var(--primary);
  color: var(--bg-dark);
}

.btn-gps:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qris-image-file {
  width: 180px;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: var(--radius-sm);
}
</style>
