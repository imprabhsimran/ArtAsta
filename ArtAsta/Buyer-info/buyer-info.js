// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let submitBtn = document.getElementById('submit');
let buyer_name = document.getElementById('name');
let buyer_bio = document.getElementById('bio');
let buyer_email = document.getElementById('email');
let buyer_mobile = document.getElementById('mobile');
let buyer_address = document.getElementById('address');
let message = document.getElementById('message-field');


document.addEventListener('DOMContentLoaded', function () {

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            await addDoc(collection(db, "Buyer"), {
                Name: buyer_name.value,
                Bio: buyer_bio.value,
                Email: buyer_email.value,
                Mobile: buyer_mobile.value,
                Address: buyer_address.value
            });
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    
        document.getElementById("buyer_info_form").reset();
    
        // message.innerHTML = "";
        // message.innerHTML += `Data entered successfully.`
    });

});
