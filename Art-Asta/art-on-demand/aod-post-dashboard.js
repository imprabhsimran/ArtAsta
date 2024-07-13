import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; 
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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

document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');
    let currentUser;
    let userRole;
    let userName;

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
                loadPosts();
            } else {
                console.error("No such user document!");
            }
        } else {
            console.error("No user is currently signed in.");
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });

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
                            <h2>${postData.Title || 'Untitled Post'}</h2>
                            <p><strong>Posted By:</strong> ${artistName}</p>
                            <p><strong>Description:</strong> ${postData.Description || 'No content available.'}</p>
                            ${postData.ImageUrl ? `<img src="${postData.ImageUrl}" alt="Post image" width="300">` : ''}
                            <div id="offersList-${postId}-${index}"></div>
                            `;

                        if (userRole === 'Artist') {
                            console.log("Adding offer button for artist role"); 
                            const offerButton = document.createElement('button');
                            offerButton.textContent = 'Place Offer';
                            offerButton.addEventListener('click', () => showOfferForm(postId, index));
                            postElement.appendChild(offerButton);
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

    function showOfferForm(postId, postIndex) {
        // Create a popup/modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal';

        // Create the offer form inside the modal
        const offerForm = document.createElement('form');
        offerForm.className = 'modal-content';
        offerForm.innerHTML = `
            <span class="close">&times;</span>
            <input type="number" id="offerPrice-${postId}-${postIndex}" placeholder="Offer Price">
            <button type="submit">Submit Offer</button>
        `;
        modalContainer.appendChild(offerForm);

        // Append the modal to the body
        document.body.appendChild(modalContainer);

        // Show the modal when Place Offer is clicked
        const closeButton = modalContainer.querySelector('.close');
        closeButton.addEventListener('click', () => {
            modalContainer.style.display = 'none';
        });

        modalContainer.style.display = 'block';

        // Handle form submission
        offerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const offerPrice = document.getElementById(`offerPrice-${postId}-${postIndex}`).value;
            await submitOffer(postId, postIndex, offerPrice);
            modalContainer.style.display = 'none'; // Close the modal after submission
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
                if (doc.id === postId || artistData.uid === currentArtistId) {
                    currentArtistName = artistData.Name || 'Unknown Artist';
                }
            });
    
            const aodRef = doc(db, "Art-on-demand", postId);
            const aodDocSnap = await getDoc(aodRef);
    
            if (aodDocSnap.exists()) {
                const posts = aodDocSnap.data().posts || [];
    
                posts[postIndex].Offers = posts[postIndex].Offers || [];
                posts[postIndex].Offers.push({
                    ArtistId: currentArtistId,
                    ArtistName: currentArtistName,
                    OfferedPrice: offerPrice,
                });
    
                await updateDoc(aodRef, { posts });
                console.log("Offer added successfully!");
    
                loadPosts(); // Reload posts after offer submission
            } else {
                console.log("No such document in Art-on-demand!");
            }
        } catch (error) {
            console.error("Error adding offer: ", error);
        }
    }
});



// document.addEventListener('DOMContentLoaded', async function () {
//     const postsContainer = document.getElementById('postsContainer');
//     let currentUser;
//     let userRole;
//     let userName;

//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             console.log("Current User:", user.uid); 

//             const userDocRef = doc(db, "Users", user.uid);
//             const userDocSnap = await getDoc(userDocRef);

//             if (userDocSnap.exists()) {
//                 const userData = userDocSnap.data();
//                 userRole = userData.role; 
//                 console.log("User Role:", userRole); 
//                 loadPosts();
//             } else {
//                 console.error("No such user document!");
//             }
//         } else {
//             console.error("No user is currently signed in.");
//             alert('Please sign in.');
//             window.location.href = '/Sign-up/Sign-up.html';
//         }
//     });

//     async function loadPosts() {
//         try {
//             const snapshotAod = await getDocs(collection(db, 'Art-on-demand'));
//             const snapshotAe = await getDocs(collection(db, 'Art-enthusiast'));

//             postsContainer.innerHTML = '';

//             snapshotAod.forEach(async (docAod) => {
//                 const postDataArray = docAod.data().posts || [];
//                 const postId = docAod.id;

//                 const matchingDocAe = snapshotAe.docs.find(docAe => docAe.id === postId);

//                 if (matchingDocAe) {
//                     const artistData = matchingDocAe.data();
//                     const artistName = artistData.Name || 'Unknown Artist';
                    

//                     postDataArray.forEach((postData, index) => {
//                         const postElement = document.createElement('article');
//                         postElement.className = 'post';
//                         postElement.innerHTML = `
//                             <h2>${postData.Title || 'Untitled Post'}</h2>
//                             <p><strong>Posted By:</strong> ${artistName}</p>
//                             <p><strong>Description:</strong> ${postData.Description || 'No content available.'}</p>
//                             ${postData.ImageUrl ? `<img src="${postData.ImageUrl}" alt="Post image" width="300">` : ''}
//                             <div id="offersList-${postId}-${index}"></div>
//                             `;

