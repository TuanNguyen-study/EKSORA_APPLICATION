
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnowNGng6PgwcPbRc0767tQUcnYgM4lQ4",
  authDomain: "eksora-a6869.firebaseapp.com",
  projectId: "eksora-a6869",
  storageBucket: "eksora-a6869.firebasestorage.app",
  messagingSenderId: "462414238701",
  appId: "1:462414238701:web:71a9f8050d528b008acde4"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();

export { auth, provider }
