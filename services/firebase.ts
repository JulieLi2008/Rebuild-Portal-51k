import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const isNode = typeof process !== 'undefined' && Boolean(process.versions?.node);

const firebaseConfig = {
  apiKey: (import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) || (isNode ? process.env.VITE_FIREBASE_API_KEY : undefined),
  authDomain: (import.meta.env && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || (isNode ? process.env.VITE_FIREBASE_AUTH_DOMAIN : undefined),
  projectId: (import.meta.env && import.meta.env.VITE_FIREBASE_PROJECT_ID) || (isNode ? process.env.VITE_FIREBASE_PROJECT_ID : undefined),
  storageBucket: (import.meta.env && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || (isNode ? process.env.VITE_FIREBASE_STORAGE_BUCKET : undefined),
  messagingSenderId: (import.meta.env && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || (isNode ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : undefined),
  appId: (import.meta.env && import.meta.env.VITE_FIREBASE_APP_ID) || (isNode ? process.env.VITE_FIREBASE_APP_ID : undefined),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
