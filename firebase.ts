
import { initializeApp } from "firebase/app";
import { initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUJqmcfbBDUGBOCaS3amKTVrsofm60XBg",
  authDomain: "mabuhay-858ef.firebaseapp.com",
  projectId: "mabuhay-858ef",
  storageBucket: "mabuhay-858ef.firebasestorage.app",
  messagingSenderId: "218137795092",
  appId: "1:218137795092:web:38c86b4a499974e108a501",
  measurementId: "G-4PDKQY9GB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * Initialize Firestore with robust connectivity settings.
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

/**
 * Enable offline persistence to handle potential connection issues gracefully.
 */
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence failed: Browser not supported');
  }
});

export const storage = getStorage(app);
