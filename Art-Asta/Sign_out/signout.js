import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const signOutButton = document.getElementById("sign_out_id");

    const cancel_return = document.getElementById("cancel_id");
    cancel_return.addEventListener('click',function(e){
        e.preventDefault();
        window.location.href = '/Homepage-dashboard/homepage.html';
    })
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User is signed in:', user);
            signOutButton.addEventListener('click', () => {
                signOut(auth).then(() => {
                    console.log('Sign-out successful.');
                    window.location.href = '/Login/login.html';
                }).catch((error) => {
                    console.error('An error happened during sign-out:', error);
                });
            });
        } else {
            console.log('No user is signed in.');
        }
    });
});