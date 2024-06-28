import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.querySelector('input[type="submit"]');
    const contentPost = document.getElementById('postContent');
    const titlePost = document.getElementById('title');
    const deadlinePost = document.getElementById('deadline');
    const postImage = document.getElementById('postImage');
    const form = document.querySelector('form');

    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault();

        let imageUrl = '';
        if (postImage.files.length > 0) {
            imageUrl = await uploadImage(postImage.files[0]);
        }

        try {
            await addDoc(collection(db, "Art-on-demand"), {
                Title: titlePost.value,
                Description: contentPost.value,
                Deadline: deadlinePost.value,
                ImageUrl: imageUrl // Add image URL to Firestore document
            });
            console.log("Document successfully added");
            form.reset();
        } catch (error) {
            console.error("Error adding document:", error);
        }
    });

    async function uploadImage(file) {
        const filePath = `images/${file.name}`; // Path within the storage bucket
        const fileRef = ref(storage, filePath);

        try {
            // Upload file to Firebase Storage
            const snapshot = await uploadBytes(fileRef, file);
            console.log('File uploaded successfully');

            // Get download URL of the uploaded file
            const downloadURL = await getDownloadURL(fileRef);
            console.log('Download URL:', downloadURL);
            return downloadURL; // Return the download URL
        } catch (error) {
            console.error('Error uploading file:', error);
            return ''; // Return empty string on error
        }
    }
});