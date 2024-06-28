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


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize the map
tt.setProductInfo('Art Asta', '1.0');
const map = tt.map({
    key: 'Uuz1LGiCmQ7sFk2TGrm0UeudwWevEYhA',
    container: 'map',
    center: [19.899, 54.372], 
    zoom: 10,
    doubleClickZoom: true
});

map.on("load", () => {
    console.log('Map loaded');
});

// Function to add a marker with the artist's name and a popup
function addMarker(latitude, longitude, profile) {
    // Create the default marker
    const marker = new tt.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

    // Create a label for the artist's name
    const labelDiv = document.createElement('div');
    labelDiv.textContent = profile.Name;
    labelDiv.style.position = 'absolute';
    labelDiv.style.transform = 'translate(-50%, -100%)';
    labelDiv.style.backgroundColor = 'white';
    labelDiv.style.padding = '2px 5px';
    labelDiv.style.borderRadius = '3px';
    labelDiv.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
    labelDiv.style.color = 'black';
    labelDiv.style.fontSize = '12px';
    labelDiv.style.fontWeight = 'bold';

    // Attach the label to the marker's element
    marker.getElement().appendChild(labelDiv);

    // Create a popup with artist details
    const popupContent = `
        <h3>${profile.Name}</h3>
        <p><strong>Bio:</strong> ${profile.Bio}</p>
        <p><strong>Email:</strong> ${profile.Email}</p>
        <p><strong>Address:</strong> ${profile.Address}</p>
        <p><strong>Profession:</strong> ${profile.Profession}</p>
        <p><strong>Art Category:</strong> ${profile.ArtCategory}</p>
    `;
    const popup = new tt.Popup({ offset: 35 }).setHTML(popupContent);

    // Attach the popup to the marker
    marker.setPopup(popup);

    // Optionally open the popup immediately (remove if you want it to open on click only)
    // marker.togglePopup();
}

// Function to load geolocations from Firestore
async function loadGeolocations() {
    try {
        const querySnapshot = await getDocs(collection(db, "Artist"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.Geolocation) {
                addMarker(data.Geolocation.latitude, data.Geolocation.longitude, data);
            }
        });
    } catch (error) {
        console.error('Error fetching geolocations:', error);
    }
}

// Load geolocations and add markers
loadGeolocations();