<template>
  <div class="customer-home animate-fade">
    <Header />
    
    <!-- Hero Section: Styled as 1920x1080px with hero-bg.png background -->
    <section id="hero" class="hero-section-new section-fullpage">
      <div class="hero-bg-overlay" style="background-image: url('/images/hero-bg.png');"></div>
      <div class="hero-color-overlay"></div>
      <div class="container hero-grid">
        <div class="hero-text-content">
          <span class="tagline">Kuliner Enak Kebumen</span>
          <h2 class="hero-heading">
            Pesan Mie Ayam & Bakso <span class="highlight">Terenak!</span>
          </h2>
          <p class="hero-paragraph">
            Mie ayam dan bakso segar yang disiapkan setiap hari. Pilih menu favorit Anda, bayar, dan pesanan siap dalam hitungan menit. Praktis, cepat, dan enak!
          </p>
          <div class="hero-buttons">
            <a href="#menu" @click.prevent="scrollToSection('menu')" class="btn btn-primary">
              Pesan Sekarang
            </a>
            <a href="#lokasi" @click.prevent="scrollToSection('lokasi')" class="btn btn-outline-light">
              Lihat Lokasi
            </a>
          </div>
        </div>
        <div class="hero-image-content">
          <img src="/images/galer1.jpg" alt="Warung Mie Ayam Baso Tuyem" class="hero-main-img" />
          <div class="promo-badge">
            <span class="badge-icon">🍲</span>
            <div class="badge-text">
              <span class="title">Buka Hari Ini</span>
              <span class="subtitle">09:00 - 21:00 WIB</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Menu / Pesan Section: Styled as 1920x1080px scrollable container -->
    <section id="menu" class="menu-section-new section-fullpage">
      <div class="container menu-section-container">
        <div class="section-header text-center">
          <span class="section-tag">Daftar Menu</span>
          <h2 class="section-title">Mau pesen apa hari ini?</h2>
          <p class="section-desc">Pilih menu favorit Anda di bawah ini. Semua hidangan disiapkan segar setelah Anda memesan.</p>
        </div>

        <!-- Search & Filters -->
        <div class="filter-section">
          <div class="categories">
            <button 
              v-for="cat in categories" 
              :key="cat.value" 
              class="category-tab"
              :class="{ active: activeCategory === cat.value }"
              @click="activeCategory = cat.value"
            >
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-label">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Menu Grid Container (Inner scrollable to fit screen height nicely) -->
        <div class="menu-scroll-container">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Memuat menu lezat...</p>
          </div>

          <div v-else-if="filteredMenu.length === 0" class="empty-state">
            <span class="empty-emoji">🥣</span>
            <h3>Menu Tidak Ditemukan</h3>
            <p>Maaf, tidak ada menu yang tersedia untuk kategori ini saat ini.</p>
          </div>

          <div v-else class="menu-grid-new">
            <div v-for="item in filteredMenu" :key="item.id" class="menu-col">
              <MenuCard 
                :item="item"
                :quantityInCart="getQuantityInCart(item.id)"
                @increase="addToCart"
                @decrease="decreaseQty"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tentang Kami Section: Styled as 1920x1080px -->
    <section id="tentang-kami" class="about-section-new section-fullpage">
      <div class="container about-grid">
        <div class="about-text-content">
          <span class="section-tag">Tentang Kami</span>
          <h2 class="section-title">Warung Mie Ayam Baso Tuyem</h2>
          <p class="about-paragraph">
            Kami adalah warung mie ayam dan baso yang berlokasi di Kebumen, Jawa Tengah. Kami hadir untuk menyajikan hidangan yang enak, bersih, dan terjangkau bagi masyarakat sekitar.
          </p>
          <p class="about-paragraph">
            Setiap porsi mie ayam dan baso kami disiapkan segar setiap harinya menggunakan bahan-bahan pilihan. Kami berkomitmen menjaga kebersihan dan kualitas agar setiap kunjungan Anda memberikan pengalaman makan yang memuaskan.
          </p>
          <div class="highlight-boxes">
            <div class="highlight-box">
              <span class="box-icon">🍜</span>
              <h4>Segar Setiap Hari</h4>
              <p>Mie dan bahan-bahan disiapkan segar setiap hari untuk menjaga kualitas rasa.</p>
            </div>
            <div class="highlight-box">
              <span class="box-icon">🧹</span>
              <h4>Bersih & Higienis</h4>
              <p>Dapur dan peralatan kami selalu dijaga kebersihannya untuk kenyamanan Anda.</p>
            </div>
          </div>
        </div>
        <div class="about-image-content">
          <img src="/images/mie-ayam-bakso.jpg" alt="Sajian Lezat Mie Ayam" class="about-main-img" />
        </div>
      </div>
    </section>

    <!-- Lokasi & Kontak Section: Styled as 1920x1080px -->
    <section id="lokasi" class="location-section-new section-fullpage">
      <div class="container location-section-container">
        <div class="section-header text-center">
          <span class="section-tag">Lokasi Warung</span>
          <h2 class="section-title">Kunjungi Kami Langsung</h2>
          <p class="section-desc">Nikmati suasana hangat makan langsung di warung kami bersama teman dan keluarga.</p>
        </div>

        <div class="location-grid">
          <!-- Google Maps Iframe -->
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d494.2540831754632!2d109.6413021!3d-7.6796371!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7acb9fb3cf0c0b%3A0x1d55b54f77e2a3ec!2sMie%20Ayam%20Baso%20TUYEM!5e0!3m2!1sid!2sid!4v1782062460709!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              title="Lokasi Warung Tuyem"
            ></iframe>
          </div>

          <!-- Operational Card -->
          <div class="info-card">
            <div class="info-group">
              <span class="info-icon">📍</span>
              <div>
                <h4>Alamat Utama</h4>
                <p>Jl. Pahlawan No. 42, Kebumen, Jawa Tengah (Sebelah utara Alun-Alun Kebumen)</p>
              </div>
            </div>
            <div class="info-group">
              <span class="info-icon">🕒</span>
              <div>
                <h4>Jam Operasional</h4>
                <p>Setiap Hari: 09:00 - 21:00 WIB</p>
              </div>
            </div>
            <div class="info-group">
              <span class="info-icon">📞</span>
              <div>
                <h4>Hubungi Kontak WA</h4>
                <p>+62 812-2753-0801 (Untuk pesanan katering / rombongan)</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />

    <!-- Sticky Bottom Cart Bar -->
    <div v-if="cart.length > 0" class="sticky-cart-bar">
      <div class="container cart-bar-container">
        <div class="cart-bar-info">
          <div class="cart-badge">{{ totalItems }}</div>
          <div class="price-info">
            <span class="label">Total Pesanan</span>
            <span class="price">{{ formatPrice(totalPrice) }}</span>
          </div>
        </div>
        <button class="btn btn-accent view-cart-btn" @click="isCartOpen = true">
          <span>Lihat Keranjang</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </button>
      </div>
    </div>

    <!-- Modals -->
    <CartModal 
      :isOpen="isCartOpen"
      :cart="cart"
      :totalItems="totalItems"
      :subtotal="totalPrice"
      :totalPrice="totalPrice"
      @close="isCartOpen = false"
      @increase="addToCart"
      @decrease="decreaseQty"
      @remove="removeFromCart"
      @submit="handleOrderSubmit"
    />

    <OrderSuccessModal 
      :isOpen="isSuccessOpen"
      :order="createdOrder"
      :whatsappUrl="whatsappRedirectUrl"
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import MenuCard from '../components/MenuCard.vue';
import CartModal from '../components/CartModal.vue';
import OrderSuccessModal from '../components/OrderSuccessModal.vue';
import { getMenuItems, createOrder } from '../services/supabase';

