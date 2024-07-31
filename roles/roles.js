import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore();

document.addEventListener('DOMContentLoaded', function() {
    const artistDiv = document.getElementById('artist');
    const artistEnthusiastDiv = document.getElementById('art-enthusiast');


    // Function to update user role in Firestore
    async function updateUserRoleArtist(role) {
        try {
            const user = auth.currentUser;

            if (user) {
                const userId = user.uid;

                await updateDoc(doc(db, 'Users', userId), {
                    role: role
                });

                window.location.href = '../Artist-info/artist-info-main-page.html';
            } else {
                console.error('No user is currently signed in.');
                alert('Please sign in again.');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Error updating role.');
        }
    }

    async function updateUserRoleArtEnthusiast(role) {
        try {
            const user = auth.currentUser;

            if (user) {
                const userId = user.uid;

                await updateDoc(doc(db, 'Users', userId), {
                    role: role
                });

                window.location.href = '../Art-enthusiast/art-enthusiast.html';
            } else {
                console.error('No user is currently signed in.');
                alert('Please sign in again.');
                window.location.href = '../Sign-up/Sign-up.html';
            }
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Error updating role.');
        }
    }

    // Ensure user is signed in
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log(user);
            // Event listeners for role selection
            artistDiv.addEventListener('click', function() {
                updateUserRoleArtist('Artist');
            });

            artistEnthusiastDiv.addEventListener('click', function() {
                updateUserRoleArtEnthusiast('Art Enthusiast');
            });
        } else {
            console.error('No user is currently signed in.');
            alert('Please sign in.');
            window.location.href = '../Sign-up/Sign-up.html';
        }

    });
});
