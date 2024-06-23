// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {

    const submitBtn = document.querySelector('input[type="submit"]');
    const buyer_name = document.getElementById('name');
    const buyer_bio = document.getElementById('bio');
    const buyer_email = document.getElementById('email');
    const buyer_address = document.getElementById('address');
    const profession = document.getElementById('profession');
    const artcategory = document.getElementById('artcategory');

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            // Add a new document with a generated ID
            await addDoc(collection(db, "Artist"), {
                Name: buyer_name.value,
                Bio: buyer_bio.value,
                Email: buyer_email.value,
                Address: buyer_address.value,
                Profession: profession.value,
                ArtCategory: artcategory.value
            });
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }
        // Optionally, clear the form after submission
        form.reset();
    });
});
