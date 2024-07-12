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
    center: [0, 0], 
    zoom: 2, 
    doubleClickZoom: true
});

map.on("load", () => {
    console.log('Map loaded');
});

// Function to add a marker with the artist's name and a popup
function addMarker(latitude, longitude, profile) {

    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker'; // Assign a class
    markerElement.title = profile.Name;

    // Create the default marker
    const marker = new tt.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

    // Create a label for the artist's name
    const labelDiv = document.createElement('div');
    labelDiv.textContent = profile.Name;
    labelDiv.className = 'marker-label'; 

    // Attach the label to the marker's element
    marker.getElement().appendChild(labelDiv);

    // Create a popup with artist details and artwork images
    const popupContent = `
        <div class="mapboxgl-popup-content">
            <div class="artwork-grid">
                ${profile.ArtworkUrls.slice(0, 3).map(url => `
                    <div class="artwork-item">
                        <img src="${url}" alt="Artwork by ${profile.Name}" />
                    </div>
                `).join('')}
            </div>
            <div class="artist-profile">
                <img src="${profile.ProfileUrl}" alt="${profile.Name}" class="profile-picture" />
                <div class="artist-details">
                    <h3>${profile.Name}</h3>
                    <p class="profession">${profile.Profession}</p>
                    <p class="address">${profile.Address}</p>
                    <p class="bio">${profile.Bio}</p>
                </div>
            </div>
        </div>
    `;
    const popup = new tt.Popup({ offset: 35 }).setHTML(popupContent);
    marker.setPopup(popup);
}

// Function to calculate the centroid of a set of coordinates
function calculateCentroid(coordinates) {
    let sumLat = 0, sumLng = 0;
    coordinates.forEach(coord => {
        sumLat += coord.latitude;
        sumLng += coord.longitude;
    });
    return {
        latitude: sumLat / coordinates.length,
        longitude: sumLng / coordinates.length
    };
}

// Function to load geolocations from Firestore
async function loadGeolocations() {
    const geolocations = [];
    try {
        const querySnapshot = await getDocs(collection(db, "Artist"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.Geolocation) {
                addMarker(data.Geolocation.latitude, data.Geolocation.longitude, data);
                geolocations.push(data.Geolocation);
            }
        });

        if (geolocations.length > 0) {
            // Calculate the centroid and set the map center to it
            const centroid = calculateCentroid(geolocations);
            map.setCenter([centroid.longitude, centroid.latitude]);
            map.setZoom(10); // Adjust the zoom level as needed
        }
    } catch (error) {
        console.error('Error fetching geolocations:', error);
    }
}

// Load geolocations and add markers
loadGeolocations();