<template>
  <div class="admin-dashboard">
    <!-- Toast Notification -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-logo">
        <span class="logo-emoji">🍜</span>
        <div class="brand">
          <h1>Tuyem Dashboard</h1>
          <span class="sub">Admin Control Panel</span>
        </div>
      </div>
      <div class="topbar-actions">
        <span class="admin-email">{{ adminSession?.email || 'Admin' }}</span>
        <button @click="handleLogout" class="btn-logout" title="Keluar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    </header>

    <!-- Main Content Layout -->
    <div class="dashboard-layout">
      <!-- Sidebar / Navigation -->
      <nav class="sidebar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="nav-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          <span class="nav-label">{{ tab.name }}</span>
          <span v-if="tab.id === 'orders' && pendingOrdersCount > 0" class="badge-count animate-pulse">
            {{ pendingOrdersCount }}
          </span>
        </button>
        <router-link to="/" class="nav-item view-site">
          <span class="nav-icon">🌐</span>
          <span class="nav-label">Lihat Website</span>
        </router-link>
      </nav>

      <!-- Panel Area -->
      <main class="panel-area animate-fade">
        
        <!-- ================= ORDERS TAB ================= -->
        <div v-if="activeTab === 'orders'" class="tab-panel">
          <div class="panel-header">
            <h2>Manajemen Pesanan</h2>
            <div class="order-status-filters">
              <button 
                v-for="filter in orderFilters" 
                :key="filter.value"
                class="filter-pill"
                :class="{ active: orderFilter === filter.value }"
                @click="orderFilter = filter.value"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div v-if="filteredOrders.length === 0" class="empty-panel">
            <span class="empty-emoji">📝</span>
            <h3>Belum Ada Pesanan</h3>
            <p>Daftar pesanan dari pelanggan akan muncul secara real-time di sini.</p>
          </div>

          <div v-else class="orders-grid">
            <div 
              v-for="order in filteredOrders" 
              :key="order.id" 
              class="order-card"
              :class="`status-${order.status}`"
            >
              <div class="order-card-header">
                <span class="order-id">#{{ order.id }}</span>
                <span class="order-time">{{ formatTime(order.created_at) }}</span>
                <span class="status-badge" :class="order.status">{{ getStatusLabel(order.status) }}</span>
              </div>

              <div class="order-card-body">
                <div class="cust-info">
                  <strong>{{ order.customer_name }}</strong>
                  <span class="phone-link" v-if="order.customer_phone">
                    📱 <a :href="`https://wa.me/${order.customer_phone}`" target="_blank">{{ order.customer_phone }}</a>
                  </span>
                </div>

                <div class="fulfillment-details-box">
                  <div v-if="order.fulfillment_type === 'dine_in'" class="detail-line">
                    <span class="label">Makan di Tempat</span>
                    <span class="value badge-table">Meja {{ order.table_number }} (Jam {{ order.pickup_time || order.estimated_arrival || '-' }})</span>
                  </div>
                  <div v-else-if="order.fulfillment_type === 'take_away'" class="detail-line">
                    <span class="label">Ambil Sendiri</span>
                    <span class="value">Jam: {{ order.pickup_time }} WIB</span>
                  </div>
                  <div v-else-if="order.fulfillment_type === 'delivery'" class="detail-line">
                    <span class="label">Alamat Antar:</span>
                    <p class="address-text">{{ order.delivery_address }}</p>
                  </div>
                </div>

                <div class="payment-method-line">
                  <span>Pembayaran:</span>
                  <strong class="uppercase">{{ order.payment_method }}</strong>
                </div>

                <!-- Ordered Items List -->
                <div class="items-list">
                  <div v-for="item in order.items" :key="item.id" class="order-item-row">
                    <div class="item-name-qty">
                      <span class="qty">{{ item.quantity }}x</span>
                      <span class="name">{{ item.name || item.menu_item_name }}</span>
                    </div>
                    <span class="price">{{ formatPrice(item.price * item.quantity) }}</span>
                    <div v-if="item.notes" class="item-notes">
                      <em>Catatan: {{ item.notes }}</em>
                    </div>
                  </div>
                </div>

                <div class="order-total-row">
                  <span>Total Tagihan:</span>
                  <span class="total-amount">{{ formatPrice(order.total_price) }}</span>
                </div>
              </div>

              <!-- Quick Status Actions -->
                <div class="order-card-footer">
                  <button 
                    v-if="order.status === 'pending'"
                    @click="updateStatus(order.id, 'completed')" 
                    class="action-btn btn-complete"
                  >
                    Proses Pesanan
                  </button>
                  <button 
                    v-if="order.status !== 'completed' && order.status !== 'cancelled'"
                    @click="updateStatus(order.id, 'cancelled')" 
                    class="action-btn btn-cancel"
                  >
                    Batalkan
                  </button>
                </div>
            </div>
          </div>
        </div>

        <!-- ================= MENU TAB ================= -->
        <div v-if="activeTab === 'menu'" class="tab-panel">
          <div class="panel-header flex-header">
            <h2>Daftar Menu Mie Ayam & Minuman</h2>
            <button @click="openMenuForm()" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Tambah Menu Baru
            </button>
          </div>

          <!-- Menu Loading -->
          <div v-if="menuLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Memuat daftar menu...</p>
          </div>

          <!-- Menu Form Modal overlay (only shown when menuLoading is false) -->
          <div v-if="showMenuForm" class="modal-overlay" @click.self="showMenuForm = false">
            <div class="modal-form-container animate-pop">
              <h3>{{ menuFormData.id ? 'Edit Menu' : 'Tambah Menu Baru' }}</h3>
              <form @submit.prevent="submitMenuForm">
                <div class="form-group">
                  <label for="m-name">Nama Menu *</label>
                  <input id="m-name" type="text" v-model="menuFormData.name" required class="form-control" />
                </div>
                <div class="form-group">
                  <label for="m-category">Kategori *</label>
                  <select id="m-category" v-model="menuFormData.category" required class="form-control">
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                    <option value="ekstra">Ekstra Toping</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="m-price">Harga (Rp) *</label>
                  <input id="m-price" type="number" v-model.number="menuFormData.price" required class="form-control" />
                </div>
                <div class="form-group">
                  <label for="m-desc">Deskripsi</label>
                  <textarea id="m-desc" rows="3" v-model="menuFormData.description" class="form-control"></textarea>
                </div>
                <div class="form-group">
                  <label>Gambar Menu</label>
                  <div class="image-upload-wrapper">
                    <!-- Image Preview -->
                    <div v-if="menuFormData.image_url" class="form-image-preview">
                      <img :src="menuFormData.image_url" alt="Preview" class="preview-img" />
                      <button type="button" @click="clearFormImage" class="remove-preview-btn" title="Hapus Gambar">❌</button>
                    </div>
                    <!-- Upload Input -->
                    <div v-else class="upload-dropzone" :class="{ uploading: imageUploading }">
                      <input 
                        type="file" 
                        id="m-image-file" 
                        accept="image/*" 
                        @change="handleImageUpload" 
                        class="file-input-hidden"
                        :disabled="imageUploading"
                      />
                      <label for="m-image-file" class="dropzone-label">
                        <span class="upload-icon">{{ imageUploading ? '⏳' : '📸' }}</span>
                        <span class="upload-text">{{ imageUploading ? 'Mengupload...' : 'Pilih Foto Menu' }}</span>
                        <span class="upload-sub">Format: PNG, JPG, WEBP (Maks. 2MB)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Status Ketersediaan</label>
                  <select v-model="menuFormData.status" class="form-control">
                    <option value="tersedia">Tersedia</option>
                    <option value="habis">Habis (Kosong)</option>
                  </select>
                </div>
                <div class="form-actions-row">
                  <button type="button" @click="showMenuForm = false" class="btn btn-outline">Batal</button>
                  <button type="submit" class="btn btn-primary" :disabled="imageUploading">
                    {{ menuSaving ? 'Menyimpan...' : 'Simpan' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Menu Table -->
          <div v-if="!menuLoading" class="table-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Nama Menu</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="menu in menuItems" :key="menu.id">
                  <td class="td-img">
                    <img v-if="menu.image_url" :src="menu.image_url" :alt="menu.name" class="table-thumb" />
                    <span v-else class="table-emoji-thumb">🍜</span>
                  </td>
                  <td>
                    <div class="table-menu-info">
                      <strong>{{ menu.name }}</strong>
                      <p class="desc-preview">{{ menu.description }}</p>
                    </div>
                  </td>
                  <td class="capitalize">{{ menu.category }}</td>
                  <td class="font-bold text-accent">{{ formatPrice(menu.price) }}</td>
                  <td>
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        :checked="menu.status === 'tersedia'"
                        @change="toggleMenuStock(menu)"
                      />
                      <span class="slider"></span>
                    </label>
                    <span class="stock-lbl" :class="menu.status">
                      {{ menu.status === 'tersedia' ? 'Tersedia' : 'Habis' }}
                    </span>
                  </td>
                  <td class="table-actions">
                    <button @click="openMenuForm(menu)" class="edit-icon-btn" title="Edit">
                      ✏️
                    </button>
                    <button @click="deleteMenu(menu.id)" class="delete-icon-btn" title="Hapus">
                      ❌
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= TABLES TAB ================= -->
        <div v-if="activeTab === 'tables'" class="tab-panel">
          <div class="panel-header">
            <h2>Kelola Nomor Meja</h2>
            <p class="desc">Mengatur nomor meja makan aktif yang dapat dipilih pelanggan untuk makan di tempat.</p>
          </div>

          <div class="tables-manager-layout">
            <!-- Add Table Form -->
            <div class="add-table-card">
              <h3>Tambah Nomor Meja</h3>
              <form @submit.prevent="submitTableForm" class="inline-form">
                <input 
                  type="text" 
                  v-model="newTableNumber" 
                  required 
                  placeholder="Nomor meja (contoh: 11)" 
                  class="form-control"
                />
                <button type="submit" class="btn btn-primary">Tambah Meja</button>
              </form>
            </div>

            <!-- Tables List Grid -->
            <div class="tables-grid">
              <div v-for="table in tables" :key="table" class="table-item-card animate-pop">
                <div class="table-num-badge">Meja {{ table }}</div>
                <button @click="removeTable(table)" class="table-delete-btn" title="Hapus Meja">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getMenuItems, saveMenuItem, deleteMenuItem, 
  getTables, saveTable, deleteTable, 
  updateOrderStatus, subscribeOrders,
  uploadMenuImage
} from '../services/supabase';
import { logoutAdmin, onAdminStateChanged } from '../services/firebase';

const router = useRouter();

// Authentication State
const adminSession = ref(null);

// Dashboard State
const activeTab = ref('orders');
const loading = ref(true);
const menuLoading = ref(true);

// Toast notification
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimer = null;
const showToast = (message, type = 'success') => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { show: true, message, type };
  toastTimer = setTimeout(() => { toast.value.show = false; }, 3000);
};

