import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDu1mNebskATIVQmz59QosBS1AhdMAkxqM",
    authDomain: "art-asta-50475.firebaseapp.com",
    projectId: "art-asta-50475",
    storageBucket: "art-asta-50475.appspot.com",
    messagingSenderId: "343332230219",
    appId: "1:343332230219:web:efe5a85c164e5e461c69ce"
};

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
                alert("Signed in successfully!");
                window.location.href = '/Homepage-dashboard/homepage.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    })

});