import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Art Asta's Firebase configuration
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
const storage = getStorage(app);

let auctionId;

async function loadAuctionDetails() {
    try {
        const auctionDoc = await getDoc(doc(db, "Auction", auctionId));
        if (!auctionDoc.exists()) {
            console.error('No such document!');
            return;
        }
        const auctionData = auctionDoc.data();
        console.log('Auction data:', auctionData);

        const imageUrl = await getDownloadURL(ref(storage, auctionData.AuctionArtworkUrl))
            .catch(error => {
                console.log('Error fetching image:', error);
                return 'placeholder.jpg'; // Fallback image
            });
        console.log('Image URL:', imageUrl);

        document.getElementById('title').textContent = auctionData.Title || 'Untitled Post';
        document.getElementById('artwork').src = imageUrl;
        document.getElementById('artist').textContent = auctionData.Artist || 'Unknown';
        document.getElementById('start-time').textContent = auctionData.StartTime || 'Unknown';
        document.getElementById('current-bid').textContent = auctionData.CurrentBid || auctionData.StartBid || 'N/A';
        document.getElementById('bid-duration').textContent = auctionData.BidDur || 'N/A';
        document.getElementById('description').textContent = auctionData.Description || 'No description';
    } catch (error) {
        console.error('Error loading auction details:', error);
    }
}

async function placeBid() {
    const bidIncrementInput = document.getElementById('bid-increment');
    const bidMessage = document.getElementById('bid-message');
    const increment = parseFloat(bidIncrementInput.value);

    if (isNaN(increment) || increment <= 0) {
        bidMessage.textContent = 'Please enter a valid bid increment.';
        return;
    }

    try {
        const auctionDocRef = doc(db, "Auction", auctionId);
        const auctionDoc = await getDoc(auctionDocRef);

        if (!auctionDoc.exists()) {
            console.error('No such document!');
            return;
        }

        const auctionData = auctionDoc.data();
        const currentBid = parseFloat(auctionData.CurrentBid || auctionData.StartBid);
        const newBid = currentBid + increment;

        await updateDoc(auctionDocRef, { CurrentBid: newBid });

        document.getElementById('current-bid').textContent = newBid.toFixed(2);
        bidMessage.textContent = 'Bid placed successfully!';

        bidIncrementInput.value = ''; // Clear the input field
    } catch (error) {
        console.error('Error placing bid:', error);
        bidMessage.textContent = 'Error placing bid. Please try again.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    auctionId = urlParams.get('id');
    if (auctionId) {
        loadAuctionDetails();
    } else {
        console.error('No auction ID found in URL');
    }

    document.getElementById('place-bid-button').addEventListener('click', placeBid);
});