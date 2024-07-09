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

document.addEventListener('DOMContentLoaded', async function () {
    const artOnDemandContainer = document.getElementById('artOnDemandContainer');

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.uid;
            try {
                // Directly reference a specific document in the Art-on-demand collection
                const artOnDemandDocRef = doc(db, 'Art-on-demand', userId);
                const artOnDemandDocSnap = await getDoc(artOnDemandDocRef);

                artOnDemandContainer.innerHTML = ''; // Clear previous content

                if (artOnDemandDocSnap.exists()) {
                    const artOnDemandData = artOnDemandDocSnap.data();
                    const postsArray = artOnDemandData.posts || []; // Adjust field name if needed

                    postsArray.forEach((post) => {
                        const postElement = createPostElement(post);
                        artOnDemandContainer.appendChild(postElement);
                    });
                } else {
                    console.log('No art-on-demand data found for the current user.');
                }

            } catch (error) {
                console.error('Error fetching art-on-demand data:', error);
            }
        } else {
            console.error("User not logged in.");
        }
    });

    function createPostElement(postItem) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const offers = postItem.Offers || [];
        const offersHtml = offers.map(offer => `
            <div class="offer">
                <p><strong>Artist Name:</strong> ${offer.ArtistName}</p>
                <p><strong>Offered Price:</strong> ${offer.OfferedPrice}</p>
            </div>
        `).join('');

        postElement.innerHTML = `
            <h2>${postItem.Title || 'Untitled Post'}</h2>
            <p><strong>Description:</strong> ${postItem.Description || 'No description available.'}</p>
            ${postItem.ImageUrl ? `<img src="${postItem.ImageUrl}" alt="Post Image" width="300">` : ''}
            <p><strong>Deadline:</strong> ${postItem.Deadline || 'Not specified'}</p>
            ${offers.length > 0 ? `<div class="offers"><h3>Offers:</h3>${offersHtml}</div>` : ''}
        `;

        return postElement;
    }
});
