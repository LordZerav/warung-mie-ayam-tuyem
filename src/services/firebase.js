import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import * as mockService from './mockService';

const firebaseConfig = {
  apiKey: "AIzaSyD9PuaNV15_ECQY4PKT4Rr5Mj7xZtPNM2Q",
  authDomain: "website-mie-ayam.firebaseapp.com",
  projectId: "website-mie-ayam",
  storageBucket: "website-mie-ayam.firebasestorage.app",
  messagingSenderId: "670329165256",
  appId: "1:670329165256:web:690a24c529198148badcfd",
  measurementId: "G-LLCVN14E41"
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

