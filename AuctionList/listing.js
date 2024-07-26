import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let sortOption = null;

let userRole = null; // Variable to store userRole

let minBid = null;

let maxBid = null; 

const icon = document.querySelector('.icon');
const backDropFilter = document.querySelector('.back-drop');
const filterSortDropdown = document.querySelector('.filter-sort');
const minPrice = document.querySelector('.min');
const maxPrice = document.querySelector('.max');
const firstPrice = document.querySelector('#first');
const secondPrice = document.querySelector('#second');
const selectFilter = document.querySelector('.select__filter');
const selectSort = document.querySelector('.select__Sort');
const filter = document.querySelector('.filter');
const sort = document.querySelector('.sort');
const applyButton = document.querySelector('.filter-sort__btn');


document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged((user) => {
        if (user) {
            let userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
                if (userDocSnap.exists()) {
                    let userData = userDocSnap.data();
                    console.log("User data:", userData);
                    userRole = userData.role; // Assign userRole
                    auctionloadData(userRole);
                } else {
                    console.log('No valid role found for the user.');
                    alert('No valid role found for the user.');
                    window.location.href = '/Sign-up/Sign-up.html';
                }
            }).catch((error) => {
                console.error("Error getting user document:", error);
                alert('Error getting user document.');
                window.location.href = '/Sign-up/Sign-up.html';
            });

            console.log(user.uid);
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });
});

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

async function auctionloadData(userRole) {
    try {
        const auctionSnapshot = await getDocs(collection(db, "Auction"));
        const auctionContainer = document.getElementById('auctions');
        auctionContainer.innerHTML = ''; 

        auctionSnapshot.forEach(async auctionDoc => {
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

                const highestBidder = auctionData.offers && auctionData.offers.length > 0 
                    ? auctionData.offers[auctionData.offers.length - 1] 
                    : null;

                console.log(auctionData);

                
                auctionElement.innerHTML = `
                    <img src="${auctionData.AuctionArtworkUrl || 'default-image.jpg'}" alt="Auction Artwork">
                    <div>
                        <h2>${auctionData.Title || 'Untitled Post'}</h2>
                        <p><strong>Created By:</strong> ${artistName}</p>
                        <p>${auctionData.Description || 'No content available.'}</p>
                        <p>Starting Bid Amount: $${auctionData.StartBid}</p>
                        <p>Current Bid Amount: $${auctionData.CurrentBid || 0}</p>
                        ${highestBidder ? `<p><strong>Highest Bidder:</strong> ${highestBidder.UserName} (${highestBidder.email})</p>` : '<p><strong>Highest Bidder:</strong> No bids yet</p>'}
                        ${userRole === 'Art Enthusiast' ? `<button class="bid-button" id="auction-${auctionDoc.id}-${index}" data-id="${auctionDoc.id}">Place a Bid</button>` : ''}
                    </div>`;

                auctionContainer.appendChild(auctionElement);

                if (userRole === 'Art Enthusiast') {
                    let btnID = `auction-${auctionDoc.id}-${index}`;
                    let getBtn = document.getElementById(btnID);
                    let currentTime = new Date();

                    if (currentTime >= endTime) {
                        getBtn.disabled = true;
                        getBtn.textContent = 'Auction Ended';
                    }

                    getBtn.addEventListener('click', () => {
                        window.location.href = `../auction-details/auction-details.html?id=${auctionDoc.id}&check=${index}`;
                    });
                }
            });
        });

    } catch (error) {
        console.log('Error loading data:', error);
    }
}

icon.addEventListener('click', function() {
    backDropFilter.style.display = 'block';
    filterSortDropdown.style.display = 'flex';
});

document.querySelectorAll('input[name="lowest"]').forEach((input) => {
    input.addEventListener('change', (event) => {
        sortOption = event.target.value;
        auctionloadDataFilteredAndSorted(userRole, minBid, maxBid, sortOption);
    });
});

backDropFilter.addEventListener('click', function() {
    backDropFilter.style.display = 'none';
    filterSortDropdown.style.display = 'none';
});

minPrice.addEventListener('input', function() {
    firstPrice.innerHTML = minPrice.value;
});

maxPrice.addEventListener('input', function() {
    secondPrice.innerHTML = maxPrice.value;
});