//                         if (userRole === 'Artist') {
//                             console.log("Adding offer button for artist role"); 
//                             const offerButton = document.createElement('button');
//                             offerButton.textContent = 'Place Offer';
//                             offerButton.addEventListener('click', () => showOfferForm(postId, index));
//                             postElement.appendChild(offerButton);
//                         }

//                         postsContainer.appendChild(postElement);
//                     });
//                 } else {
//                     console.error(`No matching artist document found for postId: ${postId}`);
//                 }
//             });
//         } catch (error) {
//             console.error('Error loading data:', error);
//         }
//     }

//     function showOfferForm(postId, postIndex) {
//         const offerForm = document.createElement('form');
//         offerForm.innerHTML = `
//             <input type="number" id="offerPrice-${postId}-${postIndex}" placeholder="Offer Price">
//             <button type="submit">Submit Offer</button>
//         `;
//         offerForm.addEventListener('submit', async (event) => {
//             event.preventDefault();
//             const offerPrice = document.getElementById(`offerPrice-${postId}-${postIndex}`).value;
//             await submitOffer(postId, postIndex, offerPrice);
//         });
//         document.getElementById(`offersList-${postId}-${postIndex}`).appendChild(offerForm);
//     }


//     async function submitOffer(postId, postIndex, offerPrice) {
//         try {
//             const currentUser = auth.currentUser;

//             const artistRef = collection(db, 'Artist');
//             const querySnapshot = await getDocs(artistRef);
    
//             let currentArtistId = currentUser.uid;
//             let currentArtistName = 'Unknown Artist'; 
    
//             querySnapshot.forEach((doc) => {
//                 const artistData = doc.data();
//                 console.log("ad", artistData)
//                 console.log(artistData.uid)
//                 console.log(doc.id)
//                 if (doc.id === postId || artistData.uid === currentArtistId) {
//                     currentArtistName = artistData.Name || 'Unknown Artist';
//                 }
//             });
    
//             const aodRef = doc(db, "Art-on-demand", postId);
//             const aodDocSnap = await getDoc(aodRef);
    
//             if (aodDocSnap.exists()) {
//                 const posts = aodDocSnap.data().posts || [];
    
//                 posts[postIndex].Offers = posts[postIndex].Offers || [];
//                 posts[postIndex].Offers.push({
//                     ArtistId: currentArtistId,
//                     ArtistName: currentArtistName,
//                     OfferedPrice: offerPrice,

//                 });
    
//                 await updateDoc(aodRef, { posts });
//                 console.log("Offer added successfully!");
    
//                 loadPosts();
//             } else {
//                 console.log("No such document in Art-on-demand!");
//             }
//         } catch (error) {
//             console.error("Error adding offer: ", error);
//         }
//     }    
    
// });

