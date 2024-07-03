// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.querySelector('input[type="submit"]');
    const artist_name = document.getElementById('name');
    const artist_bio = document.getElementById('bio');
    //const artist_email = document.getElementById('email');
    let emailpp = " "
    const artist_address = document.getElementById('address');
    const profession = document.getElementById('profession');
    const artcategory = document.getElementById('artcategory');
    const profileImageInput = document.getElementById('profileImage');
    const artworkImagesInput = document.getElementById('artworkImages');
    const form = document.querySelector('form');
    const geolocationModal = document.getElementById('geolocationModal'); // Modal for geolocation
    const allowLocationBtn = document.getElementById('allowLocation');
    const denyLocationBtn = document.getElementById('denyLocation');
    const user = auth.currentUser;
    let user_id;
    auth.onAuthStateChanged((user) => {
        if (user) {
            let userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
              if (userDocSnap.exists()) {
                let userData = userDocSnap.data();
                    console.log("User data:", userData);
                    emailpp = userData.email;  
                    console.log("Email:", emailpp);
              } else {
                console.log("No such document in users!");
              }
            }).catch((error) => {
              console.error("Error getting user document:", error);
            });

            user_id = user.uid;
            console.log(user.uid);
            // Event listeners for role selection
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }

    });
    
    // Function to collect and submit form data
    async function submitFormData(user_id, latitude = null, longitude = null, profileUrl = '', artworkUrls = []) {
        const artistData = {
            uid: user_id,
            Name: artist_name.value,
            Bio: artist_bio.value,
            Address: artist_address.value,
            Email: emailpp,
            Profession: profession.value,
            ArtCategory: artcategory.value,
            Geolocation: (latitude && longitude) ? { latitude, longitude, timestamp: new Date() } : null,
            ProfileUrl: profileUrl,
            ArtworkUrls: artworkUrls
        };
        const artistRef = doc(db, "Artist", user_id);
        setDoc(artistRef, artistData)
            .then(() => {
                console.log("Artist document created successfully!");
            })
            .catch((error) => {
                console.error("Error creating artist document:", error);
            });
    }

    // Function to handle image upload and get the download URL
    async function uploadImage(fileInput) {
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

    // Function to handle multiple artwork uploads and get their download URLs
    async function uploadArtworks(files) {
        const artworkUrls = [];
        for (const file of files) {
            const downloadURL = await uploadImage(file);
            if (downloadURL) {
                artworkUrls.push(downloadURL);
            }
        }
        return artworkUrls;
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
                        const profileUrl = await uploadImage(profileImageInput.files[0]); // Handle profile image upload
                        const artworkUrls = await uploadArtworks(artworkImagesInput.files); // Handle artwork uploads
                        const user = auth.currentUser;
                        if (user) {
                            const userId = user.uid;
                            await submitFormData(userId, latitude, longitude, profileUrl, artworkUrls); // Submit with geolocation, profile image, and artwork URLs
                        } else {
                            console.error('No user is currently signed in.');
                            alert('Please sign in again.');
                            window.location.href = '/Homepage-dashboard/homepage.html';
                        }
                    },
                    async function (error) {
                        console.error("Error fetching geolocation: ", error);
                        const profileUrl = await uploadImage(profileImageInput.files[0]); // Handle profile image upload
                        const artworkUrls = await uploadArtworks(artworkImagesInput.files); // Handle artwork uploads
                        const user = auth.currentUser;
                        if (user) {
                            const userId = user.uid;
                            await submitFormData(userId, null, null, profileUrl, artworkUrls); // Submit without geolocation but with profile image and artwork URLs
                        } else {
                            console.error('No user is currently signed in.');
                            alert('Please sign in again.');
                            window.location.href = '/Homepage-dashboard/homepage.html';
                        }
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
                const profileUrl = await uploadImage(profileImageInput.files[0]); // Handle profile image upload
                const artworkUrls = await uploadArtworks(artworkImagesInput.files); // Handle artwork uploads
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    await submitFormData(userId, null, null, profileUrl, artworkUrls); // Submit without geolocation but with profile image and artwork URLs
                } else {
                    console.error('No user is currently signed in.');
                    alert('Please sign in again.');
                    window.location.href = '/Homepage-dashboard/homepage.html';
                }
            }
        };

        denyLocationBtn.onclick = async function () {
            geolocationModal.style.display = 'none'; // Hide modal
            const profileUrl = await uploadImage(profileImageInput.files[0]); // Handle profile image upload
            const artworkUrls = await uploadArtworks(artworkImagesInput.files); // Handle artwork uploads
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                await submitFormData(userId, null, null, profileUrl, artworkUrls); // Submit without geolocation but with profile image and artwork URLs
            } else {
                console.error('No user is currently signed in.');
                alert('Please sign in again.');
                window.location.href = '/Homepage-dashboard/homepage.html';
            }
        };
    }

    // Attach event listener for submit button
    submitBtn.addEventListener('click', handleFormSubmission);
});