// State
const menuItems = ref([]);
const loading = ref(true);
const activeCategory = ref('semua');
const cart = ref([]);
const isCartOpen = ref(false);
const isSuccessOpen = ref(false);
const createdOrder = ref({});
const whatsappRedirectUrl = ref('');

const categories = [
  { value: 'semua', label: 'Semua Menu', icon: '🍽️' },
  { value: 'makanan', label: 'Mie & Bakso', icon: '🍜' },
  { value: 'minuman', label: 'Minuman', icon: '🍹' },
  { value: 'ekstra', label: 'Ekstra Toping', icon: '🥚' }
];

// Fetch menu
onMounted(async () => {
  try {
    menuItems.value = await getMenuItems();
  } catch (error) {
    console.error('Error loading menu:', error);
  } finally {
    loading.value = false;
  }
});

// Cart helper methods
const getQuantityInCart = (itemId) => {
  const item = cart.value.find(c => c.id === itemId);
  return item ? item.quantity : 0;
};

const addToCart = (item) => {
  const existing = cart.value.find(c => c.id === item.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.value.push({
      ...item,
      quantity: 1,
      notes: ''
    });
  }
};

const decreaseQty = (item) => {
  const existing = cart.value.find(c => c.id === item.id);
  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      removeFromCart(item);
    }
  }
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(c => c.id !== item.id);
};

