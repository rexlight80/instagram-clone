import firebase from "firebase"

const firebaseApp=firebase.initializeApp( {
    apiKey: "AIzaSyDsKiAerKw0fPF85mrIvNQt-jJ1KmQU4U4",
    authDomain: "instagram-clone-46b30.firebaseapp.com",
    databaseURL: "https://instagram-clone-46b30.firebaseio.com",
    projectId: "instagram-clone-46b30",
    storageBucket: "instagram-clone-46b30.appspot.com",
    messagingSenderId: "703089587651",
    appId: "1:703089587651:web:45b61031cae154c839b976",
    measurementId: "G-2RSFFK7TBT"
  });

  export const db=firebaseApp.firestore();
  export const auth=firebaseApp.auth();
  export const storage=firebaseApp.storage()


