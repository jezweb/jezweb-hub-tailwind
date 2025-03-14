/**
 * Firebase Configuration
 * 
 * This file initializes and exports Firebase services for use throughout the application.
 * It provides centralized access to Firestore, Authentication, Storage, and other Firebase services.
 * 
 * The configuration is environment-specific and should be kept secure.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration object with API keys and project settings
const firebaseConfig = {
  apiKey: "AIzaSyBxjuSAyinoAosXdTig9HNyzVXYX1fKlYQ",
  authDomain: "jezweb-hub.firebaseapp.com",
  projectId: "jezweb-hub",
  storageBucket: "jezweb-hub.firebasestorage.app",
  messagingSenderId: "741775877175",
  appId: "1:741775877175:web:d7037edf8541659f4b8bb2",
  measurementId: "G-0FX4HYQCHS"
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;