// Computeds
const filteredMenu = computed(() => {
  if (activeCategory.value === 'semua') return menuItems.value;
  return menuItems.value.filter(item => item.category === activeCategory.value);
});

const totalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Order submission handler
const handleOrderSubmit = async (formData) => {
  try {
    const orderResult = await createOrder({
      ...formData,
      totalPrice: totalPrice.value
    }, cart.value);
    createdOrder.value = orderResult;
    
    // Construct WhatsApp message
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890';
    let fulfillmentDetails = '';
    
    if (formData.fulfillmentType === 'dine_in') {
      fulfillmentDetails = `Makan di Tempat (Meja ${formData.tableNumber})`;
    } else if (formData.fulfillmentType === 'take_away') {
      fulfillmentDetails = `Ambil Sendiri (Waktu Ambil: ${formData.pickupTime} WIB)`;
    } else if (formData.fulfillmentType === 'delivery') {
      fulfillmentDetails = `Delivery / Diantar ke:\n     ${formData.deliveryAddress}`;
    }

    let paymentLabel = '';
    if (formData.paymentMethod === 'cash') paymentLabel = '💵 Tunai ke Kasir';
    if (formData.paymentMethod === 'qris') paymentLabel = '📱 QRIS / E-Wallet (Lampirkan Resi)';
    if (formData.paymentMethod === 'transfer') paymentLabel = '🏦 Transfer Bank (Lampirkan Resi)';

    let itemsList = '';
    cart.value.forEach(item => {
      itemsList += `- *${item.quantity}x ${item.name}* (${formatPrice(item.price * item.quantity)})\n`;
      if (item.notes) {
        itemsList += `   _catatan: ${item.notes}_\n`;
      }
    });

    const message = `*MIE AYAM BASO TUYEM - PESANAN BARU*
---------------------------------------
*ID Pesanan:* ${orderResult.id}
*Nama Pemesan:* ${formData.customerName}
*WhatsApp:* ${formData.customerPhone}
*Metode:* ${fulfillmentDetails}
*Pembayaran:* ${paymentLabel}

*Daftar Pesanan:*
${itemsList}
*TOTAL BAYAR:* *${formatPrice(orderResult.total_price)}*
---------------------------------------
_Silakan kirim pesan ini untuk mengonfirmasi pesanan Anda._
_Untuk pembayaran QRIS/Transfer Bank, harap lampirkan resi/screenshot pembayaran di chat ini._`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    whatsappRedirectUrl.value = waUrl;
    
    // Close cart and open success
    isCartOpen.value = false;
    isSuccessOpen.value = true;
  } catch (error) {
    console.error('Failed to place order:', error);
    alert('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.');
  }
};

const handleSuccessClose = () => {
  isSuccessOpen.value = false;
  cart.value = []; // Reset cart
};
</script>

<style scoped>
.customer-home {
  padding-top: 80px; /* Offset for sticky navbar */
  padding-bottom: 0px;
  background-color: var(--bg-main);
}

/* 1920x1080px Consistent Sizing & Alignment Utility */
.section-fullpage {
  width: 100%;
  min-height: 800px;
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

/* Hero Section Style with full image background and overlay */
.hero-section-new {
  padding: 40px 0;
  position: relative;
  overflow: hidden;
}

.hero-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.hero-color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(28, 25, 23, 0.75) 100%);
  z-index: 2;
}

.hero-section-new .container {
  position: relative;
  z-index: 3;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;
  width: 100%;
}

.tagline {
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 2px;
  display: inline-block;
  margin-bottom: 12px;
  background-color: rgba(245, 158, 11, 0.15);
  padding: 6px 12px;
  border-radius: var(--radius-full);
}

.hero-heading {
  font-size: 3.6rem;
  font-weight: 800;
  color: var(--text-light);
  line-height: 1.15;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.hero-heading .highlight {
  color: var(--primary);
  background: linear-gradient(120deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.02) 100%);
  padding: 0 4px;
}

.hero-paragraph {
  font-size: 1.2rem;
  color: #d6d3d1;
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-outline-light {
  border: 2px solid rgba(255, 255, 255, 0.6);
  color: var(--text-light);
}

.btn-outline-light:hover {
  background-color: white;
  color: var(--text-main);
}

.trust-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-light);
}

.stat-label {
  font-size: 0.85rem;
  color: #a8a29e;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.15);
}

.hero-image-content {
  position: relative;
  display: flex;
  justify-content: center;
}

.hero-main-img {
  width: 100%;
  max-width: 440px;
  height: 340px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.15);
}

