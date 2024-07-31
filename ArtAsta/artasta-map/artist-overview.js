import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyDu1mNebskATIVQmz59QosBS1AhdMAkxqM",
    authDomain: "art-asta-50475.firebaseapp.com",
    projectId: "art-asta-50475",
    storageBucket: "art-asta-50475.appspot.com",
    messagingSenderId: "343332230219",
    appId: "1:343332230219:web:efe5a85c164e5e461c69ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async function () {
    const profileContainer = document.getElementById('profile-info');
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (artistId) {
        loadProfile(artistId);
    } else {
        profileContainer.innerHTML = '<p>Error: No artist ID provided in URL.</p>';
    }

    async function loadProfile(userId) {
        try {
            const artistDoc = await getDoc(doc(db, "Artist", userId));
            if (artistDoc.exists()) {
                const artistData = artistDoc.data();
                displayProfile(artistData);
            } else {
                console.error("Artist data not found for userId:", userId);
                profileContainer.innerHTML = '<p>Error: Artist not found.</p>';
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            profileContainer.innerHTML = '<p>Error: Unable to fetch artist data.</p>';
        }
    }

    function displayProfile(profileData) {
        profileContainer.innerHTML = `
            <div class="profile-card">
                <div class="profile-inline">
                    <div class="header_img">
                        <img src="${profileData.ProfileUrl || 'placeholder.jpg'}" alt="${profileData.Name}" class="profile-picture" />
                        <h1>${profileData.Name}</h1>
                    </div>
                    <p class="role">Artist</p>
                    <p><strong>Email:</strong> ${profileData.Email}</p>
                    <p><strong>Bio:</strong> ${profileData.Bio}</p>
                    <p><strong>Profession:</strong> ${profileData.Profession}</p>
                    <p><strong>Art Category:</strong> ${profileData.ArtCategory}</p>
                    <div class="artwork-grid">
                        <h1>${profileData.Name}'s Artwork</h1>
                        ${profileData.ArtworkUrls.map(url => `<img src="${url}" alt="Artwork">`).join('')}
                    </div>
                </div>
            </div>
        `;
    }
});
