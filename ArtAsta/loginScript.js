// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

document.addEventListener('DOMContentLoaded', function(){
    const logSubmit = document.getElementById('lgsubmit');
    
    logSubmit.addEventListener('click', function(event) {
      event.preventDefault();
      const logEmail = document.getElementById('lgemail');
      const logPassword = document.getElementById('lgpassword');
      signInWithEmailAndPassword(auth, logEmail, logPassword)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                alert("Signed in successfully!");
                // You can redirect the user to another page here
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(`Error: ${errorMessage}`);
            });
    })
})