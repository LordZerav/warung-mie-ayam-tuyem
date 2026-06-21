<template>
  <div class="login-wrapper">
    <div class="glow-effect"></div>
    <div class="login-card animate-pop">
      <div class="logo-area">
        <span class="logo-emoji">🍜</span>
        <h2>Tuyem Admin</h2>
        <p>Sistem Manajemen Warung Digital</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="error" class="error-alert animate-fade">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>
          <span>{{ error }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email Admin</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              required 
              placeholder="admin@tuyem.com"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              required 
              placeholder="••••••••"
              class="form-control"
            />
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block login-btn" :disabled="loading">
          <span v-if="loading">Mengautentikasi...</span>
          <span v-else>Masuk ke Dasbor</span>
        </button>
      </form>

      <!-- Mock Hint -->
      <div class="mock-hint">
        <span class="hint-title">💡 Info Demo Mode</span>
        <p>Gunakan kredensial berikut untuk masuk:</p>
        <code>Email: admin@tuyem.com</code>
        <code>Password: admin123</code>
      </div>
      
      <div class="back-link">
        <router-link to="/">← Kembali ke Halaman Pemesanan</router-link>
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

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await loginAdmin(email.value, password.value);
    // Redirect to admin
    router.push({ name: 'AdminDashboard' });
  } catch (err) {
    // Map Firebase error codes to Indonesian messages
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
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-dark);
  color: var(--text-light);
  position: relative;
  overflow: hidden;
  padding: 24px;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: 1;
  pointer-events: none;
}

.login-card {
  position: relative;
  z-index: 2;
  background-color: var(--bg-dark-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.logo-area {
  text-align: center;
  margin-bottom: 32px;
}

.logo-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
  animation: pulse 2s infinite ease-in-out;
}

.logo-area h2 {
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(to right, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-area p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 4px;
}

.login-form {
  margin-bottom: 24px;
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a8a29e;
  margin-bottom: 6px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.form-control {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 12px 16px 12px 48px;
  color: var(--text-light);
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.login-btn {
  background-color: var(--primary);
  color: var(--bg-dark);
  padding: 14px;
  font-weight: 700;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mock-hint {
  background-color: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
  font-size: 0.8rem;
}

.hint-title {
  color: var(--primary);
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
}

.mock-hint p {
  color: #a8a29e;
  margin-bottom: 8px;
}

.mock-hint code {
  display: block;
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  color: #fbbf24;
}

.back-link {
  text-align: center;
}

.back-link a {
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: var(--transition);
}

.back-link a:hover {
  color: var(--primary);
}
</style>
