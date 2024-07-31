import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

async function loadAuctionDetails(auctionId) {
    try {
        const postsContainer = document.getElementById('postsContainer');

        if (!postsContainer) {
            console.error('Element with ID "postsContainer" not found.');
            return;
        }

        if (!auctionId) {
            console.error('No auction ID provided.');
            return;
        }

        // Retrieve auction document
        const auctionRef = doc(db, "Auction", auctionId);
        const auctionDoc = await getDoc(auctionRef);

        if (!auctionDoc.exists()) {
            console.error(`Auction with ID ${auctionId} not found.`);
            return;
        }
        const auctionData = auctionDoc.data();
        console.log('Auction data:', auctionData);

        const artistRef = collection(db, 'Artist');
        const artistSnapshot = await getDocs(artistRef);

        let artistName = 'Unknown Artist';
        artistSnapshot.forEach(doc => {
            const artistData = doc.data();
            if (artistData.uid === auctionId) {
                artistName = artistData.Name || 'Unknown Artist';
            }
        });
        console.log(artistName);

        postsContainer.innerHTML = ''; // Clear previous content

        let params = new URLSearchParams(location.search);
        const getAucId = params.get('check');
        const getData = auctionData.auctions[getAucId];

        if (!getData) {
            console.error('Auction data not found for index:', getAucId);
            return;
        }

        const imageRef = ref(storage, getData.AuctionArtworkUrl);
        const imageUrl = await getDownloadURL(imageRef);

        const highestBidder = getData.offers && getData.offers.length > 0 ? getData.offers[getData.offers.length - 1] : null;

        const postElement = document.createElement('article');
        postElement.classList.add('auction-post');

        postElement.innerHTML = `
            <img src="${imageUrl}" alt="${getData.Title || 'No title'}">
            <div>
                <h2>${getData.Title || 'Untitled Post'}</h2>
                <p><strong>Artist:</strong> ${artistName || 'Unknown'}</p>
                <p><strong>Start Bid:</strong> $${getData.StartBid || 'N/A'}</p>
                <p><strong>Start Time:</strong> ${getData.StartTime || 'Unknown'}</p>
                <p><strong>Bid Duration:</strong> ${getData.BidDur || 'Soon'} days</p>
                <p><strong>Description:</strong> ${getData.Description || 'No description'}</p>
                <p><strong>Current Bid:</strong> $<span id="current-bid">${getData.CurrentBid || getData.StartBid || 'N/A'}</span></p>
                ${highestBidder ? `<p class="highest-bidder"><strong>Highest Bidder:</strong> ${highestBidder.UserName} (${highestBidder.email})</p>` : ''}
                <div class="bid-section">
                  <input type="number" id="bid-increment" placeholder="Enter bid increment" min="10" step="10" value="10">
                  <button id="place-bid-button">Place a Bid</button>
                  <p id="bid-message"></p>
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);

        // Add the event listener for the place bid button
        const placeBidButton = document.getElementById('place-bid-button');
        placeBidButton.addEventListener('click', () => {
            placeBid(auctionId, getAucId);
        });

    } catch (error) {
        console.error('Error loading auction details:', error);
    }
}

async function placeBid(auctionId, auctionIndex) {
    const bidIncrementInput = document.getElementById('bid-increment');
    const bidMessage = document.getElementById('bid-message');
    const increment = parseFloat(bidIncrementInput.value);

    if (isNaN(increment) || increment <= 0) {
        bidMessage.textContent = 'Please enter a valid bid increment.';
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            bidMessage.textContent = 'You must be signed in to place a bid.';
            return;
        }

        const enthusiastRef = collection(db, 'Art-enthusiast');
        const querySnapshot = await getDocs(enthusiastRef);

        let currentUserId = user.uid;
        let currentUserName = 'Unknown User';

        querySnapshot.forEach((doc) => {
            const enthusiastData = doc.data();
            if (enthusiastData.uid === currentUserId) {
                currentUserName = enthusiastData.Name || 'Unknown User';
                console.log(`User found: ${currentUserName}`); // Debug log
            }
        });

        const auctionDocRef = doc(db, "Auction", auctionId);
        const auctionDoc = await getDoc(auctionDocRef);

        if (!auctionDoc.exists()) {
            console.error('No such document!');
            return;
        }

        const auctionData = auctionDoc.data();
        const auction = auctionData.auctions[auctionIndex];
        const currentBid = parseFloat(auction.CurrentBid || auction.StartBid);
        const newBid = currentBid + increment;

        auctionData.auctions[auctionIndex].CurrentBid = newBid;

        const newOffer = {
            UserId: currentUserId,
            UserName: currentUserName,
            bidAmount: newBid,
            email: user.email
        };

        if (!auctionData.auctions[auctionIndex].offers) {
            auctionData.auctions[auctionIndex].offers = [];
        }

        auctionData.auctions[auctionIndex].offers.push(newOffer);

        await updateDoc(auctionDocRef, { auctions: auctionData.auctions });

        document.getElementById('current-bid').textContent = newBid.toFixed(2);
        bidMessage.textContent = 'Bid placed successfully!';

        bidIncrementInput.value = ''; // Clear the input field

        // Update highest bidder display
        updateHighestBidderDisplay(newOffer.UserName, newOffer.email);

        // Show modal with the highest bidder's name
        showModal(`Bid placed successfully! The highest bidder is now: ${newOffer.UserName}`);

    } catch (error) {
        console.error('Error placing bid:', error);
        bidMessage.textContent = 'Error placing bid. Please try again.';
    }
}

function updateHighestBidderDisplay(name, email) {
    const highestBidderElement = document.querySelector('.highest-bidder');
    if (highestBidderElement) {
        highestBidderElement.innerHTML = `<strong>Highest Bidder:</strong> ${name} (${email})`;
    } else {
        const newBidderInfo = document.createElement('p');
        newBidderInfo.classList.add('highest-bidder');
        newBidderInfo.innerHTML = `<strong>Highest Bidder:</strong> ${name} (${email})`;
        document.querySelector('.auction-post div').appendChild(newBidderInfo);
    }
}

function showModal(message) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" id="closeModal">&times;</span>
            <p id="modal-message">${message}</p>
            <button id="modal-ok-button" class="ok-button">OK</button>
        </div>
    `;

    // Append modal to body
    document.body.appendChild(modal);

    // Show the modal
    modal.style.display = "block";

    // Close the modal when the close button or OK button is clicked
    const closeModal = document.getElementById('closeModal');
    const okButton = document.getElementById('modal-ok-button');

    closeModal.onclick = () => { modal.style.display = "none"; document.body.removeChild(modal); };
    okButton.onclick = () => { modal.style.display = "none"; document.body.removeChild(modal); };

    // Close the modal when user clicks outside of the modal
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.removeChild(modal);
        }
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('id');
    const auctionIndex = urlParams.get('check');

    console.log('Current URL:', window.location.href);
    console.log('Extracted auctionId:', auctionId);
    console.log('Extracted auctionIndex:', auctionIndex);

    if (auctionId && auctionIndex !== null) {
        await loadAuctionDetails(auctionId);
    } else {
        console.error('No auction ID or index found in URL');
    }
});