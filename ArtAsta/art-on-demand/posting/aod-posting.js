import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; 
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
const storage = getStorage(app); 
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () { 
    let user_id;
    let userRole;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            user_id = user.uid;
            console.log(user.uid);
            let userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
                if (userDocSnap.exists()) {
                    let userData = userDocSnap.data();
                    userRole = userData.role;
                    console.log("User data:", userData);

                    if (userRole === 'artist') {
                        document.getElementById('artistOfferSection').style.display = 'block';
                    }
                } else {
                    console.log("No such document in users!");
                }
            }).catch((error) => {
                console.error("Error getting user document:", error);
            });
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '/Sign-up/Sign-up.html';
        }
    });

    const submitBtn = document.querySelector('input[type="submit"]');
    const contentPost = document.getElementById('postContent');
    const titlePost = document.getElementById('title');
    const deadlinePost = document.getElementById('deadline');
    const form = document.querySelector('form');
    const postImage = document.getElementById('postImage');
    const imageDisplay = document.getElementById('uploadedImage'); // Correct image element

    postImage.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Fixed this line
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageDisplay.src = e.target.result;
                imageDisplay.style.display = 'block'; // Ensure the image is displayed
            };
            reader.readAsDataURL(file);
        }
    });

    async function uploadImage(file) {
        const filePath = `images/${file.name}`; 
        const fileRef = ref(storage, filePath);

        try {
            const snapshot = await uploadBytes(fileRef, file);
            console.log('File uploaded successfully');

            const downloadURL = await getDownloadURL(fileRef);
            console.log('Download URL:', downloadURL);
            return downloadURL; 
        } catch (error) {
            console.error('Error uploading file:', error);
            return ''; 
        }
    }

    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault();

        let imageUrl = '';
        if (postImage.files.length > 0) {
            imageUrl = await uploadImage(postImage.files[0]);
        }

        try {
            let aodData = {
                Title: titlePost.value,
                Description: contentPost.value,
                Deadline: deadlinePost.value,
                ImageUrl: imageUrl,
                Offers: [] // initialize an empty array for offers
            };

            const aodRef = doc(db, "Art-on-demand", user_id);
            const aodDoc = await getDoc(aodRef);

            if (aodDoc.exists()) {
                await updateDoc(aodRef, {
                    posts: arrayUnion(aodData)
                });
                console.log("Art-on-demand post added to user's document!");
            } else {
                await setDoc(aodRef, {
                    posts: [aodData]
                });
                console.log("Art-on-demand document created successfully!");
            }

            form.reset();
            imageDisplay.style.display = 'none'; // Hide the image after form reset
            console.log("Form data saved successfully!");
            window.location.href = `/art-on-demand/aod-post-dashboard.html`
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    });

    const offerBtn = document.getElementById('offerBtn');
    const offerInput = document.getElementById('offerPrice');
    
    offerBtn.addEventListener('click', async function(event) {
        event.preventDefault();

        if (!user_id) {
            alert('You must be signed in as an artist to place an offer.');
            return;
        }

        const postId = document.getElementById('postId').value;
        const offerPrice = offerInput.value;

        try {
            const aodRef = doc(db, "Art-on-demand", postId);
            const aodDoc = await getDoc(aodRef);

            if (aodDoc.exists()) {
                await updateDoc(aodRef, {
                    Offers: arrayUnion({
                        ArtistId: user_id,
                        OfferedPrice: offerPrice
                    })
                });
                console.log("Offer added successfully!");
            } else {
                console.log("No such document in Art-on-demand!");
            }
        } catch (error) {
            console.error("Error adding offer: ", error);
        }
    });
});
