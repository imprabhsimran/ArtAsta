import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

                // Dropdown event listeners
                const dropdowns = {
                    'artist-dropdown': 'added_drpdown_list',
                    'art-on-demand-dropdown': 'artEnthu_drpdown_list',
                    'artEnthu-profile-dropdown': 'profile_drpdown_list',
                    'artist-profile-dropdown': 'profile_drpdown_list',
                    'nav-drpdn': 'mobile_navigation_reveal'
                };

                Object.keys(dropdowns).forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.addEventListener('click', function (e) {
                            e.preventDefault();
                            const classToToggle = dropdowns[id];
                            if (document.body.classList.contains(classToToggle)) {
                                document.body.classList.remove(classToToggle);
                            } else {
                                closeAllDropdowns();
                                document.body.classList.add(classToToggle);
                            }
                            e.stopPropagation(); // Prevent the click from closing the dropdown
                        });
                    }
                });

            } else {
                console.log("No such document in users!");
            }
        }).catch((error) => {
            console.error("Error getting user document:", error);
        });

        console.log(user.uid);
    } else {
        console.error('No user is currently signed in.');
        alert('Please sign in.');
        window.location.href = '/Sign-up/Sign-up.html';
    }
});

// Function to close all dropdowns
function closeAllDropdowns() {
    const dropdownClasses = ['added_drpdown_list', 'artEnthu_drpdown_list', 'profile_drpdown_list', 'mobile_navigation_reveal'];
    dropdownClasses.forEach(cls => document.body.classList.remove(cls));
}

document.addEventListener('click', function (e) {
    closeAllDropdowns();
});

// Close dropdowns when pressing ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeAllDropdowns();
    }
});

const mobile_cross_drpdwn = document.getElementById('#mobile-nav-cross')
if(mobile_cross_drpdwn){
    document.body.classList.remove('mobile_navigation_reveal')
}