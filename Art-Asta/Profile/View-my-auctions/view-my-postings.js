import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, getDocs, collection, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', async function () {
    const auctionsContainer = document.getElementById('auctionsContainer');

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.uid;
            try {
                // Directly reference a specific document in the Auctions collection
                const auctionDocRef = doc(db, 'Auction', userId);
                const auctionDocSnap = await getDoc(auctionDocRef);

                auctionsContainer.innerHTML = ''; // Clear previous content

                if (auctionDocSnap.exists()) {
                    const auctionData = auctionDocSnap.data();
                    const auctionsArray = auctionData.auctions || []; // Adjust field name if needed

                    auctionsArray.forEach((item) => {
                        const auctionElement = createAuctionElement(item);
                        auctionsContainer.appendChild(auctionElement);
                    });
                } else {
                    console.log('No auction data found for the current user.');
                }

            } catch (error) {
                console.error('Error fetching auction data:', error);
            }
        } else {
            console.error("User not logged in.");
        }
    });

    function createAuctionElement(auctionItem) {
        const auctionElement = document.createElement('div');
        auctionElement.classList.add('auction-post');

        auctionElement.innerHTML = `
            <h2>${auctionItem.Title || 'Untitled Auction'}</h2>
            <p><strong>Description:</strong> ${auctionItem.Description || 'No description available.'}</p>
            ${auctionItem.AuctionArtworkUrl ? `<img src="${auctionItem.AuctionArtworkUrl}" alt="Auction Image" width="300">` : ''}
            <p><strong>Starting Bid:</strong> ${auctionItem.StartBid || 'Not specified'}</p>
            <p><strong>Bidding Duration:</strong> ${auctionItem.BidDur || 'Not specified'} days</p>
            <p><strong>Start Time:</strong> ${auctionItem.StartTime || 'Not specified'}</p>
            <!-- Add more details as needed -->
        `;

        return auctionElement;
    }
});