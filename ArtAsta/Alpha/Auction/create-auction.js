import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';


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
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const startBid = document.getElementById("starting-bid");
    const duration = document.getElementById("duration");
    const startTime = document.getElementById("start-time");
    const postButton = document.querySelector(".post-button");
    const form = document.getElementById("auction-form");
    const postImage = document.getElementById('photo');
    const fileNameDisplay = document.getElementById('fileNameDisplay');


    // Function to handle image upload and get the download URL
    async function uploadImage() {
        const fileInput = postImage.files[0]; // Get the selected file
        if (!fileInput) return ''; // Return empty string if no file selected

        const filePath = `images/${fileInput.name}`; // Path within the storage bucket
        const fileRef = ref(storage, filePath);

        try {
            // Upload file to Firebase Storage
            const snapshot = await uploadBytes(fileRef, fileInput);
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

    // Function to handle form submission
    async function handleFormSubmission(e) {
        e.preventDefault();
        try {
            // Upload the image and get the URL
            const AuctionArtworkUrl = await uploadImage();

            // Add a new document with a generated ID
            await addDoc(collection(db, "Auction"), {
                Title: title.value,
                Description: description.value,
                StartBid: startBid.value,
                BidDur: duration.value,
                StartTime: startTime.value,
                AuctionArtworkUrl: AuctionArtworkUrl // Store the image URL
            });
            console.log("Document successfully written!");

            // Optionally, clear the form after submission
            form.reset();
            fileNameDisplay.innerHTML = '';
            
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    }

    // Function to handle file input change and show file name
    function showFileName() {
        const file = postImage.files[0]; // Get the selected file
        if (file) {
            fileNameDisplay.textContent = `Selected file: ${file.name}`; // Set the file name
        } else {
            fileNameDisplay.textContent = ''; // Clear the display if no file is selected
        }
    }

    // Attach event listener for submit button
    postButton.addEventListener('click', handleFormSubmission);
    // Attach event listener for file input change
    postImage.addEventListener('change', showFileName);
});