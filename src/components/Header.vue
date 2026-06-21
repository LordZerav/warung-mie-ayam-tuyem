<template>
  <nav class="navbar">
    <div class="container nav-container">
      <div class="logo" @click="scrollToSection('hero')">
        <span class="emoji">🍜</span>
        <div class="brand">
          <h1>Tuyem</h1>
          <span class="sub">Mie Ayam & Baso</span>
        </div>
      </div>

      <!-- Desktop Navigation Menu -->
      <div class="nav-menu">
        <a href="#hero" @click.prevent="scrollToSection('hero')" class="nav-link">Home</a>
        <a href="#menu" @click.prevent="scrollToSection('menu')" class="nav-link">Pesan Menu</a>
        <a href="#tentang-kami" @click.prevent="scrollToSection('tentang-kami')" class="nav-link">Tentang Kami</a>
        <a href="#lokasi" @click.prevent="scrollToSection('lokasi')" class="nav-link">Lokasi</a>
      </div>

      <div class="nav-actions">
        <!-- WhatsApp Call to Action -->
        <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="wa-btn">
          <svg class="wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
          </svg>
          <span class="wa-text">Chat WA</span>
        </a>

        <!-- Admin Dashboard Icon Link -->
        <router-link to="/admin" class="admin-btn" title="Dashboard Admin">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </router-link>

        <!-- Mobile Menu Toggle -->
        <button class="menu-toggle" @click="isMobileOpen = !isMobileOpen" aria-label="Toggle Menu">
          <svg v-if="!isMobileOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div class="mobile-drawer" :class="{ open: isMobileOpen }">
      <a href="#hero" @click.prevent="scrollToSection('hero')" class="mobile-link">Home</a>
      <a href="#menu" @click.prevent="scrollToSection('menu')" class="mobile-link">Pesan Menu</a>
      <a href="#tentang-kami" @click.prevent="scrollToSection('tentang-kami')" class="mobile-link">Tentang Kami</a>
      <a href="#lokasi" @click.prevent="scrollToSection('lokasi')" class="mobile-link">Lokasi</a>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';

const isMobileOpen = ref(false);

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890';
const whatsappUrl = computed(() => {
  const message = 'Halo Warung Mie Ayam Baso Tuyem! Saya ingin bertanya tentang menu kuliner Anda.';
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
});

const scrollToSection = (id) => {
  isMobileOpen.value = false;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.emoji {
  font-size: 2.2rem;
}

.brand h1 {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand .sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
  margin-top: -2px;
  display: block;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  transition: var(--transition);
  position: relative;
}

.nav-link:hover {
  color: var(--primary-hover);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: var(--transition);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.wa-btn {
  background-color: #25d366;
  color: white;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
  transition: var(--transition);
}

.wa-btn:hover {
  background-color: #20ba5a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.35);
}

.wa-icon {
  width: 18px;
  height: 18px;
  fill: white;
}

.admin-btn {
  background-color: #f5f5f4;
  border: 1px solid var(--border);
  color: var(--text-main);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.admin-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary-hover);
}

.menu-toggle {
  display: none;
  color: var(--text-main);
}

/* Mobile Drawer */
.mobile-drawer {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-md);
  transform: translateY(-120%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease-in-out;
}

.mobile-drawer.open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.mobile-link {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f4;
}

.mobile-link:last-child {
  border-bottom: none;
}

@media (max-width: 868px) {
  .nav-menu {
    display: none;
  }
  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f4;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid var(--border);
  }
}

@media (max-width: 480px) {
  .wa-text {
    display: none;
  }
  .wa-btn {
    padding: 10px;
    border-radius: 50%;
  }
}
</style>

