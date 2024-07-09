import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDocs, getDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Art Asta's Firebase configuration
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
// let auctionId;

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

        const auctionRef = doc(db, "Auction", auctionId);
        const auctionDoc = await getDoc(auctionRef);

        if (!auctionDoc.exists()) {
            console.error(`Auction with ID ${auctionId} not found.`);
            return;
        }

        const auctionData = auctionDoc.data();
        console.log('Auction data:', auctionData);

        postsContainer.innerHTML = ''; // Clear previous content

        if (auctionData && auctionData.auctions && Array.isArray(auctionData.auctions)) {
            auctionData.auctions.forEach(async (auctionItem) => {
                const imageUrl = await storage.ref().child(auctionItem.AuctionArtworkUrl).getDownloadURL();

                const postElement = document.createElement('article');
                postElement.classList.add('auction-post'); // Add a class for styling

                postElement.innerHTML = `
                    <img src="${imageUrl}" alt="${auctionItem.Title || 'No title'}">
                    <div>
                        <h2>${auctionItem.Title || 'Untitled Post'}</h2>
                        <p><strong>Start Bid:</strong> $${auctionItem.StartBid || 'N/A'}</p>
                        <p><strong>Bid Duration:</strong> ${auctionItem.BidDur || 'N/A'} days</p>
                        <p><strong>Description:</strong> ${auctionItem.Description || 'No description'}</p>
                    </div>
                `;

                postsContainer.appendChild(postElement);
            });
        } else {
            console.error('No valid auctions array found in auction data.');
        }
    } catch (error) {
        console.error('Error loading auction details:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('docId');
    
    if (auctionId) {
        await loadAuctionDetails(auctionId);
    } else {
        console.error('No auction ID found in URL');
    }

    const placeBidButton = document.getElementById('place-bid-button');
    if (placeBidButton) {
        placeBidButton.addEventListener('click', () => {
            placeBid().then(() => {
                // Redirect to a new page with auction details after placing bid
                window.location.href = `/Auction-details/auction-details.html?docId=${auctionId}`;
            });
        });
    } else {
        console.error('Element with ID "place-bid-button" not found.');
    }
});




// async function loadAuctionDetails() {
//     try {
//         const postsContainer = document.getElementById('postsContainer');
        
//         if (!postsContainer) {
//             console.error('Element with ID "postsContainer" not found.');
//             return;
//         }

//         if (!auctionId) {
//             console.error('No auction ID provided.');
//             return;
//         }

//         const auctionRef = doc(db, "Auction", auctionId);
//         const auctionDoc = await getDoc(auctionRef);

//         const artistRef = doc(db, "Artist", auctionId);
//         const artistDoc = await getDoc(artistRef);

//         if (!auctionDoc.exists()) {
//             console.error(`Auction with ID ${auctionId} not found.`);
//             return;
//         }

//         const auctionData = auctionDoc.data();
//         const artistData = artistDoc.data();
//         console.log('Auction data:', auctionData);
//         console.log('Artist data:', artistData);
//         console.log('AuctionId',auctionId);


//         postsContainer.innerHTML = ''; // Clear previous content

//         if (auctionData && auctionData.auctions && Array.isArray(auctionData.auctions)) {
//             for (let i = 0; i < auctionData.auctions.length; i++) {
//                 const auctionItem = auctionData.auctions[i];
//                 // const artistDocId = auctionItem.artistDocId; // Replace with actual field name

//                 console.log("ai",auctionItem);

//                 // Fetch the artist document using artistDocId
//                 // if(artistDocId)
//                 if (auctionId) {
//                     const artistDocRef = doc(db, "Artist",);
//                     const artistDocSnap = await getDoc(artistDocRef);

//                     console.log(artistDocId,">>>>")
//                     if (artistDocSnap.exists()) {
//                         const artistData = artistDocSnap.data();
//                         const artistName = artistData.Name || 'Unknown Artist';
//                         const imageUrl = await storage.ref().child(auctionItem.AuctionArtworkUrl).getDownloadURL();

//                         const postElement = document.createElement('article');
//                         postElement.classList.add('auction-post'); // Add a class for styling

//                         postElement.innerHTML = `
//                             <img src="${imageUrl}" alt="${auctionItem.Title || 'No title'}">
//                             <div>
//                                 <h2>${auctionItem.Title || 'Untitled Post'}</h2>
//                                 <p><strong>Artist:</strong> ${artistName}</p>
//                                 <p><strong>Start Bid:</strong> $${auctionItem.StartBid || 'N/A'}</p>
//                                 <p><strong>Bid Duration:</strong> ${auctionItem.BidDur || 'N/A'} days</p>
//                                 <p><strong>Description:</strong> ${auctionItem.Description || 'No description'}</p>
//                             </div>
//                         `;

//                         postsContainer.appendChild(postElement);
//                     } else {
//                         console.error(`Artist document not found for Artist ID: ${artistDocId}`);
//                     }
//                 } else {
//                     console.error(`Artist document ID not found in auction data.`);
//                 }
//             }
//         } else {
//             console.error('No valid auctions array found in auction data.');
//         }
//     } catch (error) {
//         console.error('Error loading auction details:', error);
//     }
// }




// document.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     auctionId = urlParams.get('docId');
    
//     if (auctionId) {
//         loadAuctionDetails();
//     } else {
//         console.error('No auction ID found in URL');
//     }

//     const placeBidButton = document.getElementById('place-bid-button');
//     if (placeBidButton) {
//         placeBidButton.addEventListener('click', () => {
//             placeBid().then(() => {
//                 // Redirect to a new page with auction details after placing bid
//                 window.location.href = `/Auction-details/auction-details.html?docId=${auctionId}`;
//             });
//         });
//     } else {
//         console.error('Element with ID "place-bid-button" not found.');
//     }
// });

