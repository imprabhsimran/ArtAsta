import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../../firebaseConfig';

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
                    const userRole = userData.role;
                    const userEmail = user.email;

                    // Call auctionloadData function here with userRole and userEmail
                    auctionloadData(userRole, userEmail);
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

async function auctionloadData(userRole, userEmail) {
    try {
        const auctionSnapshot = await getDocs(collection(db, "Auction"));
        const bidingContainer = document.getElementById('bidingContainer');
        bidingContainer.innerHTML = ''; 

        auctionSnapshot.forEach(doc => {
            const auctionDocData = doc.data();
            if (!auctionDocData || !Array.isArray(auctionDocData.auctions)) {
                console.error('Invalid data or missing auctions array in document:', doc.id);
                return;
            }

            auctionDocData.auctions.forEach((auctionData, index) => {
                const userOffers = auctionData.offers ? auctionData.offers.filter(offer => offer.email === userEmail) : [];
                
                if (userOffers.length > 0) {
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
                        <div>
                            <h2>${auctionData.Title || 'Untitled Post'}</h2>
                            <p>${auctionData.Description || 'No content available.'}</p>
                            <p><strong>Live until:</strong> ${endTime}</p>
                            <p><strong>Starting Bid Amount:</strong> $${auctionData.StartBid}</p>
                            <p><strong>Current Bid Amount:</strong> $${auctionData.CurrentBid || 0}</p>
                            <div>
                                <h4>Your Offers:</h4>
                                <ul>
                                    ${userOffers.map(offer => `<li>${offer.UserName}: $${offer.bidAmount}</li>`).join('')}
                                </ul>
                            </div>
                        </div>`;

                    bidingContainer.appendChild(auctionElement);

                    if (userRole === 'Art Enthusiast') {
                        let btnID = `auction-${doc.id}-${index}`;
                        let getBtn = document.getElementById(btnID);
                        let currentTime = new Date();

                        if (currentTime >= endTime) {
                            getBtn.disabled = true;
                            getBtn.textContent = 'Auction Ended';
                        }

                        getBtn.addEventListener('click', () => {
                            window.location.href = `../auction-details/auction-details.html?id=${doc.id}&check=${index}`;
                        });
                    }
                }
            });
        });

    } catch (error) {
        console.log('Error loading data:', error);
    }
}
