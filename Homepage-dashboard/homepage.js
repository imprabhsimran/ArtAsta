import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../firebaseConfig.js';

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                let userDocRef = doc(db, "Users", user.uid);
                let userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    let userData = userDocSnap.data();
                    console.log("User data:", userData);

                    if (userData.role) {
                        const greetingLine = document.createElement('p');
                        greetingLine.textContent = `Hi, ${userData.role}`;
                        const roleContainer = document.getElementById('role-container');
                        roleContainer.appendChild(greetingLine);

                        auctionloadData(userData.role);
                    } else {
                        console.log('No valid role found for the user.');
                    }
                } else {
                    console.log('No valid role found for the user.');
                }
            } catch (error) {
                console.error("Error getting user document:", error);
            }
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });

    // Search functionality
   

    // Load initial data
    artistloadData();
    artOnDemandloadData();
    setupSearch();
});

// Function to perform the search\
function filterItems(query, containerId, itemSelector) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll(itemSelector);

    items.forEach(item => {
        const title = item.querySelector('h2').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function setupSearch() {
    const searchField = document.getElementById('search-field');

    searchField.addEventListener('input', () => {
        const query = searchField.value;

        filterItems(query, 'auctions', 'article');
        filterItems(query, 'artists', 'article');
        filterItems(query, 'art-on-demand', 'article');
    });
}



function auctionloadData(userRole) {
    try {
        const auctionContainer = document.getElementById('auctions');
        auctionContainer.innerHTML = ''; 

        onSnapshot(collection(db, "Auction"), (snapshot) => {
            auctionContainer.innerHTML = ''; // Clear existing items

            let items = [];
            let numToDisplay = 4;

            snapshot.forEach(async auctionDoc => {
                const auctionDocData = auctionDoc.data();
                if (!auctionDocData || !Array.isArray(auctionDocData.auctions)) {
                    console.error('Invalid data or missing auctions array in document:', auctionDoc.id);
                    return;
                }

                const artistDocRef = doc(db, "Artist", auctionDoc.id);
                const artistDocSnap = await getDoc(artistDocRef);
                const artistName = artistDocSnap.exists() ? artistDocSnap.data().Name : 'Unknown Artist';

                auctionDocData.auctions.forEach((auctionData, index) => {
                    const auctionElement = document.createElement('article');

                    const startTime = auctionData.StartTime;
                    const bidDur = auctionData.BidDur;
                    const endTime = startTime && bidDur ? calculateEndTime(startTime, bidDur) : 'Unknown date';

                    function calculateEndTime(startTime, bidDur) {
                        const startDate = parseISODateString(startTime);
                        if (!startDate) return 'Invalid date';
                        const endDate = new Date(startDate.getTime() + bidDur * 60 * 60 * 1000);
                        return endDate;
                    }

                    function parseISODateString(isoString) {
                        if (!isoString) {
                            console.error('Invalid or missing date:', isoString);
                            return null;
                        }
                        const date = new Date(isoString);
                        if (isNaN(date)) {
                            console.error(`Invalid date format: ${isoString}`);
                            return null;
                        }
                        return date;
                    }

                    const currentTime = new Date();
                    const isAuctionLive = currentTime < endTime;

                    // Find the highest bid and the corresponding user name
                    let highestBidder = 'No bids yet';
                    if (auctionData.offers && auctionData.offers.length > 0) {
                        const highestBid = auctionData.offers.reduce((max, offer) => offer.BidAmount > max.BidAmount ? offer : max, auctionData.offers[0]);
                        highestBidder = highestBid.UserName;
                    }

                    auctionElement.innerHTML = `
                        <img src="${auctionData.AuctionArtworkUrl || 'default-image.jpg'}" alt="Auction Artwork">
                        <h2>${auctionData.Title || 'Untitled Post'}</h2>
                        <p><strong>Created By:</strong> ${artistName}</p>
                        <p><strong>Live until:</strong> ${endTime}</p>
                        <p><strong>Starting Bid Amount:</strong> $${auctionData.StartBid}</p>
                        <p><strong>Current Bid Amount:</strong> $${auctionData.CurrentBid || auctionData.StartBid}</p>
                        <p><strong>Highest Bidder:</strong> ${highestBidder}</p>
                        ${userRole === 'Art Enthusiast' ? `<button class="bid-button" id="auction-${auctionDoc.id}-${index}" data-id="${auctionDoc.id}">Place a Bid</button>` : ''}
                        ${userRole === 'Artist' ? `<p><strong>Auction Status:</strong> ${isAuctionLive ? 'Auction is Live' : 'Auction Ended'}</p>` : ''}
                    `;

                    auctionContainer.appendChild(auctionElement);

                    if (userRole === 'Art Enthusiast') {
                        let btnID = `auction-${auctionDoc.id}-${index}`;
                        let getBtn = document.getElementById(btnID);

                        if (currentTime >= endTime) {
                            getBtn.disabled = true;
                            getBtn.textContent = 'Auction Ended';
                        }

                        getBtn.addEventListener('click', () => {
                            window.location.href = `../auction-details/auction-details.html?id=${auctionDoc.id}&check=${index}`;
                        });
                    }

                    items.push(auctionElement); 
                });
            });
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}


function artistloadData() {
    try {
        const artistContainer = document.getElementById('artists');
        artistContainer.innerHTML = ''; 

        onSnapshot(collection(db, "Artist"), (snapshot) => {
            artistContainer.innerHTML = ''; 

            let items = [];
            let numToDisplay = 4;

            snapshot.forEach(doc => {
                const artistData = doc.data();
                const artistElement = document.createElement('article');
                artistElement.className = 'artist-profile';

                const artworkSection = document.createElement('div');
                artworkSection.className = 'artwork-section';

                if (artistData.ArtworkUrls && artistData.ArtworkUrls.length > 0) {
                    artistData.ArtworkUrls.slice(0, 3).forEach((url, index) => {
                        const imgElement = document.createElement('img');
                        imgElement.src = url;
                        imgElement.alt = `Artwork ${index + 1} by ${artistData.Name}`;
                        imgElement.className = 'artwork-image';
                        artworkSection.appendChild(imgElement);
                    });
                }

                const profileSection = document.createElement('div');
                profileSection.className = 'profile-section';

                profileSection.innerHTML = `
                    <img src="${artistData.ProfileUrl}" alt="${artistData.Name}" class="profile-image">
                    <div>
                        <h2>${artistData.Name || 'Untitled Post'}</h2>
                        <p><strong>Category:</strong> ${artistData.ArtCategory || 'No content available.'}</p>
                        <p><strong>Bio:</strong> ${artistData.Bio || 'No content available.'}</p>
                    </div>
                `;

                artistElement.appendChild(artworkSection);
                artistElement.appendChild(profileSection);
                
                items.push(artistElement); // Collecting items for pagination
            });

            // Display limited number of items
            items.slice(0, numToDisplay).forEach(item => artistContainer.appendChild(item));
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}

function artOnDemandloadData() {
    try {
        const artOnDemandContainer = document.getElementById('art-on-demand');
        artOnDemandContainer.innerHTML = ''; 

        onSnapshot(collection(db, "Art-on-demand"), (snapshot) => {
            artOnDemandContainer.innerHTML = ''; // Clear existing items

            let items = [];
            let numToDisplay = 4;

            snapshot.forEach(doc => {
                const artOnDemandData = doc.data();

                if (!artOnDemandData || !Array.isArray(artOnDemandData.posts)) {
                    console.error('Invalid data or missing posts array in document:', doc.id);
                    return;
                }

                artOnDemandData.posts.forEach(postData => {
                    const artOnDemandElement = document.createElement('article');
                    artOnDemandElement.className = 'art-on-demand-item';

                    artOnDemandElement.innerHTML = `
                        <img src="${postData.ImageUrl || 'default-image.jpg'}" alt="Artwork Image">
                        <div class="artwork-details">
                            <h2>${postData.Title || 'Untitled Post'}</h2>
                            <p>${postData.Description || 'No content available.'}</p>
                        </div>
                    `;

                    items.push(artOnDemandElement); // Collecting items for pagination
                });
            });

            // Display limited number of items
            items.slice(0, numToDisplay).forEach(item => artOnDemandContainer.appendChild(item));
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

