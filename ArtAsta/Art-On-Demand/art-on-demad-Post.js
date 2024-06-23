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
    const contentPost = document.getElementById('postContent');
    const titlePost = document.getElementById('title');
    const deadlinePost = document.getElementById('deadline');

    submitBtn.addEventListener('click', async function() {
        event.preventDefault();

        try {
            await addDoc(collection(db, "Post-Reverse"), {
                Title: titlePost.value, 
                Description: contentPost.value,
                Deadline: deadlinePost.value
            })
            console.log("successfull");
        } catch (error) {
            console.log("error")
        }
        form.reset();
    })
});