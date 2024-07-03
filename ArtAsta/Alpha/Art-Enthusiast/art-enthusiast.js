// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

//Art Asta's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDu1mNebskATIVQmz59QosBS1AhdMAkxqM",
    authDomain: "art-asta-50475.firebaseapp.com",
    projectId: "art-asta-50475",
    storageBucket: "art-asta-50475.appspot.com",
    messagingSenderId: "343332230219",
    appId: "1:343332230219:web:efe5a85c164e5e461c69ce"
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


document.addEventListener('DOMContentLoaded', function () {

    let submitBtn = document.getElementById('submit');
    let buyer_name = document.getElementById('name');
    let buyer_bio = document.getElementById('bio');
    let buyer_mobile = document.getElementById('mobile');
    let buyer_address = document.getElementById('address');
    let emailbp = " ";
    const user = auth.currentUser;
    let user_id;
    auth.onAuthStateChanged((user) => {
        if (user) {
            user_id = user.uid;
            console.log(user.uid);
            let userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
              if (userDocSnap.exists()) {
                let userData = userDocSnap.data();
                    console.log("User data:", userData);
                    emailbp = userData.email;  
                    console.log("Email:", emailbp);
              } else {
                console.log("No such document in users!");
              }
            }).catch((error) => {
              console.error("Error getting user document:", error);
            });
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }

    });

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const buyerData = {
            uid: user_id,
            Name: buyer_name.value,
            Bio: buyer_bio.value,
            Email: emailbp,
            Mobile: buyer_mobile.value,
            Address: buyer_address.value
        }

        const artEnthusiastRef = doc(db, "Art-Enthusiast", user_id);
        setDoc(artEnthusiastRef, buyerData)
            .then(() => {
                console.log("Art Enthusiast document created successfully!");
            })
            .catch((error) => {
                console.error("Error creating artist document:", error);
            });
        })
    
        document.getElementById("buyer_info_form").reset();

});