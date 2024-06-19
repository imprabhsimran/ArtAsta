import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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


// Initializing the map
tt.setProductInfo('Art Asta', '1.0');
var map = tt.map({
    key: 'Uuz1LGiCmQ7sFk2TGrm0UeudwWevEYhA',
    container: 'map',
    center: [19.899, 54.372], 
    zoom: 10,
    doubleClickZoom: true
});

map.on("load", () => {
    new tt.Marker.setLangLat(center).addTo(map);
})

function addMarker(latitude, longitude, name) {
    var marker = new tt.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

    var popup = new tt.Popup({ offset: 55 }).setText(name);
    marker.setPopup(popup).togglePopup();
}


async function loadGeolocations() {
    try {
        const mapSnapshot = await getDocs(collection(db, "Geolocation"));
        let i=1;
        mapSnapshot.forEach((doc) => {
            const data = doc.data();
            addMarker(data.latitude, data.longitude, `Artist ${i}`);
            i++;
        });
    } catch (error) {
        console.error('Error fetching geolocations:', error);
    }
}

// Calling the function to load geolocations and add markers
loadGeolocations();