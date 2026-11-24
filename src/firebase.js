import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Public Firebase Web App configuration. Security must be enforced by Firebase Rules
// and trusted server-side role assignment, not by hiding these client identifiers.
const firebaseConfig = {
  apiKey: "AIzaSyBS4Gr9xAk79Pm5yq7GtdPFITTSNkB-V-k",
  authDomain: "itsbikramjimi.firebaseapp.com",
  databaseURL: "https://itsbikramjimi-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itsbikramjimi",
  storageBucket: "itsbikramjimi.firebasestorage.app",
  messagingSenderId: "558979157913",
  appId: "1:558979157913:web:e1e96afc919af6cba8cd08"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
