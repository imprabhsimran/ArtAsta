import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


document.addEventListener('DOMContentLoaded', async function () {
    const profileContainer = document.getElementById('profile-info');

    // Function to load the profile data
    async function loadProfile(userId, role) {
        try {
            console.log(`Fetching profile for userId: ${userId} with role: ${role}`);

            let profileData = {};

            if (role === 'Artist') {
                const artistDoc = await getDoc(doc(db, "Artist", userId));
                if (artistDoc.exists()) {
                    const artistData = artistDoc.data();
                    console.log("Artist data:", artistData);
                    profileData = {
                        ...artistData,
                        role: 'Artist'
                    };
                } else {
                    console.error("Artist data not found for userId:", userId);
                    return;
                }
            } else if (role === 'Art Enthusiast') {
                const userDoc = await getDoc(doc(db, "Art-enthusiast", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("User data:", userData);
                    profileData = {
                        ...userData,
                        role: 'Art Enthusiast'
                    };
                } else {
                    console.error("User data not found for userId:", userId);
                    return;
                }
            }

            displayProfile(profileData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    }

    function displayProfile(profileData) {
        profileContainer.innerHTML = `
            <div class="profile-card">
                <div class="profile-content">
                    <div class="profile-details">
                        <div class="header_img">
                            <img src="${profileData.ProfileUrl || 'placeholder.jpg'}" alt="${profileData.Name}" class="profile-picture" />
                            <h1>${profileData.Name} (${profileData.role})</h1>
                        </div>
    
                        <p><strong>Email:</strong> ${profileData.Email}</p>
                        <p><strong>Bio:</strong> ${profileData.Bio}</p>
                        <p><strong>Address:</strong> ${profileData.Address}</p>
    
                        ${profileData.role === 'Artist' ? `
                            <p><strong>Profession:</strong> ${profileData.Profession}</p>
                            <p><strong>Art Category:</strong> ${profileData.ArtCategory}</p>
                            <a href="View-my-auctions/view-my-postings.html">View My Auction Postings</a><br>
                            <a href="View-sent-aod-offers/View-sent-aod-offers.html">View Art-on-Demand Request Offers</a>
                        ` : profileData.role === 'Art Enthusiast' ? `
                            <a href="View-my-bidings/view-my-bidings.html">View My Biddings</a>
                            <a href="View-my-aod-requests/view-my-requests.html">View My Art-on-Demand Requests</a><br>
                        ` : ''}
                    </div>
    
                    ${profileData.role === 'Artist' ? `
                        <div class="artwork-grid">
                            <h1>My Artwork</h1>
                            ${profileData.ArtworkUrls.map(url => `<img src="${url}" alt="Artwork">`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    console.log("User data:", userData);
                    const role = userData.role;
                    loadProfile(user.uid, role);
                } else {
                    console.error("No such document in users!");
                }
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });
        } else {
            console.error("User not logged in.");
        }
    });
});