// Image upload state
const imageUploading = ref(false);
const menuSaving = ref(false);

const tabs = [
  { id: 'orders', name: 'Pesanan', icon: '📝' },
  { id: 'menu', name: 'Kelola Menu', icon: '🍔' },
  { id: 'tables', name: 'Kelola Meja', icon: '🪑' }
];

// Orders Tab State
const orders = ref([]);
const orderFilter = ref('active');
const orderFilters = [
  { label: 'Aktif (Baru/Proses/Siap)', value: 'active' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
  { label: 'Semua', value: 'all' }
];

// Menu Tab State
const menuItems = ref([]);
const showMenuForm = ref(false);
const menuFormData = ref({
  id: null,
  name: '',
  category: 'makanan',
  price: 0,
  description: '',
  image_url: '',
  status: 'tersedia'
});

// Tables Tab State
const tables = ref([]);
const newTableNumber = ref('');

// Subscription cleanup
let unsubscribeOrdersRef = null;
let unsubscribeAuthRef = null;

// Initial Fetching
onMounted(() => {
  // Check admin session
  unsubscribeAuthRef = onAdminStateChanged((session) => {
    adminSession.value = session;
    if (!session) {
      router.push({ name: 'AdminLogin' });
    }
  });

  // Load menu items
  loadMenuData();
  
  // Load tables
  loadTableData();

  // Realtime subscribe to orders
  unsubscribeOrdersRef = subscribeOrders((data) => {
    orders.value = data;
    loading.value = false;
  });
});

// Cleanup on navigate away
onUnmounted(() => {
  if (unsubscribeOrdersRef) unsubscribeOrdersRef.unsubscribe();
  if (typeof unsubscribeAuthRef === 'function') unsubscribeAuthRef();
  if (toastTimer) clearTimeout(toastTimer);
});

// Load Helpers
const loadMenuData = async () => {
  menuLoading.value = true;
  try {
    menuItems.value = await getMenuItems();
  } catch (e) {
    console.error('Error fetching menu:', e);
    showToast('Gagal memuat daftar menu.', 'error');
  } finally {
    menuLoading.value = false;
  }
};

const loadTableData = async () => {
  try {
    tables.value = await getTables();
  } catch (e) {
    console.error('Error fetching tables:', e);
  }
};

// Computeds
const pendingOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'pending').length;
});

