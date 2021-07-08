import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database"; //realtime database

const firebaseConfig = {
    //(댓글 x, 좋아요 o)
    apiKey: "AIzaSyCX6B4CCjA0Xj8Haa3cB0oFJAQMLUeGWDQ",
    authDomain: "magazine-d8b16.firebaseapp.com",
    projectId: "magazine-d8b16",
    storageBucket: "magazine-d8b16.appspot.com",
    messagingSenderId: "148214057259",
    appId: "1:148214057259:web:6a44edb216cd60c1b85d6e"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();
export{auth, apiKey, firestore, storage, realtime};