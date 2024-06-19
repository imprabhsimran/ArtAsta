// Importing the required functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//Art Asta's Firebase configuration
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

let allowLocation = document.getElementById('allow');
let disableLocation = document.getElementById('disable');
let locationDiv = document.getElementById('location');

allowLocation.addEventListener('click', function(e){
    e.preventDefault();

    if (navigator.geolocation) {
        console.log("Geolocation is supported");

        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            locationDiv.innerHTML = "";
            locationDiv.innerHTML += `Latitude: ${latitude}, Longitude: ${longitude}`;

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            try {
                await addDoc(collection(db, "Geolocation"), {
                    latitude: latitude,
                    longitude: longitude,
                    timestamp: new Date()
                });
                console.log("Geolocation successfully saved!");
            } catch (error) {
                console.error("Error saving geolocation: ", error);
            }
        }, function (error) {
            console.error("Error fetching geolocation: ", error);
        });
    } else {
        console.log("Geolocation is not supported.");
    }
});

disableLocation.addEventListener('click', function(e){
    e.preventDefault();

    locationDiv.innerHTML = "";
    locationDiv.innerHTML += `Location disabled.`
});