const filteredOrders = computed(() => {
  const oList = orders.value;
  if (orderFilter.value === 'all') return oList;
  if (orderFilter.value === 'active') {
    return oList.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'ready');
  }
  return oList.filter(o => o.status === orderFilter.value);
});

// Formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Baru';
    case 'processing': return 'Diproses';
    case 'ready': return 'Siap Disajikan';
    case 'completed': return 'Selesai';
    case 'cancelled': return 'Batal';
    default: return status;
  }
};

// Order status update function
const updateStatus = async (orderId, newStatus) => {
  try {
    const updated = await updateOrderStatus(orderId, newStatus);
    // Optimistically update local orders array
    const idx = orders.value.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      // Directly set status to newStatus to ensure UI updates
      orders.value[idx].status = newStatus;
      // Merge any other returned fields if present
      orders.value[idx] = { ...orders.value[idx], ...updated };
    }
    showToast('Status pesanan berhasil diperbarui.', 'success');
  } catch (e) {
    console.error('Failed to update order status:', e);
    showToast('Gagal memperbarui status pesanan.', 'error');
  }
};

// Order Actions


// Menu Actions
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran gambar melebihi batas maksimum 2MB!', 'error');
    event.target.value = '';
    return;
  }

  // Try Supabase Storage upload first
  imageUploading.value = true;
  try {
    const publicUrl = await uploadMenuImage(file);
    menuFormData.value.image_url = publicUrl;
  } catch (err) {
    // Fallback: use local base64 preview (works for mock mode)
    console.warn('Storage upload failed, using local preview:', err);
    const reader = new FileReader();
    reader.onload = (e) => {
      menuFormData.value.image_url = e.target.result;
    };
    reader.readAsDataURL(file);
  } finally {
    imageUploading.value = false;
  }
};

