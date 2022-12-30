const firebase = require('firebase/app');
const firebaseConfig = {
    apiKey: "AIzaSyA0ra_BNDNuflaIFF5x3VpE2WJZFOgaZcQ",
    authDomain: "note-8380c.firebaseapp.com",
    projectId: "note-8380c",
    storageBucket: "note-8380c.appspot.com",
    messagingSenderId: "104939454569",
    appId: "1:104939454569:web:147fda82cc7f643bdee2f8",
    measurementId: "G-03J2P0HJ4P"
  };
const app = firebase.initializeApp(firebaseConfig); //initialize firebase app 
module.exports = { app }; //export the app