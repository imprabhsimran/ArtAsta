import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, updateDoc, getDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    const artOnDemandContainer = document.getElementById('artOnDemandContainer');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.uid;
            console.log(userId);
            const artOnDemandDocRef = doc(db, 'Art-on-demand', userId);

            onSnapshot(artOnDemandDocRef, (doc) => {
                if (doc.exists()) {
                    const artOnDemandData = doc.data();
                    const postsArray = artOnDemandData.posts || []; // Adjust field name if needed

                    artOnDemandContainer.innerHTML = ''; 
                    postsArray.forEach((post, postIndex) => {
                        const postElement = createPostElement(post, postIndex);
                        artOnDemandContainer.appendChild(postElement);
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

    function createPostElement(postItem, postIndex) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const offers = postItem.Offers || [];
        const offersHtml = offers.map((offer, offerIndex) => `
            <div class="offer">
                <p><strong>Artist Name:</strong> ${offer.ArtistName}</p>
                <p><strong>Offered Price:</strong> $${offer.OfferedPrice}</p>
                <button id="acceptOffer-${postIndex}-${offerIndex}">Accept Offer</button>
            </div>
        `).join('');

        postElement.innerHTML = `
            <h2>${postItem.Title || 'Untitled Post'}</h2>
            <p><strong>Description:</strong> ${postItem.Description || 'No description available.'}</p>
            ${postItem.ImageUrl ? `<img src="${postItem.ImageUrl}" alt="Post Image" width="300">` : ''}
            <p><strong>Deadline:</strong> ${postItem.Deadline || 'Not specified'}</p>
            ${offers.length > 0 ? `<div class="offers"><h3>Offers:</h3>${offersHtml}</div>` : ''}
        `;

        offers.forEach((offer, offerIndex) => {
            const acceptButton = postElement.querySelector(`#acceptOffer-${postIndex}-${offerIndex}`);
            acceptButton.addEventListener('click', async () => {
                await acceptOffer(postItem, offer);
            });
        });

        return postElement;
    }

    async function submitOffer(postItem, newOffer) {
        try {
            const userId = auth.currentUser.uid;
            const artOnDemandDocRef = doc(db, 'Art-on-demand', userId);
            const artOnDemandDocSnap = await getDoc(artOnDemandDocRef);

            if (artOnDemandDocSnap.exists()) {
                const artOnDemandData = artOnDemandDocSnap.data();
                const postsArray = artOnDemandData.posts || [];

                const updatedPostsArray = postsArray.map(post => {
                    if (post.Title === postItem.Title) {
                        post.Offers = [...(post.Offers || []), newOffer]; // Append the new offer
                    }
                    return post;
                });

                await updateDoc(artOnDemandDocRef, { posts: updatedPostsArray });

                console.log('New offer submitted.');
            } else {
                console.log('No art-on-demand data found for the current user.');
            }

        } catch (error) {
            console.error('Error submitting offer:', error);
        }
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
                        post.Offers = [{ ArtistName: acceptedOffer.ArtistName }]; // Keep only the accepted offer's artist name
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

    // Example of how to use the submitOffer function
    // This part should be triggered by your offer submission form
    // Example offer submission logic
    // document.getElementById('submitOfferButton').addEventListener('click', async () => {
    //     const postItem = {/* post details */};
    //     const newOffer = {
    //         ArtistName: 'New Artist',
    //         OfferedPrice: 200
    //     };
    //     await submitOffer(postItem, newOffer);
    // });
});



// Initializing Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// document.addEventListener('DOMContentLoaded', async function () {
//     const artOnDemandContainer = document.getElementById('artOnDemandContainer');

//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             const userId = user.uid;
//             try {
//                 const artOnDemandDocRef = doc(db, 'Art-on-demand', userId);
//                 const artOnDemandDocSnap = await getDoc(artOnDemandDocRef);

//                 artOnDemandContainer.innerHTML = ''; 
//                 if (artOnDemandDocSnap.exists()) {
//                     const artOnDemandData = artOnDemandDocSnap.data();
//                     const postsArray = artOnDemandData.posts || []; // Adjust field name if needed

//                     postsArray.forEach((post) => {
//                         const postElement = createPostElement(post);
//                         artOnDemandContainer.appendChild(postElement);
//                     });
//                 } else {
//                     console.log('No art-on-demand data found for the current user.');
//                 }

//             } catch (error) {
//                 console.error('Error fetching art-on-demand data:', error);
//             }
//         } else {
//             console.error("User not logged in.");
//         }
//     });

//     function createPostElement(postItem) {
//         const postElement = document.createElement('div');
//         postElement.classList.add('post');

//         const offers = postItem.Offers || [];
//         const offersHtml = offers.map(offer => `
//             <div class="offer">
//                 <p><strong>Artist Name:</strong> ${offer.ArtistName}</p>
//                 <p><strong>Offered Price:</strong> $${offer.OfferedPrice}</p>
//                 <button id="acceptOffer">Accept Offer</button>
//             </div>
//         `).join('');

//         postElement.innerHTML = `
//             <h2>${postItem.Title || 'Untitled Post'}</h2>
//             <p><strong>Description:</strong> ${postItem.Description || 'No description available.'}</p>
//             ${postItem.ImageUrl ? `<img src="${postItem.ImageUrl}" alt="Post Image" width="300">` : ''}
//             <p><strong>Deadline:</strong> ${postItem.Deadline || 'Not specified'}</p>
//             ${offers.length > 0 ? `<div class="offers"><h3>Offers:</h3>${offersHtml}</div>` : ''}
//         `;

//         return postElement;
//     }
// });
