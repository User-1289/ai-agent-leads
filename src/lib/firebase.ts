// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Analytics, getAnalytics } from "firebase/analytics";
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
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL storage");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

  // Initialize Analytics only on client side
//let analytics: Analytics | undefined;
//if (typeof window !== 'undefined') {
//  analytics = getAnalytics(app);
//}
export {app, auth} 