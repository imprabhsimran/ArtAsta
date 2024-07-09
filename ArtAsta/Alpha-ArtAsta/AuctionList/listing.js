import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

async function loadData() {
    try {
        const snapshot = await getDocs(collection(db, "Auction"));
        const postsContainer = document.getElementById('postsnewContainer');
        postsContainer.innerHTML = ''; // Clear previous content

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (Array.isArray(data.auctions)) {
                for (const auction of data.auctions) {
                    console.log('Retrieved auction data:', auction);

                    const imageUrl = await getDownloadURL(ref(storage, auction.AuctionArtworkUrl))
                        .catch(error => {
                            console.log('Error fetching image:', error);
                            return 'placeholder.jpg';
                        });
                    console.log('Image URL:', imageUrl);

                    const postElement = document.createElement('article');
                    postElement.innerHTML = `
                        <img src="${imageUrl}" alt="${auction.Title || 'No title'}">
                        <div>
                            <h2>${auction.Title || 'Untitled Post'}</h2>
                            <p><strong>Artist:</strong> ${auction.Name || 'Unknown'}</p>
                            <p><strong>Start Time:</strong> ${auction.StartTime || 'Unknown'}</p>
                            <p><strong>Current Bid:</strong> $${auction.StartBid || 'N/A'}</p>
                            <p><strong>Bid Duration:</strong> ${auction.BidDur || 'N/A'} days</p>
                            <p><strong>Description:</strong> ${auction.Description || 'No description'}</p>
                            <button class="bid-button" data-doc-id="${doc.id}" data-auction-index="${data.auctions.indexOf(auction)}">Place a Bid</button>
                        </div>
                    `;

                    postsContainer.appendChild(postElement);
                }
            } else {
                console.warn('No auctions array found in document:', doc.id);
            }
        }


        setTimeout(() => {
            const bidButtons = document.querySelectorAll('.bid-button');
            bidButtons.forEach(button => {
                button.addEventListener('click', event => {
                    const auctionId = event.target.getAttribute('data-doc-id');
                    const auctionIndex = event.target.getAttribute('data-auction-index');
                    window.location.href = `/Auction-details/auction-details.html?docId=${auctionId}&auctionIndex=${auctionIndex}`;
                });
            });
        }, 1000);

    } catch (error) {
        console.log('Error loading data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle View'; 
    toggleButton.style.margin = '1rem'; 

    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', toggleButton);
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('grid-view');
        document.body.classList.toggle('list-view');
    });
    document.body.classList.add('grid-view');
});