const clearFormImage = () => {
  menuFormData.value.image_url = '';
};

const openMenuForm = (menuItem = null) => {
  if (menuItem) {
    menuFormData.value = { ...menuItem };
  } else {
    menuFormData.value = {
      id: null,
      name: '',
      category: 'makanan',
      price: 0,
      description: '',
      image_url: '',
      status: 'tersedia'
    };
  }
  showMenuForm.value = true;
};

const submitMenuForm = async () => {
  menuSaving.value = true;
  try {
    await saveMenuItem(menuFormData.value);
    showMenuForm.value = false;
    showToast(menuFormData.value.id ? 'Menu berhasil diperbarui.' : 'Menu baru berhasil ditambahkan.');
    loadMenuData();
  } catch (e) {
    console.error(e);
    showToast('Gagal menyimpan menu. Periksa kembali input Anda.', 'error');
  } finally {
    menuSaving.value = false;
  }
};

const toggleMenuStock = async (menuItem) => {
  const updatedItem = {
    ...menuItem,
    status: menuItem.status === 'tersedia' ? 'habis' : 'tersedia'
  };
  try {
    await saveMenuItem(updatedItem);
    loadMenuData();
  } catch (e) {
    console.error(e);
  }
};

const deleteMenu = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus menu ini secara permanen?')) {
    try {
      await deleteMenuItem(id);
      showToast('Menu berhasil dihapus.');
      loadMenuData();
    } catch (e) {
      showToast('Gagal menghapus menu.', 'error');
    }
  }
};

