import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; 
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {firebaseConfig} from '../../firebaseConfig.js';

const app = initializeApp(firebaseConfig); 
const db = getFirestore(app); 
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');
    let currentUser;
    let userRole;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            console.log("Current User:", user.uid); 

            const userDocRef = doc(db, "Users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                userRole = userData.role; 
                console.log("User Role:", userRole); 
                setupOnSnapshot();
            } else {
                console.error("No such user document!");
            }
        } else {
            console.error("No user is currently signed in.");
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });

    function setupOnSnapshot() {
        const artOnDemandRef = collection(db, 'Art-on-demand');
        const artEnthusiastRef = collection(db, 'Art-enthusiast');

        onSnapshot(artOnDemandRef, () => {
            loadPosts();
        });

        onSnapshot(artEnthusiastRef, () => {
            loadPosts();
        });
    }

    async function loadPosts() {
        try {
            const snapshotAod = await getDocs(collection(db, 'Art-on-demand'));
            const snapshotAe = await getDocs(collection(db, 'Art-enthusiast'));

            postsContainer.innerHTML = '';

            snapshotAod.forEach(async (docAod) => {
                const postDataArray = docAod.data().posts || [];
                const postId = docAod.id;

                const matchingDocAe = snapshotAe.docs.find(docAe => docAe.id === postId);

                if (matchingDocAe) {
                    const artistData = matchingDocAe.data();
                    const artistName = artistData.Name || 'Unknown Artist';

                    postDataArray.forEach((postData, index) => {
                        const userOffer = postData.Offers?.find(offer => offer.ArtistId === currentUser.uid);
                        if (userOffer) {
                            const postElement = document.createElement('article');
                            postElement.className = 'post';

                            // Check if the user's offer is accepted
                            const acceptanceMessage = userOffer.status === 'accepted' 
                                ? '<p>Your offer has been accepted.</p>' 
                                : '';

                            postElement.innerHTML = `
                                
                                ${postData.ImageUrl ? `<img src="${postData.ImageUrl}" alt="Post image" width="300">` : ''}
                                <h2>${postData.Title || 'Untitled Post'}</h2>
                                <p><strong>Posted By:</strong> ${artistName}</p>
                                <p><strong>Description:</strong> ${postData.Description || 'No content available.'}</p>
                                <p><strong>Your Offer:</strong> $${userOffer.OfferedPrice}</p>
                                ${acceptanceMessage}
                                <div id="offersList-${postId}-${index}"></div>
                                
                                
                            `;

                            postsContainer.appendChild(postElement);
                        }
                    });
                } else {
                    console.error(`No matching artist document found for postId: ${postId}`);
                }
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
});