selectFilter.addEventListener('click', function() {
    selectFilter.classList.add("active-select");
    selectSort.classList.remove("active-select");

    filter.style.display = 'block';
    sort.style.display = 'none';
});

selectSort.addEventListener('click', function() {
    selectFilter.classList.remove("active-select");
    selectSort.classList.add("active-select");

    filter.style.display = 'none';
    sort.style.display = 'block';
});

applyButton.addEventListener('click', function(e) {
    e.preventDefault();

    minBid = parseInt(minPrice.value, 10);
    maxBid = parseInt(maxPrice.value, 10);
    const sortOption = document.querySelector('input[name="lowest"]:checked')?.value;

    if (isNaN(minBid) || isNaN(maxBid)) {
        console.error('Invalid minBid or maxBid value.');
        return;
    }

    console.log(sortOption)

    auctionloadDataFilteredAndSorted(userRole, minBid, maxBid, sortOption);
    backDropFilter.style.display = 'none';
    filterSortDropdown.style.display = 'none';
});


async function auctionloadDataFilteredAndSorted(userRole, minBid, maxBid, sortOption) {
    try {
        const auctionSnapshot = await getDocs(collection(db, "Auction"));
        const auctionContainer = document.getElementById('auctions');
        auctionContainer.innerHTML = ''; 

        let auctionsArray = [];

        auctionSnapshot.forEach(doc => {
            const auctionDocData = doc.data();
            if (!auctionDocData || !Array.isArray(auctionDocData.auctions)) {
                console.error('Invalid data or missing auctions array in document:', doc.id);
                return;
            }
            auctionDocData.auctions.forEach(auctionData => {
                const bidValue = auctionData.CurrentBid || auctionData.StartBid;
                if (bidValue >= minBid && bidValue <= maxBid) {
                    auctionsArray.push({...auctionData, id: doc.id}); // Include document ID
                }
            });
        });

        console.log('auctionsArray before sorting:', auctionsArray);

        if (sortOption === 'lowest') {
            auctionsArray.sort((a, b) => {
                const bidA = a.CurrentBid || a.StartBid;
                const bidB = b.CurrentBid || b.StartBid;
                return parseInt(bidA) - parseInt(bidB);
            });
        } else if (sortOption === 'highest') {
            auctionsArray.sort((a, b) => {
                const bidA = a.CurrentBid || a.StartBid;
                const bidB = b.CurrentBid || b.StartBid;
                return parseInt(bidB) - parseInt(bidA);
            });
        }

        console.log('auctionsArray after sorting:', auctionsArray);

        // Re-render auctions after sorting
        auctionsArray.forEach((auctionData, index) => {
            const auctionElement = document.createElement('article');

            const startTime = auctionData.StartTime;
            const bidDur = auctionData.BidDur;
            const endTime = startTime && bidDur ? calculateEndTime(startTime, bidDur) : 'Unknown date';

            auctionElement.innerHTML = `
                <img src="${auctionData.AuctionArtworkUrl || 'default-image.jpg'}" alt="Auction Artwork">
                <div>
                    <h2>${auctionData.Title || 'Untitled Post'}</h2>
                    <p>${auctionData.Description || 'No content available.'}</p>
                    <p><strong>Live until:</strong> ${endTime}</p>
                    <p>Starting Bid Amount: $${auctionData.StartBid}</p>
                    <p>Current Bid Amount: $${auctionData.CurrentBid || 0}</p>
                    ${userRole === 'Art Enthusiast' ? `<button class="bid-button" id="auction-${auctionData.id}-${index}" data-id="${auctionData.id}">Place a Bid</button>` : ''}
                </div>`;

            auctionContainer.appendChild(auctionElement);

            if (userRole === 'Art Enthusiast') {
                let btnID = `auction-${auctionData.id}-${index}`;
                let getBtn = document.getElementById(btnID);
                let currentTime = new Date();

                if (currentTime >= endTime) {
                    getBtn.disabled = true;
                    getBtn.textContent = 'Auction Ended';
                }

                getBtn.addEventListener('click', () => {
                    window.location.href = `../auction-details/auction-details.html?id=${auctionData.id}&check=${index}`;
                });
            }

        });

    } catch (error) {
        console.log('Error loading data:', error);
    }
}