// Table Actions
const submitTableForm = async () => {
  const val = newTableNumber.value.trim();
  if (!val) return;
  try {
    await saveTable(val);
    newTableNumber.value = '';
    showToast(`Meja ${val} berhasil ditambahkan.`);
    loadTableData();
  } catch (e) {
    showToast('Gagal menyimpan nomor meja.', 'error');
  }
};

const removeTable = async (tableNum) => {
  if (confirm(`Hapus Meja ${tableNum}?`)) {
    try {
      await deleteTable(tableNum);
      showToast(`Meja ${tableNum} berhasil dihapus.`);
      loadTableData();
    } catch (e) {
      showToast('Gagal menghapus meja.', 'error');
    }
  }
};

// Auth Actions
const handleLogout = async () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    if (unsubscribeOrdersRef) { unsubscribeOrdersRef.unsubscribe(); unsubscribeOrdersRef = null; }
    if (typeof unsubscribeAuthRef === 'function') { unsubscribeAuthRef(); unsubscribeAuthRef = null; }
    await logoutAdmin();
    router.push({ name: 'AdminLogin' });
  }
};
</script>

<style scoped>
/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  min-width: 280px;
  max-width: 400px;
}
.toast-notification.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}
.toast-notification.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* Loading States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px;
  color: var(--text-muted);
  font-size: 1rem;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.admin-dashboard {
  min-height: 100vh;
  background-color: #f5f5f4;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  font-size: 1rem;
}

/* Topbar */
.topbar {
  background-color: var(--bg-dark);
  color: var(--text-light);
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--primary);
  position: sticky;
  top: 0;
  z-index: 80;
}

.topbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-logo h1 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--primary);
}

.topbar-logo .sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-email {
  font-size: 0.9rem;
  font-weight: 600;
  color: #a8a29e;
}

.btn-logout {
  color: var(--text-muted);
  padding: 8px;
  border-radius: var(--radius-sm);
  display: flex;
}

.btn-logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* Dashboard Layout */
.dashboard-layout {
  display: flex;
  flex-grow: 1;
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: var(--bg-dark-card);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 12px;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  color: #a8a29e;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  position: relative;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-light);
}

.nav-item.active {
  background-color: var(--primary);
  color: var(--bg-dark);
}

.view-site {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 18px;
}

@media (max-width: 768px) {
  .view-site {
    margin-top: 0;
    border-top: none;
    padding-top: 14px;
  }
}

.badge-count {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--accent);
  color: var(--text-light);
  font-size: 0.75rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

/* Panel Area */
.panel-area {
  flex-grow: 1;
  padding: 32px;
  overflow-y: auto;
}

@media (max-width: 576px) {
  .panel-area {
    padding: 16px;
  }
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-header {
  border-bottom: 2px solid var(--border);
  padding-bottom: 16px;
}

.panel-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
}

.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-status-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.filter-pill {
  border: 1px solid var(--border);
  background-color: #ffffff;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: var(--transition);
}
.filter-pill:hover {
  background-color: var(--border);
}

.filter-pill.active {
  background-color: var(--bg-dark);
  color: var(--text-light);
  border-color: var(--bg-dark);
}

.empty-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.empty-panel h3 {
  font-weight: 700;
  margin-bottom: 4px;
}

.empty-panel p {
  color: var(--text-muted);
}

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.order-card {
  background-color: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.order-card:hover {
  box-shadow: var(--shadow-md);
}

.order-card.status-pending {
  border-top: 4px solid var(--warning);
}

.order-card.status-processing {
  border-top: 4px solid var(--info);
}

.order-card.status-ready {
  border-top: 4px solid var(--success);
}

.order-card.status-completed {
  border-top: 4px solid var(--text-muted);
  opacity: 0.8;
}

.order-card.status-cancelled {
  border-top: 4px solid var(--danger);
  opacity: 0.6;
}

.order-card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-family: monospace;
  font-weight: 700;
  font-size: 1rem;
}

