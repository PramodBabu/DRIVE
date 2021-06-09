import firebase from 'firebase';
// Firebase configuration
  const firebaseConfig = {
    // firebase credentials
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// export 
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export default firebase;
