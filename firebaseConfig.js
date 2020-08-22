
import * as firebase from "firebase";

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDguuT4NrnS__ujFPZDomOkusPwUIZ9qxo",
    authDomain: "livefitandroid.firebaseapp.com",
    databaseURL: "https://livefitandroid.firebaseio.com",
    projectId: "livefitandroid",
    storageBucket: "livefitandroid.appspot.com",
    messagingSenderId: "110294082983",
    appId: "1:110294082983:web:bf22183e50440b89494282"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {
    db,
    auth,
    storage
  }  

