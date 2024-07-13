import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log()
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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged((user) => {
        if (user) {
            let userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
                if (userDocSnap.exists()) {
                    let userData = userDocSnap.data();
                    console.log("User data:", userData);
                } else {
                    console.log('No valid role found for the user.');
                }
            }).catch((error) => {
                console.error("Error getting user document:", error);
            });

            console.log(user.uid);
            // Event listeners for role selection
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });
});


async function auctionloadData() {
    try {
        const auctionSnapshot = await getDocs(collection(db, "Auction"));
        const auctionContainer = document.getElementById('auctions');
        auctionContainer.innerHTML = ''; 

        auctionSnapshot.forEach(doc => {
            const auctionDocData = doc.data();
            if (!auctionDocData || !Array.isArray(auctionDocData.auctions)) {
                console.error('Invalid data or missing auctions array in document:', doc.id);
                return;
            }
console.log("auctionDocData", auctionDocData.auctions)
console.log("doc.id", doc.id)
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

                auctionElement.innerHTML = `
                    <img src="${auctionData.AuctionArtworkUrl || 'default-image.jpg'}" alt="Auction Artwork">
                    <h2>${auctionData.Title || 'Untitled Post'}</h2>
                    <p>${auctionData.Description || 'No content available.'}</p>
                    <p><strong>Live until:</strong> ${endTime}</p>
                    <p>Starting Bid Amount: $${auctionData.StartBid}</p>
                    <p>Current Bid Amount: $${auctionData.CurrentBid}</p>
                    <button class="bid-button" id=auction-${doc.id}-${index} data-id="${doc.id}">Place a Bid </button>

                `;

                auctionContainer.appendChild(auctionElement);
                let btnID= `auction-${doc.id}-${index}`
                let getBtn = document.getElementById(btnID)
                // console.log(getBtn)
                getBtn.addEventListener('click',()=>{
                    console.log(">>>>>>")
                 let data = {
                                  aucID: doc.id,
                                  index
                                }
                                console.log(data)
                                console.log("doc.id CLICK", doc.id)
                    window.location.href = `../auction-details/auction-details.html?id=${doc.id}&check=${index}`;
                })
            });
            
        });
        
    } catch (error) {
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

        artOnDemandContainer.innerHTML = ''; // Clear previous content

        artOnDemand_snapshot.forEach(doc => {
            const artOnDemandData = doc.data();
            
            // Check if the posts array exists and is valid
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

                artOnDemandContainer.appendChild(artOnDemandElement);
            });
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}




document.addEventListener('DOMContentLoaded', auctionloadData());
document.addEventListener('DOMContentLoaded', artistloadData());
document.addEventListener('DOMContentLoaded', artOnDemandloadData());