.promo-badge {
  position: absolute;
  bottom: 20px;
  left: -20px;
  background-color: white;
  padding: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border);
}

.promo-badge .badge-icon {
  font-size: 1.8rem;
}

.promo-badge .badge-text {
  display: flex;
  flex-direction: column;
}

.promo-badge .title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
}

.promo-badge .subtitle {
  font-size: 0.8rem;
  color: var(--success);
  font-weight: 600;
}

/* Sections Global Headers */
.section-tag {
  color: var(--primary-hover);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 8px;
}

.section-title {
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 12px;
}

.section-desc {
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 30px auto;
  font-size: 1.1rem;
}

.text-center {
  text-align: center;
}

/* Menu Section Styles */
.menu-section-new {
  padding: 60px 0;
  background-color: #fcfbfb;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.menu-section-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.filter-section {
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
  display: flex;
  justify-content: center;
}

.categories {
  display: flex;
  gap: 12px;
}

.category-tab {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: var(--transition);
}

.category-tab:hover {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

.category-tab.active {
  background-color: var(--primary);
  color: var(--bg-dark);
  border-color: var(--primary);
}

/* Inner scroll container to maintain consistent screen height */
.menu-scroll-container {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 520px;
  padding-right: 8px;
}

.menu-grid-new {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tentang Kami Section */
.about-section-new {
  padding: 80px 0;
  background-color: white;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
}

.about-paragraph {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 20px;
}

.highlight-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 32px;
}

.highlight-box {
  background-color: #fcfbfb;
  border: 1px solid var(--border);
  padding: 20px;
  border-radius: var(--radius-md);
}

.highlight-box .box-icon {
  font-size: 1.8rem;
  display: block;
  margin-bottom: 8px;
}

.highlight-box h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-main);
}

.highlight-box p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.about-image-content {
  position: relative;
  display: flex;
  justify-content: center;
}

.about-main-img {
  width: 100%;
  max-width: 400px;
  height: 400px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: var(--shadow-lg);
  border: 8px solid #fdf8f4;
}

.experience-card {
  position: absolute;
  bottom: 20px;
  right: 0px;
  background-color: #1c1917;
  color: white;
  padding: 16px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 160px;
  text-align: center;
}

.experience-card .years {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.experience-card .label {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
  color: #a8a29e;
}

/* Lokasi Section */
.location-section-new {
  padding: 80px 0;
  background-color: #fcfbfb;
  border-top: 1px solid var(--border);
}

.location-section-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.location-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  margin-top: 16px;
}

.map-container {
  height: 400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
}

.info-card {
  background-color: white;
  border: 1px solid var(--border);
  padding: 32px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: var(--shadow-sm);
}

.info-group {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.5rem;
  background-color: var(--primary-light);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-group h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text-main);
}

.info-group p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.facility-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--border);
  padding-top: 20px;
}

.facility {
  font-size: 0.8rem;
  font-weight: 600;
  background-color: #f5f5f4;
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: var(--radius-full);
}

/* Sticky Bottom Cart Bar */
.sticky-cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-dark);
  color: var(--text-light);
  padding: 16px 0;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.15);
  z-index: 90;
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}

.cart-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-bar-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-badge {
  background-color: var(--primary);
  color: var(--bg-dark);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.price-info {
  display: flex;
  flex-direction: column;
}

.price-info .label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.price-info .price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
}

.view-cart-btn {
  padding: 12px 28px;
}

/* Media Queries */
@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  .hero-text-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-buttons {
    justify-content: center;
  }
  .trust-stats {
    justify-content: center;
  }
  .hero-image-content {
    order: -1;
  }
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .about-image-content {
    order: -1;
  }
  .location-grid {
    grid-template-columns: 1fr;
  }
  .section-fullpage {
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .hero-heading {
    font-size: 2.2rem;
  }
  .section-title {
    font-size: 1.8rem;
  }
  .filter-section {
    justify-content: flex-start;
  }
  .categories {
    min-width: max-content;
  }
  .menu-scroll-container {
    max-height: none;
  }
}

@media (max-width: 480px) {
  .hero-buttons {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  .hero-buttons .btn {
    width: 100%;
  }
  .promo-badge {
    left: 10px;
    bottom: 10px;
    padding: 10px;
  }
  .experience-card {
    right: 10px;
    bottom: 10px;
    padding: 10px;
  }
  .highlight-boxes {
    grid-template-columns: 1fr;
  }
  .view-cart-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  .price-info .price {
    font-size: 1.1rem;
  }
}
</style>
