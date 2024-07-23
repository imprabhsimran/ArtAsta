import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.querySelector('input[type="submit"]');
    const artist_name = document.getElementById('name');
    const artist_bio = document.getElementById('bio');
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
                window.location.href = '/Homepage-dashboard/homepage.html';
            })
            .catch((error) => {
                console.error("Error creating artist document:", error);
            });

    }

    // Function to handle image upload and get the download URL
    async function uploadImage(fileInput) {
        if (!fileInput) return ''; 

        const filePath = `images/${fileInput.name}`;
        const fileRef = ref(storage, filePath);

        try {
            const snapshot = await uploadBytes(fileRef, fileInput);
            console.log('File uploaded successfully');

            const downloadURL = await getDownloadURL(fileRef);
            console.log('Download URL:', downloadURL);
            return downloadURL; 
        } catch (error) {
            console.error('Error uploading file:', error);
            return ''; 
        }
    }

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


    async function handleFormSubmission(e) {
        e.preventDefault();

        geolocationModal.style.display = 'block';

        allowLocationBtn.onclick = async function () {
            geolocationModal.style.display = 'none'; 
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async function (position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        console.log(`Latitude: ${ latitude }, Longitude: ${ longitude }`);
                        const profileUrl = await uploadImage(profileImageInput.files[0]); 
                        const artworkUrls = await uploadArtworks(artworkImagesInput.files); 
                        const user = auth.currentUser;
                        if (user) {
                            const userId = user.uid;
                            await submitFormData(userId, latitude, longitude, profileUrl, artworkUrls);
                        } else {
                            console.error('No user is currently signed in.');
                            alert('Please sign in again.');
                        }
                    },
                    async function (error) {
                        console.error("Error fetching geolocation: ", error);
                        const profileUrl = await uploadImage(profileImageInput.files[0]); 
                        const artworkUrls = await uploadArtworks(artworkImagesInput.files); 
                        const user = auth.currentUser;
                        if (user) {
                            const userId = user.uid;
                            await submitFormData(userId, null, null, profileUrl, artworkUrls); 
                        } else {
                            console.error('No user is currently signed in.');
                            alert('Please sign in again.');
                        }
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
                const profileUrl = await uploadImage(profileImageInput.files[0]); 
                const artworkUrls = await uploadArtworks(artworkImagesInput.files); 
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    await submitFormData(userId, null, null, profileUrl, artworkUrls); 
                } else {
                    console.error('No user is currently signed in.');
                    alert('Please sign in again.');
                }
            }
        };

        denyLocationBtn.onclick = async function () {
            geolocationModal.style.display = 'none'; 
            const profileUrl = await uploadImage(profileImageInput.files[0]); 
            const artworkUrls = await uploadArtworks(artworkImagesInput.files); 
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                await submitFormData(userId, null, null, profileUrl, artworkUrls); 
            } else {
                console.error('No user is currently signed in.');
                alert('Please sign in again.');
            }
        };
    }

    // Attach event listener for submit button
    submitBtn.addEventListener('click', handleFormSubmission);
});