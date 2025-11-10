/**
 * Firebase Configuration
 * 
 * This file initializes Firebase with proper authentication and analytics.
 * It reads configuration from environment variables and sets up Google Auth provider.
 * 
 * @author Development Team
 * @date November 2025
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required environment variables are present
const requiredKeys = [
  'VITE_FIREBASE_API_KEY', 
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];
const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);

// Only show warning in development mode, not in production console
if (missingKeys.length > 0 && import.meta.env.DEV) {
  console.info('ℹ️ Firebase is not configured (missing env variables). Google Auth will be disabled.');
}

// Initialize Firebase only if all required keys are present
const app = missingKeys.length === 0 ? initializeApp(firebaseConfig) : null;

// Initialize Firebase Authentication and get a reference to the service
export const auth = app ? getAuth(app) : null;

// Initialize Google Auth Provider
export const provider = app ? (() => {
  const p = new GoogleAuthProvider();
  p.addScope('profile');
  p.addScope('email');
  return p;
})() : null;

// Initialize Analytics (only in production/browser environment)
let analytics: Analytics | undefined;
try {
  if (app && typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Analytics initialization failed:', error);
  }
}

export { analytics };