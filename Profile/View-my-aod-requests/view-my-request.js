import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, updateDoc, getDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import firebaseConfig from '../../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
document.addEventListener('DOMContentLoaded', function () {
    const artOnDemandContainer = document.getElementById('artOnDemandContainer');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.uid;
            const artOnDemandDocRef = doc(db, 'Art-on-demand', userId);

            onSnapshot(artOnDemandDocRef, (doc) => {
                if (doc.exists()) {
                    const artOnDemandData = doc.data();
                    const postsArray = artOnDemandData.posts || []; 

                    artOnDemandContainer.innerHTML = ''; 
                    postsArray.forEach((post, postIndex) => {
                        const postElement = createPostElement(post, postIndex);
                        artOnDemandContainer.appendChild(postElement);
                    });

                    // Add event listeners for delete buttons
                    const deleteButtons = document.querySelectorAll('.delete-btn');
                    deleteButtons.forEach(button => {
                        button.addEventListener('click', async function (e) {
                            e.preventDefault();
                            const postId = e.target.getAttribute('data-post-id');
                            const postIndex = e.target.getAttribute('data-post-index');
                            await delete_post(postId, postIndex);
                        });
                    });

                    // Add event listeners for delete offer buttons
                    const deleteOfferButtons = document.querySelectorAll('.delete-offer-btn');
                    deleteOfferButtons.forEach(button => {
                        button.addEventListener('click', async function (e) {
                            e.preventDefault();
                            const postId = e.target.getAttribute('data-post-id');
                            const offerIndex = e.target.getAttribute('data-offer-index');
                            await delete_offer(postId, offerIndex);
                        });
                    });
                } else {
                    console.log('No art-on-demand data found for the current user.');
                }
            }, (error) => {
                console.error('Error fetching real-time updates:', error);
            });
        } else {
            console.error("User not logged in.");
        }
    });

    function createPostElement(postItem, index) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const offers = postItem.Offers || [];
        const offersHtml = offers.map((offer, offerIndex) => {
            if (offer.status === 'accepted') {
                return `
                    <div class="accepted-offer">
                        <p><strong>Final Accepted Offer:</strong></p>
                        <p><strong>Artist Name:</strong> ${offer.ArtistName}</p>
                        <p><strong>Offered Price:</strong> $${offer.OfferedPrice}</p>
                    </div>
                `;
            } else {
                return `
                    <div class="offer">
                        <p><strong>Artist Name:</strong> ${offer.ArtistName}</p>
                        <p><strong>Offered Price:</strong> $${offer.OfferedPrice}</p>
                        <button id="acceptOffer-${index}-${offerIndex}">Accept Offer</button>
                    </div>
                `;
            }
        }).join('');

        postElement.innerHTML = `
            <h2>${postItem.Title || 'Untitled Post'}</h2>
            ${postItem.ImageUrl ? `<img src="${postItem.ImageUrl}" alt="Post Image" width="300">` : ''}
            <p><strong>Description:</strong> ${postItem.Description || 'No description available.'}</p>
            <p><strong>Deadline:</strong> ${postItem.Deadline || 'Not specified'}</p>
            <div class="offers">
                ${offersHtml}
            </div>
            <i class="fa-regular fa-circle-xmark delete-btn" data-post-id="${postItem.id}" data-post-index="${index}"></i>
        `;

        offers.forEach((offer, offerIndex) => {
            if (offer.status !== 'accepted') {
                const acceptButton = postElement.querySelector(`#acceptOffer-${index}-${offerIndex}`);
                acceptButton.addEventListener('click', async () => {
                    await acceptOffer(postItem, offer);
                });
            }
        });

        return postElement;
    }

    async function acceptOffer(postItem, acceptedOffer) {
        try {
            const userId = auth.currentUser.uid;
            const artOnDemandDocRef = doc(db, 'Art-on-demand', userId);
            const artOnDemandDocSnap = await getDoc(artOnDemandDocRef);

            if (artOnDemandDocSnap.exists()) {
                const artOnDemandData = artOnDemandDocSnap.data();
                const postsArray = artOnDemandData.posts || [];

                const updatedPostsArray = postsArray.map(post => {
                    if (post.Title === postItem.Title) {
                        post.Offers = post.Offers.map(offer => {
                            if (offer.ArtistName === acceptedOffer.ArtistName) {
                                return {
                                    ArtistId: acceptedOffer.ArtistId,
                                    ArtistName: acceptedOffer.ArtistName,
                                    OfferedPrice: acceptedOffer.OfferedPrice,
                                    status: 'accepted'
                                };
                            } else {
                                return offer;
                            }
                        }).filter(offer => offer.status === 'accepted');
                    }
                    return post;
                });

                await updateDoc(artOnDemandDocRef, { posts: updatedPostsArray });

                console.log('Offer accepted and other offers removed.');
            } else {
                console.log('No art-on-demand data found for the current user.');
            }

        } catch (error) {
            console.error('Error accepting offer:', error);
        }
    }

    async function delete_post(postId, postIndex) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error("User is not logged in");
                return;
            }

            const currentArtistId = currentUser.uid;
            const postRef = doc(db, 'Art-on-demand', currentArtistId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const posts = postSnap.data().posts || [];
                posts.splice(postIndex, 1);  

                await updateDoc(postRef, { posts });

                console.log("Post deleted successfully");
            } else {
                console.log("No such document in Art-on-demand!");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    } 
});
