<template>
  <div class="login-wrapper">
    <!-- Animated background particles -->
    <div class="bg-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
    </div>
    <div class="glow-effect"></div>

    <div class="login-card animate-pop">
      <!-- Header -->
      <div class="logo-area">
        <div class="logo-ring">
          <span class="logo-emoji">🍜</span>
        </div>
        <h2>Tuyem Admin</h2>
        <p>Sistem Manajemen Warung Digital</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Error Alert -->
        <transition name="fade-slide">
          <div v-if="error" class="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>{{ error }}</span>
          </div>
        </transition>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email Admin</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              placeholder="Masukkan email admin"
              class="form-control"
              autocomplete="email"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="Masukkan password"
              class="form-control"
              autocomplete="current-password"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="loading-state">
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Mengautentikasi...
          </span>
          <span v-else>Masuk ke Dasbor</span>
        </button>
      </form>

      <div class="divider"></div>

      <div class="back-link">
        <router-link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Kembali ke Halaman Pemesanan
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginAdmin } from '../services/firebase';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await loginAdmin(email.value, password.value);
    router.push({ name: 'AdminDashboard' });
  } catch (err) {
    const code = err?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      error.value = 'Email atau password salah. Silakan coba lagi.';
    } else if (code === 'auth/too-many-requests') {
      error.value = 'Terlalu banyak percobaan login. Akun sementara dikunci. Coba beberapa saat lagi.';
    } else if (code === 'auth/network-request-failed') {
      error.value = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
    } else if (code === 'auth/user-disabled') {
      error.value = 'Akun ini telah dinonaktifkan. Hubungi administrator.';
    } else {
      error.value = err.message || 'Gagal login. Periksa kembali email dan password Anda.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ===== WRAPPER & BACKGROUND ===== */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
  color: var(--text-light, #f5f5f5);
  position: relative;
  overflow: hidden;
  padding: 24px;
  font-family: 'Inter', sans-serif;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 40%, transparent 70%);
  z-index: 1;
  pointer-events: none;
  animation: breathe 4s ease-in-out infinite;
}

/* Floating Particles */
.bg-particles {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: float-particle linear infinite;
}
.particle-1 {
  width: 6px; height: 6px;
  background: #f59e0b;
  top: 20%; left: 15%;
  animation-duration: 12s;
  animation-delay: 0s;
}
.particle-2 {
  width: 4px; height: 4px;
  background: #fbbf24;
  top: 70%; left: 80%;
  animation-duration: 9s;
  animation-delay: -3s;
}
.particle-3 {
  width: 8px; height: 8px;
  background: #f59e0b;
  top: 40%; left: 90%;
  animation-duration: 15s;
  animation-delay: -6s;
}
.particle-4 {
  width: 5px; height: 5px;
  background: #fbbf24;
  top: 85%; left: 20%;
  animation-duration: 11s;
  animation-delay: -2s;
}

/* ===== CARD ===== */
.login-card {
  position: relative;
  z-index: 2;
  background: linear-gradient(145deg, #1a1a1a, #111111);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 24px;
  padding: 44px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 24px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(245, 158, 11, 0.06);
}

/* ===== LOGO AREA ===== */
.logo-area {
  text-align: center;
  margin-bottom: 36px;
}

.logo-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05));
  border: 2px solid rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  animation: pulse-ring 3s ease-in-out infinite;
}

.logo-emoji {
  font-size: 2rem;
  display: block;
}

.logo-area h2 {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #f59e0b, #fbbf24, #f59e0b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

.logo-area p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 6px;
  letter-spacing: 0.2px;
}

/* ===== FORM ===== */
.login-form {
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4b5563;
  pointer-events: none;
  transition: color 0.2s;
}

.form-control {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 13px 16px 13px 46px;
  color: #f9fafb;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  outline: none;
  box-sizing: border-box;
}

.form-control::placeholder {
  color: #4b5563;
}

.form-control:focus {
  background: rgba(245, 158, 11, 0.04);
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-control:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #f59e0b;
}

/* Toggle password button */
.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.toggle-password:hover {
  color: #f59e0b;
}

/* ===== ERROR ALERT ===== */
.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-left: 3px solid #ef4444;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #fca5a5;
}

/* ===== LOGIN BUTTON ===== */
.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1a1a1a;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}

.login-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== DIVIDER ===== */
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent);
  margin: 28px 0 20px;
}

/* ===== BACK LINK ===== */
.back-link {
  text-align: center;
}

.back-link a {
  font-size: 0.85rem;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.back-link a:hover {
  color: #f59e0b;
  gap: 4px;
}

/* ===== ANIMATIONS ===== */
@keyframes breathe {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
}

@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.2); }
  50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

@keyframes float-particle {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.15; }
  90% { opacity: 0.15; }
  100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 0.8s linear infinite;
}

/* Transition for error alert */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.animate-pop {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.94) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
