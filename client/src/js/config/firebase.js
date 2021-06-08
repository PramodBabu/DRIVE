import firebase from 'firebase';
// Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAwvauP0FZv9MZYrukfpXs5Mnna_I925Es",
    authDomain: "cloud-storage-95ba4.firebaseapp.com",
    projectId: "cloud-storage-95ba4",
    storageBucket: "cloud-storage-95ba4.appspot.com",
    messagingSenderId: "749354877777",
    appId: "1:749354877777:web:af13cda7a5e857bfc18970"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// export 
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export default firebase;
