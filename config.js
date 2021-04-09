import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCx2lElhZQ61BBDkUoWZOfHmzgfkwZgh6c",
    authDomain: "barter-system-9f98d.firebaseapp.com",
    projectId: "barter-system-9f98d",
    storageBucket: "barter-system-9f98d.appspot.com",
    messagingSenderId: "1034885318013",
    appId: "1:1034885318013:web:783a596b237360bf20b814",
    measurementId: "G-94SZ6QNTDF"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();