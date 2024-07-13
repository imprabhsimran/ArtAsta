// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded',function(){
const submit = document.getElementById('submit');
const googleSignInButton = document.getElementById('google-signin-button-group');

submit.addEventListener("click", function(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return; // Stop the form submission
        }
// Create a new user with the given email and password
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    signUpUser(email, password);
    alert("creating Account");

    async function signUpUser(email, password) {
        
        try {
            const user = userCredential.user;
            const userId = user.uid;

            await setDoc(doc(db, "Users", userId), {
                uid: userId,
                email: user.email,
            });
    
            console.log('User signed up and data saved in Firestore:', user);

            window.location.href = `/roles/roles.html`;

        } catch (error) {
            console.error('Error signing up:', error);
        }
    }

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(error);
  });
})


googleSignInButton.addEventListener('click', function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
      .then(async (result) => {
          const user = result.user;
          alert("Signed in with Google!");
          await signUpUser(user);

          async function signUpUser(user) {
              try {
                  const userId = user.uid;
                  await setDoc(doc(db, "Users", userId), {
                      uid: userId,
                      email: user.email,
                      displayName: user.displayName
                  });
                  console.log('User signed up and data saved in Firestore:', user);
                  window.location.href = `/roles/roles.html`;
              } catch (error) {
                  console.error('Error saving user data:', error);
              }
          }
      })
      .catch((error) => {
          console.error('Error signing in with Google:', error);
          alert(`Error: ${error.message}`);
      });
});
})
