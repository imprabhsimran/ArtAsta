// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Art Asta's Firebase configuration
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
    const artist_name = document.getElementById('name');
    const artist_bio = document.getElementById('bio');
    const artist_email = document.getElementById('email');
    const artist_address = document.getElementById('address');
    const profession = document.getElementById('profession');
    const artcategory = document.getElementById('artcategory');
    const postImage = document.getElementById('postImage');
    const form = document.querySelector('form');
    const profileImagePreview = document.getElementById('profileImagePreview'); // Image preview element
    const geolocationModal = document.getElementById('geolocationModal'); // Modal for geolocation
    const allowLocationBtn = document.getElementById('allowLocation');
    const denyLocationBtn = document.getElementById('denyLocation');

    // Function to collect and submit form data
    async function submitFormData(latitude = null, longitude = null, ProfileUrl = '') {
        try {
            const docRef = await addDoc(collection(db, "Artist"), {
                Name: artist_name.value,
                Bio: artist_bio.value,
                Email: artist_email.value,
                Address: artist_address.value,
                Profession: profession.value,
                ArtCategory: artcategory.value,
                ...(latitude && longitude ? { Geolocation: { latitude, longitude, timestamp: new Date() } } : {}),
                ProfileUrl: ProfileUrl
            });
            console.log("Document successfully written with ID: ", docRef.id);
            form.reset();
            // Show the uploaded profile image
            if (profileImagePreview) {
                profileImagePreview.src = ProfileUrl;
                profileImagePreview.style.display = 'block';
            }
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    }

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
        // Show the custom geolocation modal
        geolocationModal.style.display = 'block';

        // Handle user response to geolocation prompt
        allowLocationBtn.onclick = async function () {
            geolocationModal.style.display = 'none'; // Hide modal
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async function (position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                        const ProfileUrl = await uploadImage(); // Handle image upload
                        await submitFormData(latitude, longitude, ProfileUrl); // Submit with geolocation and image URL
                    },
                    async function (error) {
                        console.error("Error fetching geolocation: ", error);
                        const ProfileUrl = await uploadImage(); // Handle image upload
                        await submitFormData(null, null, ProfileUrl); // Submit without geolocation but with image URL
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
                const ProfileUrl = await uploadImage(); // Handle image upload
                await submitFormData(null, null, ProfileUrl); // Submit without geolocation but with image URL
            }
        };

        denyLocationBtn.onclick = async function () {
            geolocationModal.style.display = 'none'; // Hide modal
            const ProfileUrl = await uploadImage(); // Handle image upload
            await submitFormData(null, null, ProfileUrl); // Submit without geolocation but with image URL
        };
    }

    // Attach event listener for submit button
    submitBtn.addEventListener('click', handleFormSubmission);
});