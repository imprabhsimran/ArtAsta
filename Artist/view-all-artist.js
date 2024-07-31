import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    const artistsContainer = document.getElementById('artists-list');

    try {
        const artistsSnapshot = await getDocs(collection(db, "Artist"));
        if (artistsSnapshot.empty) {
            artistsContainer.innerHTML = '<p>No artists found.</p>';
            return;
        }

        artistsSnapshot.forEach(doc => {
            const artistData = doc.data();
            displayArtist(artistData, doc.id);
        });
    } catch (error) {
        console.error('Error fetching artists data:', error);
        artistsContainer.innerHTML = '<p>Error: Unable to fetch artists data.</p>';
    }

    function displayArtist(artistData, artistId) {
        const artistElement = document.createElement('div');
        artistElement.classList.add('artist-card');
        artistElement.onclick = () => {
            window.location.href = `/artasta-map/artist-overview.html?id=${artistId}`;
        };

        artistElement.innerHTML = `
            <div class="artist-inline">
                <img src="${artistData.ProfileUrl || 'placeholder.jpg'}" alt="${artistData.Name}" class="artist-picture" />
                <div>
                    <h2>${artistData.Name}</h2>
                    <p><strong>Profession:</strong> ${artistData.Profession}</p>
                    <p><strong>Bio:</strong> ${artistData.Bio}</p>
                    <div class="artist-artwork">
                        ${artistData.ArtworkUrls ? artistData.ArtworkUrls.map(url => `<img src="${url}" alt="Artwork">`).join('') : ''}
                    </div>
                </div>
            </div>
        `;

        artistsContainer.appendChild(artistElement);
    }
});