import firebase from "firebase/app";
import 'firebase/firestore';
import "firebase/auth";
import firebaseConfig from "./firebase.config";


export const initializationLoginFramework = () => {
    if (firebase.apps.length === 0) {
       return firebase.initializeApp(firebaseConfig);
    } else {
       return firebase.app();
    }
}

const firebaseApp = initializationLoginFramework();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export {auth};


export const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            const credential = result.credential;
            const token = credential.accessToken;
            const user = result.user;
            const newUserInfo = { ...user };
            newUserInfo.error = "";
            newUserInfo.success = true;
            return newUserInfo;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = error.credential;
            const newUserInfo = {};
            newUserInfo.success = false;
            newUserInfo.error = errorMessage;
            return newUserInfo;
        });
}



export const signOut = () => {
    firebase.auth().signOut().then(() => {
        console.log('Log out successfully');
    }).catch((error) => {
        console.log('LogOut error : ', error);
    });
}

export default db;