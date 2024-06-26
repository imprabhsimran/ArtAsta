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

async function loadData() {
    try {
        const snapshot = await getDocs(collection(db, "Auction"));
        const postsContainer = document.getElementById('postsnewContainer');

        snapshot.forEach(doc => {
            const postData = doc.data();
            const postElement = document.createElement('article');

            postElement.innerHTML = `
                <img src="${postData.ImageUrl || 'placeholder.jpg'}" alt="${postData.Title || 'No title'}">
                <h2>${postData.Title || 'Untitled Post'}</h2>
                <p><strong>Artist:</strong> ${postData.Artist || 'Unknown'}</p>
                <p><strong>Start Time:</strong> ${postData.StartTime || 'Unknown'}</p>
                <p><strong>Current Bid:</strong> $${postData.StartBid || 'N/A'}</p>
                <p><strong>Bid Duration:</strong> ${postData.BidDur|| 'N/A'} days</p>
                <button>Place a Bid</button>
            `;

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle View';
    toggleButton.style.margin = '1rem';
    document.body.insertBefore(toggleButton, document.body.firstChild);

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('grid-view');
        document.body.classList.toggle('list-view');
    });

    document.body.classList.add('list-view');
});
