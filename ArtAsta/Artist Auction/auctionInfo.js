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
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const startBid = document.getElementById("starting-bid");
    const duration = document.getElementById("duration");
    const startTime = document.getElementById("start-time");
    const postButton = document.querySelector(".post-button");
    const form = document.getElementById("auction-form");

    postButton.addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            // Add a new document with a generated ID
            await addDoc(collection(db, "Auction"), {
                Title: title.value,
                Description: description.value,
                StartBid: startBid.value,
                BidDur: duration.value,
                StartTime: startTime.value,
            });
            console.log("Document successfully written!");
            // Optionally, clear the form after submission
            form.reset();
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    });
});
