import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyBDKmws_KHnTAqoI00qxA_w_6IgdIbzg",
  authDomain: "smartbank-30b29.firebaseapp.com",
  projectId: "smartbank-30b29",
  storageBucket: "smartbank-30b29.firebasestorage.app",
  messagingSenderId: "569654009898",
  appId: "1:569654009898:web:ec520e920eb7f37122e353",
  measurementId: "G-D6TDQMKE34"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Always show account picker & request email/profile
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { getRedirectResult };
