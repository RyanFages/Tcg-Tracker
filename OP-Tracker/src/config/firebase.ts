// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcXMkoMCTuddbdW5TNWOYaHb0BF8yZJ_U",
  authDomain: "op-tracker-db.firebaseapp.com",
  projectId: "op-tracker-db",
  storageBucket: "op-tracker-db.firebasestorage.app",
  messagingSenderId: "1054414206870",
  appId: "1:1054414206870:web:1406f131a9b2aac6214fb7",
  measurementId: "G-Y4F9EVETM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export services to use in the app
export const db = getFirestore(app);
''