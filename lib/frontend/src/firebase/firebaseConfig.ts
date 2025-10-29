/**
 * to do:
 * TEMPORARY SOLUTION - Firebase Mock Configuration
 * 
 * ⚠️ WARNING: This is a temporary implementation ⚠️
 * 
 * This file currently provides mock Firebase authentication objects to allow
 * the application to run without proper Firebase configuration. This is NOT
 * suitable for production use.
 * 
 * WHAT THIS DOES:
 * - Provides mock auth, provider, and analytics objects
 * - Allows the app to compile and run without Firebase environment variables
 * - Simulates basic auth behavior with null user state
 * 
 * WHAT NEEDS TO BE DONE:
 * 1. Set up proper Firebase project and obtain configuration
 * 2. Configure environment variables (VITE_FIREBASE_*)
 * 3. Replace this mock implementation with real Firebase initialization
 * 4. Test authentication flow with actual Firebase
 * 
 * RELATED FILES:
 * - GoogleAuth.ts - Contains the auth interfaces
 * - Any components using Firebase auth
 * 
 * @author Development Team
 * @date October 2025
 * @status TEMPORARY - REPLACE BEFORE PRODUCTION
 */

// Firebase configuration with graceful fallback for development
// For now, using mock objects until Firebase is properly configured

// Mock auth object for development
function createMockAuth() {
  return {
    currentUser: null,
    name: 'mock-auth',
    app: {} as any,
    config: {} as any,
    onAuthStateChanged: (callback: any) => {
      // Call callback immediately with null user
      setTimeout(() => callback(null), 0);
      // Return unsubscribe function
      return () => {};
    },
    signOut: () => Promise.resolve(),
    signInWithPopup: () => Promise.reject(new Error('Firebase not configured')),
    signInWithRedirect: () => Promise.reject(new Error('Firebase not configured')),
    getRedirectResult: () => Promise.resolve(null),
    setPersistence: () => Promise.resolve(),
    useDeviceLanguage: () => {},
    languageCode: null,
    tenantId: null,
    settings: {} as any,
    beforeAuthStateChanged: () => () => {},
    onIdTokenChanged: () => () => {},
    updateCurrentUser: () => Promise.resolve(),
  };
}

// Mock provider object
const createMockProvider = () => ({
  addScope: () => {},
  setCustomParameters: () => {},
  providerId: 'google.com',
});

// Mock analytics object
const createMockAnalytics = () => ({});

console.log('⚠️ Firebase disabled: Using mock auth for development. Configure Firebase environment variables to enable.');

// Export mock objects for now - using type assertion to satisfy TypeScript
export const auth = createMockAuth() as any;
export const provider = createMockProvider() as any;
export const analytics = createMockAnalytics();

// TODO: Replace with real Firebase initialization when environment variables are configured
/*
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
export const analytics = getAnalytics(app);
*/