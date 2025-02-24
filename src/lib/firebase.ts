// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import exp from "constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVlivXY7N0RCIHn_xVPzRQPN4gdJaCNs8",
  authDomain: "ai-leads-agent.firebaseapp.com",
  projectId: "ai-leads-agent",
  storageBucket: "ai-leads-agent.firebasestorage.app",
  messagingSenderId: "984266159542",
  appId: "1:984266159542:web:128dfe521cd0241f9f3d17",
  measurementId: "G-PPSSEW0WR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export {app, analytics, auth}