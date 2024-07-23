import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import firebaseConfig from '../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

document.addEventListener('DOMContentLoaded', function () {
    const logSubmit = document.getElementById('lgsubmit');

    logSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        const logEmail = document.getElementById('lgemail').value;
        const logPassword = document.getElementById('lgpassword').value;
        signInWithEmailAndPassword(auth, logEmail, logPassword)
            .then((userCredential) => {            
                const user = userCredential.user;
                window.location.href = '/Homepage-dashboard/homepage.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    })

});