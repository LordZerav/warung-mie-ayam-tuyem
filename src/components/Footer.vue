<template>
  <footer id="footer" class="footer">
    <div class="container footer-container">
      <!-- Column 1: Brand & Desc -->
      <div class="footer-col brand-col">
        <div class="logo">
          <span class="emoji">🍜</span>
          <div class="brand">
            <h2>Tuyem</h2>
            <span class="sub">Mie Ayam & Baso</span>
          </div>
        </div>
        <p class="brand-desc">
          Mie ayam dan baso segar pilihan masyarakat Kebumen. Enak, bersih, dan terjangkau.
        </p>
        <div class="socials">
          <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="social-link wa-social" aria-label="WhatsApp">WA</a>
        </div>
      </div>

      <!-- Column 2: Navigation Links -->
      <div class="footer-col links-col">
        <h3>Navigasi</h3>
        <ul class="footer-links">
          <li><a href="#hero" @click.prevent="scrollToSection('hero')">Home</a></li>
          <li><a href="#menu" @click.prevent="scrollToSection('menu')">Pesan Menu</a></li>
          <li><a href="#tentang-kami" @click.prevent="scrollToSection('tentang-kami')">Tentang Kami</a></li>
          <li><a href="#lokasi" @click.prevent="scrollToSection('lokasi')">Lokasi</a></li>
        </ul>
      </div>

      <!-- Column 3: Contact/Operational Info -->
      <div class="footer-col contact-col">
        <h3>Hubungi Kami</h3>
        <p class="contact-info">📍 Jl. Pahlawan No. 42, Kebumen</p>
        <p class="contact-info">📞 0812-2753-0801</p>
        <p class="contact-info">✉️ info@mieayamtuyem.com</p>
        <div class="status-indicator">
          <span class="dot"></span>
          <span>Buka Setiap Hari (09:00 - 21:00)</span>
        </div>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="copyright-bar">
      <div class="container copyright-container">
        <p>&copy; 2026 Mie Ayam Baso Tuyem. Hak Cipta Dilindungi.</p>
        <router-link to="/admin" class="admin-login-link">Portal Admin</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890';
const whatsappUrl = computed(() => {
  const message = 'Halo Warung Mie Ayam Baso Tuyem! Saya ingin bertanya tentang menu kuliner Anda.';
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
});

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style scoped>
.footer {
  background-color: var(--bg-dark);
  color: var(--text-light);
  padding: 60px 0 0 0;
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}

.footer-container {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 40px;
  padding-bottom: 40px;
}

.footer-col h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 8px;
}

.footer-col h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: var(--primary);
}

.brand-col .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.brand-col .emoji {
  font-size: 2rem;
}

.brand-col h2 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-col .sub {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
}

.brand-desc {
  color: #a8a29e;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.socials {
  display: flex;
  gap: 12px;
}

.social-link {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  transition: var(--transition);
}

.social-link:hover {
  background-color: var(--primary);
  color: var(--bg-dark);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: #a8a29e;
  font-size: 1rem;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--primary);
  padding-left: 4px;
}

.contact-info {
  font-size: 1rem;
  color: #a8a29e;
  margin-bottom: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 16px;
  width: fit-content;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.copyright-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px 0;
  font-size: 0.85rem;
  color: #78716c;
}

.copyright-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.admin-login-link {
  color: #78716c;
  transition: var(--transition);
}

.admin-login-link:hover {
  color: var(--primary);
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .copyright-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
