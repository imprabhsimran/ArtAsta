import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, getDoc, doc, updateDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', async function () {
    const auctionsContainer = document.getElementById('auctionsContainer');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.uid;
            const auctionDocRef = doc(db, 'Auction', userId);

            try {
                const auctionDocSnap = await getDoc(auctionDocRef);
                renderAuctions(auctionDocSnap); 

                onSnapshot(auctionDocRef, (doc) => {
                    renderAuctions(doc); 
                });

            } catch (error) {
                console.error('Error fetching auction data:', error);
            }
        } else {
            console.error("User not logged in.");
        }
    });

    function renderAuctions(doc) {
        if (doc && doc.exists()) {
            const auctionData = doc.data();
            const auctionsArray = auctionData.auctions || [];

            auctionsContainer.innerHTML = ''; 

            auctionsArray.forEach((item, index) => {
                const auctionElement = createAuctionElement(item, index);
                auctionsContainer.appendChild(auctionElement);
            });

            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', async function (e) {
                    e.preventDefault();
                    const postId = e.target.getAttribute('data-post-id');
                    const postIndex = e.target.getAttribute('data-post-index');
                    console.log(`Deleting post with ID: ${postId} at index: ${postIndex}`);
                    await delete_post(postId, postIndex);
                });
            });

        } else {
            console.log('No auction data found for the current user.');
        }
    }

    function createAuctionElement(auctionItem, index) {
        const auctionElement = document.createElement('div');
        auctionElement.classList.add('auction-post');

        auctionElement.innerHTML = `
            <h2>${auctionItem.Title || 'Untitled Auction'}</h2>
            
            ${auctionItem.AuctionArtworkUrl ? `<img src="${auctionItem.AuctionArtworkUrl}" alt="Auction Image" width="300">` : ''}
            <p><strong>Description:</strong> ${auctionItem.Description || 'No description available.'}</p>
            <p><strong>Starting Bid:</strong> ${auctionItem.StartBid || 'Not specified'}</p>
            <p><strong>Bidding Duration:</strong> ${auctionItem.BidDur || 'Not specified'} days</p>
            <p><strong>Start Time:</strong> ${auctionItem.StartTime || 'Not specified'}</p>
            <i class="fa-solid fa-trash-can delete-btn" data-post-id="${auctionItem.id}" data-post-index="${index}"></i>
        `;

        return auctionElement;
    }

    async function delete_post(postId, postIndex) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error("User is not logged in");
                return;
            }

            const currentArtistId = currentUser.uid;
            console.log(`Current artist ID: ${currentArtistId}`);
            console.log(`Post ID to delete: ${postId}`);

            const postRef = doc(db, 'Auction', currentArtistId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const auctions = postSnap.data().auctions || [];
                console.log(`Auctions before deletion: ${JSON.stringify(auctions)}`);
                auctions.splice(postIndex, 1);  
                console.log(`Auctions after deletion: ${JSON.stringify(auctions)}`);

                await updateDoc(postRef, { auctions });

                console.log("Auction deleted successfully");
            } else {
                console.log("No such document in Auctions!");
            }
        } catch (error) {
            console.error("Error deleting auction:", error);
        }
    }
});

