import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submit');
    const buyer_name = document.getElementById('name');
    const buyer_bio = document.getElementById('bio');
    const buyer_mobile = document.getElementById('mobile');
    const buyer_address = document.getElementById('address');
    const profileImageInput = document.getElementById('profileImage');
    let emailbp = " ";
    let user_id;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            user_id = user.uid;
            console.log(user.uid);
            let userDocRef = doc(db, "Users", user.uid);
            getDoc(userDocRef).then((userDocSnap) => {
                if (userDocSnap.exists()) {
                    let userData = userDocSnap.data();
                    console.log("User data:", userData);
                    emailbp = userData.email;
                    console.log(emailbp);
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

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const file = profileImageInput.files[0];
        const profileImageRef = ref(storage, `images/${file.name}`);

        await uploadBytes(profileImageRef, file);
        const profileUrl = await getDownloadURL(profileImageRef);

        const buyerData = {
            uid: user_id,
            Name: buyer_name.value,
            Bio: buyer_bio.value,
            Email: emailbp,
            Mobile: buyer_mobile.value,
            Address: buyer_address.value,
            ProfileUrl: profileUrl
        };

        const buyerRef = doc(db, "Art-enthusiast", user_id);
        setDoc(buyerRef, buyerData)
            .then(() => {
                console.log("Buyer document created successfully!");
                window.location.href = '/Homepage-dashboard/homepage.html';
            })
            .catch((error) => {
                console.error("Error creating buyer document:", error);
            });

        document.getElementById("buyer_info_form").reset();
    });
});