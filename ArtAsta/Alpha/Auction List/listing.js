import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"; // Import getStorage and necessary functions

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

async function loadData() {
    try {
        const snapshot = await getDocs(collection(db, "Auction"));
        const postsContainer = document.getElementById('postsnewContainer');

        for (const doc of snapshot.docs) {
            const postData = doc.data();
            console.log('Retrieved data:', postData); // Debug log

            // Use AuctionArtworkUrl field to get the image URL from Firebase Storage
            const imageUrl = await getDownloadURL(ref(storage, postData.AuctionArtworkUrl))
                .catch(error => {
                    console.log('Error fetching image:', error);
                    return 'placeholder.jpg'; // Fallback image
                });
            console.log('Image URL:', imageUrl); // Debug log

            const postElement = document.createElement('article');
            postElement.innerHTML = `
                <img src="${imageUrl}" alt="${postData.Title || 'No title'}">
                <div>
                <h2>${postData.Title || 'Untitled Post'}</h2>
                <p><strong>Artist:</strong> ${postData.Name || 'Unknown'}</p>
                <p><strong>Start Time:</strong> ${postData.StartTime || 'Unknown'}</p>
                <p><strong>Current Bid:</strong> $${postData.StartBid || 'N/A'}</p>
                <p><strong>Bid Duration:</strong> ${postData.BidDur || 'N/A'} days</p>
                <p><strong>Description:</strong> ${postData.Description || 'No description'}</p>
                <button class="bid-button" data-id="${doc.id}">Place a Bid</button>
                </div>
            `;

            postsContainer.appendChild(postElement);
        }

        // Add event listeners to the bid buttons
        const bidButtons = document.querySelectorAll('.bid-button');
        bidButtons.forEach(button => {
            button.addEventListener('click', event => {
                const auctionId = event.target.getAttribute('data-id');
                window.location.href = `../auction-details/auction-details.html?id=${auctionId}`;
            });
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle View';
    toggleButton.style.margin = '1rem';
    document.body.insertBefore(toggleButton, document.body.firstChild);

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('grid-view');
        document.body.classList.toggle('list-view');
    });

    document.body.classList.add('grid-view');
});