.order-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-badge.pending { background-color: #fef3c7; color: #d97706; }
.status-badge.processing { background-color: #dbeafe; color: #2563eb; }
.status-badge.ready { background-color: rgba(16, 185, 129, 0.15); color: #059669; }
.status-badge.completed { background-color: #f5f5f4; color: #78716c; }
.status-badge.cancelled { background-color: #fee2e2; color: #dc2626; }

.order-card-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cust-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.phone-link a {
  color: #25d366;
  font-weight: 600;
}

.fulfillment-details-box {
  background-color: #fafaf9;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid #f5f5f4;
  font-size: 0.85rem;
}

.badge-table {
  background-color: var(--primary-light);
  color: var(--primary-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.address-text {
  color: var(--text-muted);
  margin-top: 2px;
  line-height: 1.4;
}

.payment-method-line {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.items-list {
  border-top: 1px dashed var(--border);
  border-bottom: 1px dashed var(--border);
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-item-row {
  display: flex;
  flex-direction: column;
}

.item-name-qty {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.9rem;
}

.qty {
  color: var(--primary-hover);
  margin-right: 8px;
  font-weight: 700;
}

.price {
  align-self: flex-end;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.item-notes {
  font-size: 0.8rem;
  color: var(--accent);
  margin-top: 2px;
  padding-left: 18px;
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.total-amount {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--accent);
}

.order-card-footer {
  padding: 16px 20px;
  border-top: 1px solid #f5f5f4;
  background-color: #fafaf9;
  display: flex;
  gap: 8px;
}

.action-btn {
  flex-grow: 1;
  padding: 10px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.85rem;
  color: #ffffff;
  text-align: center;
}

.btn-process { background-color: var(--info); }
.btn-process:hover { background-color: #2563eb; }
.btn-ready { background-color: var(--success); }
.btn-ready:hover { background-color: #059669; }
.btn-complete { background-color: var(--bg-dark); }
.btn-complete:hover { background-color: #000000; }
.btn-cancel {
  background-color: #fef2f2;
  color: var(--danger);
  border: 1px solid #fee2e2;
  flex-grow: 0;
  padding: 10px 14px;
}
.btn-cancel:hover {
  background-color: #fee2e2;
}

/* Menu Tab Layout */
.table-card {
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 600px;
}

.admin-table th, .admin-table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  font-size: 0.95rem;
}

.admin-table th {
  background-color: #fafaf9;
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.td-img {
  width: 90px;
}

.table-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.table-emoji-thumb {
  width: 60px;
  height: 60px;
  background-color: var(--primary-light);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.table-menu-info strong {
  display: block;
  font-size: 1rem;
}

.desc-preview {
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--success);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.stock-lbl {
  font-size: 0.8rem;
  font-weight: 600;
}
.stock-lbl.tersedia { color: var(--success); }
.stock-lbl.habis { color: var(--text-muted); }

.table-actions {
  display: flex;
  gap: 12px;
}

.edit-icon-btn, .delete-icon-btn {
  font-size: 1.1rem;
  padding: 4px;
}

.edit-icon-btn:hover, .delete-icon-btn:hover {
  transform: scale(1.15);
}

/* Image Upload Styles */
.image-upload-wrapper {
  margin-top: 8px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: #fafaf9;
  transition: var(--transition);
}

.image-upload-wrapper:hover {
  border-color: var(--primary);
}

.form-image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f5f5f4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.remove-preview-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.90rem;
  box-shadow: var(--shadow-md);
}

.remove-preview-btn:hover {
  background-color: var(--danger);
  transform: scale(1.1);
}

.upload-dropzone {
  width: 100%;
  height: 140px;
  position: relative;
  transition: var(--transition);
}
.upload-dropzone.uploading {
  opacity: 0.7;
  pointer-events: none;
}

.file-input-hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.dropzone-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 6px;
  pointer-events: none;
}

.upload-icon {
  font-size: 2rem;
}

.upload-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
}

.upload-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Form Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  padding: 24px;
}

.modal-form-container {
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  padding: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
}

.modal-form-container h3 {
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 8px;
}

.form-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* Tables Manager Layout */
.tables-manager-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 768px) {
  .tables-manager-layout {
    grid-template-columns: 1fr;
  }
}

.add-table-card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.add-table-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.inline-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
}

.table-item-card {
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.table-item-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}

.table-num-badge {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  background-color: var(--primary-light);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.table-delete-btn {
  font-size: 0.8rem;
  color: var(--danger);
  font-weight: 600;
}

.table-delete-btn:hover {
  text-decoration: underline;
}
</style>
