import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import * as mockService from './mockService';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const isRealFirebase = !!(firebaseConfig.apiKey && firebaseConfig.authDomain);

const app = isRealFirebase ? initializeApp(firebaseConfig) : null;
const auth = isRealFirebase ? getAuth(app) : null;

if (isRealFirebase) {
  setPersistence(auth, browserSessionPersistence).catch((err) => {
    console.error('Failed to set firebase auth persistence:', err);
  });
}

export const loginAdmin = async (email, password) => {
  if (isRealFirebase) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const session = {
        email: userCredential.user.email,
        token: await userCredential.user.getIdToken()
      };
      sessionStorage.setItem('tuyem_admin_session', JSON.stringify(session));
      return session;
    } catch (err) {
      console.error('Firebase Auth error:', err);
      throw err;
    }
  }
  return mockService.mockLoginAdmin(email, password);
};

export const logoutAdmin = async () => {
  if (isRealFirebase) {
    try {
      await signOut(auth);
      sessionStorage.removeItem('tuyem_admin_session');
      return true;
    } catch (err) {
      console.error('Firebase Signout error:', err);
    }
  }
  mockService.mockLogoutAdmin();
  return true;
};

export const onAdminStateChanged = (callback) => {
  if (isRealFirebase) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const session = {
          email: user.email,
          token: await user.getIdToken()
        };
        sessionStorage.setItem('tuyem_admin_session', JSON.stringify(session));
        callback(session);
      } else {
        sessionStorage.removeItem('tuyem_admin_session');
        callback(null);
      }
    });
  }
  
  // Mock check
  const interval = setInterval(() => {
    callback(mockService.mockGetCurrentAdmin());
  }, 1000);
  
  // Initial callback
  callback(mockService.mockGetCurrentAdmin());

  return () => clearInterval(interval);
};

