import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// let userDocRef = doc(db, "Users", user.uid);
auth.onAuthStateChanged((user) => {
    if (user) {
        let userDocRef = doc(db, "Users", user.uid);
        getDoc(userDocRef).then((userDocSnap) => {
            if (userDocSnap.exists()) {
                let userData = userDocSnap.data();
                if (userData.role === 'Artist') {
                    document.getElementById('header').innerHTML = `<artist-header-content></artist-header-content>`;
                } else if (userData.role === 'Art Enthusiast') {
                    document.getElementById('header').innerHTML = `<art-enthu-header-content></art-enthu-header-content>`
                } else {
                    console.log('No valid role found for the user.');
                }
            } else {
                console.log("No such document in users!");
            }
            const artist_auction_id = document.getElementById('artist-dropdown');
            if (artist_auction_id) {
                artist_auction_id.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.body.classList.toggle('added_drpdown_list')
                })

            }


            // artEnthu Drop Down
            const artist_enthusiast_id = document.getElementById('art-on-demand-dropdown');
            if (artist_enthusiast_id) {
                artist_enthusiast_id.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.body.classList.toggle('artEnthu_drpdown_list')
                })
            }



            // Profile dropdown
            const profile_art_enthu = document.getElementById('artEnthu-profile-dropdown');
            if (profile_art_enthu) {
                profile_art_enthu.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.body.classList.toggle('profile_drpdown_list')
                })
            }


            const artist_profile_dropdown = document.getElementById('artist-profile-dropdown');
            if (artist_profile_dropdown) {
                artist_profile_dropdown.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.body.classList.toggle('profile_drpdown_list')
                })

            }
        }).catch((error) => {
            console.error("Error getting user document:", error);
        });

        console.log(user.uid);
        // Event listeners for role selection
    } else {
        console.error('No user is currently signed in.');
        alert('Please sign in.');
        window.location.href = '/Sign-up/Sign-up.html';
    }

});
// artist Drop Down

