import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; 
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
                        const postElement = document.createElement('article');
                        postElement.className = 'post';
                        postElement.innerHTML = `
                            ${postData.ImageUrl ? `<img src="${postData.ImageUrl}" alt="Post image" width="300">` : ''}
                            <h2>${postData.Title || 'Untitled Post'}</h2>
                            <p><strong>Posted By:</strong> ${artistName}</p>
                            <p><strong>Description:</strong> ${postData.Description || 'No content available.'}</p>
                            <div id="offersList-${postId}-${index}"></div>
                        `;

                        const offerListDiv = postElement.querySelector(`#offersList-${postId}-${index}`);

                        if (postData.Offers) {
                            const acceptedOffer = postData.Offers.find(offer => offer.status === 'accepted');
                            if (acceptedOffer) {
                                offerListDiv.innerHTML = `<p>This art on demand is no longer accepting offers.</p>`;
                            } else {
                                const userOffer = postData.Offers.find(offer => offer.ArtistId === currentUser.uid);
                                if (userOffer) {
                                    offerListDiv.innerHTML = `<p>Your Offer: $${userOffer.OfferedPrice}</p>`;
                                } else if (userRole === 'Artist') {
                                    addOfferButton(postElement, postId, index);
                                }
                            }
                        } else if (userRole === 'Artist') {
                            addOfferButton(postElement, postId, index);
                        }

                        postsContainer.appendChild(postElement);
                    });
                } else {
                    console.error(`No matching artist document found for postId: ${postId}`);
                }
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function addOfferButton(postElement, postId, index) {
        const offerButton = document.createElement('button');
        offerButton.textContent = 'Place Offer';
        offerButton.className = 'placeOfferBtn';
        offerButton.addEventListener('click', () => showOfferForm(postId, index));
        postElement.appendChild(offerButton);
    }

    function showOfferForm(postId, postIndex) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal';
        const offerForm = document.createElement('form');
        offerForm.className = 'modal-content';
        offerForm.innerHTML = `
            <span class="close">&times;</span>
            <input type="number" id="offerPrice-${postId}-${postIndex}" placeholder="Offer Price" required>
            <button type="submit">Submit Offer</button>
        `;
        modalContainer.appendChild(offerForm);
        document.body.appendChild(modalContainer);
        const closeButton = modalContainer.querySelector('.close');
        closeButton.addEventListener('click', () => {
            modalContainer.style.display = 'none';
            document.body.removeChild(modalContainer);
        });
        modalContainer.style.display = 'block';
        offerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const offerPrice = document.getElementById(`offerPrice-${postId}-${postIndex}`).value;
            console.log("Offer Price:", offerPrice);
            await submitOffer(postId, postIndex, offerPrice);
            modalContainer.style.display = 'none';
            showConfirmationModal(offerPrice);
        });
    }

    async function submitOffer(postId, postIndex, offerPrice) {
        try {
            const currentUser = auth.currentUser;
            const artistRef = collection(db, 'Artist');
            const querySnapshot = await getDocs(artistRef);

            let currentArtistId = currentUser.uid;
            let currentArtistName = 'Unknown Artist';

            querySnapshot.forEach((doc) => {
                const artistData = doc.data();
                if (artistData.uid === currentArtistId) {
                    currentArtistName = artistData.Name || 'Unknown Artist';
                }
            });

            const aodRef = doc(db, "Art-on-demand", postId);
            const aodDocSnap = await getDoc(aodRef);

            if (aodDocSnap.exists()) {
                const posts = aodDocSnap.data().posts || [];
                const post = posts[postIndex];

                if (!post) {
                    console.error(`No post found at index ${postIndex}`);
                    return;
                }

                post.Offers = post.Offers || [];
                const existingOfferIndex = post.Offers.findIndex(offer => offer.ArtistId === currentArtistId);

                if (existingOfferIndex !== -1) {
                    console.error(`Artist ${currentArtistName} has already made an offer.`);
                    return;
                } else {
                    post.Offers.push({
                        ArtistId: currentArtistId,
                        ArtistName: currentArtistName,
                        OfferedPrice: offerPrice,
                        status: 'pending'
                    });
                    console.log(`Added new offer for artist ${currentArtistName} with price ${offerPrice}`);
                }

                await updateDoc(aodRef, { posts });
                console.log("Offer added/updated successfully!");

                loadPosts();
            } else {
                console.log("No such document in Art-on-demand!");
            }
        } catch (error) {
            console.error("Error adding/updating offer: ", error);
        }
    }

    function showConfirmationModal(offerPrice) {
        const modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="closeConfirmationModal">&times;</span>
                <p id="confirmation-message">Offer placed successfully! Your offer price is: $${offerPrice}</p>
                <button id="confirmation-ok-button" class="ok-button">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = "block";
        const closeConfirmationModal = document.getElementById('closeConfirmationModal');
        const okButton = document.getElementById('confirmation-ok-button');
        closeConfirmationModal.onclick = () => { modal.style.display = "none"; document.body.removeChild(modal); };
        okButton.onclick = () => { modal.style.display = "none"; document.body.removeChild(modal); };
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                document.body.removeChild(modal);
            }
        };
    }
});
