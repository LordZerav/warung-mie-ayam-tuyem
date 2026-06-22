import { createRouter, createWebHistory } from 'vue-router';
import CustomerHome from './views/CustomerHome.vue';
import AdminLogin from './views/AdminLogin.vue';
import AdminDashboard from './views/AdminDashboard.vue';
import { mockGetCurrentAdmin } from './services/mockService';

const routes = [
  {
    path: '/',
    name: 'CustomerHome',
    component: CustomerHome
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { guestOnly: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Simple Navigation Guards
router.beforeEach((to, from) => {
  const isAdminLoggedIn = !!sessionStorage.getItem('tuyem_admin_session');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAdminLoggedIn) {
      return { name: 'AdminLogin' };
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAdminLoggedIn) {
      return { name: 'AdminDashboard' };
    }
  }
});

export default router;
