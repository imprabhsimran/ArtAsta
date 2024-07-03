import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//Art Asta's Firebase configuration
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

document.addEventListener('DOMContentLoaded', function () {
    const loadComponent = async (url, placeholderId) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const text = await response.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = text;

                // Extract and apply the styles
                const linkElements = tempDiv.querySelectorAll('link[rel="stylesheet"]');
                linkElements.forEach(link => {
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = link.href;
                    document.head.appendChild(newLink);
                });

                // Set the inner HTML without the link elements
                tempDiv.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());
                document.getElementById(placeholderId).innerHTML = tempDiv.innerHTML;
            } else {
                console.error(`Error loading ${url}:`, response.statusText);
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    };

    // Load header and footer
    loadComponent('/header-footer/header.html', 'header-placeholder');
    loadComponent('/header-footer/footer.html', 'footer-placeholder');
});



async function auctionloadData() {
    try {
        const auction_snapshot = await getDocs(collection(db, "Auction"));
        const auctionContainer = document.getElementById('auctions');

        auction_snapshot.forEach(doc => {
            const auctionData = doc.data();
            const auctionElement = document.createElement('article');

            const startTime = auctionData.StartTime;
            const bidDur = auctionData.BidDur;

            const endTime = calculateEndTime(startTime, bidDur);

            function calculateEndTime(startTime, bidDur) {
                const startDate = parseISODateString(startTime);
                console.log(startDate);
                const endDate = new Date(startDate.getTime() + bidDur * 60 * 60 * 1000);
                console.log(startDate.getTime());
                return endDate;
            }

            function parseISODateString(isoString) {
                const date = new Date(isoString);
                if (isNaN(date)) {
                    throw new Error(`Invalid date format: ${isoString}`);
                }
                return date;
            }


            auctionElement.innerHTML = `
                <img src=${auctionData.AuctionArtworkUrl}>
                <h2>${auctionData.Title || 'Untitled Post'}</h2>
                <p>${auctionData.Description || 'No content available.'}</p>
                <p><strong>Live until:</strong> ${endTime || 'Unknown date'}</p>
                <p>Starting Bid Amount: ${auctionData.StartBid}</p>
                <button class="bid-button" data-id="${doc.id}">Place a Bid</button>
            `;

            console.log(auctionData)
            auctionContainer.appendChild(auctionElement);
        });
        const bidButtons = document.querySelectorAll('.bid-button');
        bidButtons.forEach(button => {
            button.addEventListener('click', event => {
                const auctionId = event.target.getAttribute('data-id');
                window.location.href = `../auction-details/auction-details.html?id=${auctionId}`;
            });
        });
    }
    catch (error) {
        console.log('Error loading data:', error);
    }
}

async function artistloadData() {
    try {
        const artistSnapshot = await getDocs(collection(db, "Artist"));
        const artistContainer = document.getElementById('artists');
        artistContainer.innerHTML = ''; // Clear previous content

        artistSnapshot.forEach(doc => {
            const artistData = doc.data();
            const artistElement = document.createElement('article');
            artistElement.className = 'artist-profile'; // Optional: add a class for styling

            // Create the profile section
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

            artistElement.appendChild(profileSection);

            // Create the artwork section
            if (artistData.ArtworkUrls && artistData.ArtworkUrls.length > 0) {
                const artworkSection = document.createElement('div');
                artworkSection.className = 'artwork-section';

                // Loop through the ArtworkUrls and add up to 3 images
                artistData.ArtworkUrls.slice(0, 3).forEach((url, index) => {
                    const imgElement = document.createElement('img');
                    imgElement.src = url;
                    imgElement.alt = `Artwork ${index + 1} by ${artistData.Name}`;
                    imgElement.className = 'artwork-image'; // Optional: add a class for styling
                    artworkSection.appendChild(imgElement);
                });

                artistElement.appendChild(artworkSection);
            }

            artistContainer.appendChild(artistElement);
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}


async function artOnDemandloadData() {
    try {
        const artOnDemand_snapshot = await getDocs(collection(db, "Art-on-demand"));
        const artOnDemandContainer = document.getElementById('art-on-demand');

        artOnDemand_snapshot.forEach(doc => {
            const artOnDemandData = doc.data();
            const artOnDemandElement = document.createElement('article');

            artOnDemandElement.innerHTML = `
                <img src=${artOnDemandData.ImageUrl}>
                <h2>${artOnDemandData.Title || 'Untitled Post'}</h2>
                <p>${artOnDemandData.Description || 'No content available.'}</p>
                <button>More information</button>
            `;

            console.log(artOnDemandData);
            artOnDemandContainer.appendChild(artOnDemandElement);
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}


document.addEventListener('DOMContentLoaded', auctionloadData());
document.addEventListener('DOMContentLoaded', artistloadData());
document.addEventListener('DOMContentLoaded', artOnDemandloadData());
