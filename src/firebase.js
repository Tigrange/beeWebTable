import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBNNw2zJUQZdmSrSUPyRllNKOnQmcp_lXs",
  authDomain: "beewebtable.firebaseapp.com",
  projectId: "beewebtable",
  storageBucket: "beewebtable.appspot.com",
  messagingSenderId: "982348240096",
  appId: "1:982348240096:web:960f98bf02340de0bd2c85",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
