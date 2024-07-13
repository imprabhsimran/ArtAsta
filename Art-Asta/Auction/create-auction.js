import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDu1mNebskATIVQmz59QosBS1AhdMAkxqM",
    authDomain: "art-asta-50475.firebaseapp.com",
    projectId: "art-asta-50475",
    storageBucket: "art-asta-50475.appspot.com",
    messagingSenderId: "343332230219",
    appId: "1:343332230219:web:efe5a85c164e5e461c69ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize Firebase
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
    let user_id;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            user_id = user.uid;
            console.log(user.uid);
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });

    async function uploadImage() {
        const fileInput = postImage.files[0];
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

    async function handleFormSubmission(e) {
        e.preventDefault();
        try {
            const AuctionArtworkUrl = await uploadImage();

            const auctionData = {
                Title: title.value,
                Description: description.value,
                StartBid: startBid.value,
                BidDur: duration.value,
                StartTime: startTime.value,
                AuctionArtworkUrl: AuctionArtworkUrl,
            };

            const auctionRef = doc(db, "Auction", user_id);
            const auctionDoc = await getDoc(auctionRef);

            if (auctionDoc.exists()) {
                // Document exists, update it
                await updateDoc(auctionRef, {
                    auctions: arrayUnion(auctionData)
                });
                console.log("Auction added to user's document!");
            } else {
                // Document does not exist, create it
                await setDoc(auctionRef, {
                    auctions: [auctionData] // Initialize with an array containing the first auction
                });
                console.log("Auction document created successfully!");
            }

            window.location.href = '/AuctionList/listing.html';

            // Optionally, clear the form after submission
            form.reset();
            fileNameDisplay.innerHTML = '';

        } catch (error) {
            console.error("Error writing document: ", error);
        }
    }

    function showFileName() {
        const file = postImage.files[0];
        if (file) {
            fileNameDisplay.textContent = `Selected file: ${file.name}`;
        } else {
            fileNameDisplay.textContent = '';
        }
    }

    postButton.addEventListener('click', handleFormSubmission);
    postImage.addEventListener('change', showFileName);
});