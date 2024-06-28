import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Art Asta's Firebase configuration
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
        const gettingData = await getDocs(collection(db, "Auction"));
        const addDataContainer = document.getElementById('container2');

        // Convert Firestore collection to an array and sort it by StartBid
        const sortedData = gettingData.docs.map(doc => doc.data()).sort((a, b) => a.StartBid - b.StartBid);

        sortedData.forEach(postData => {
            const article_items = document.createElement('article');

            article_items.innerHTML = `
                <h2>${postData.Title || 'Untitled Post'}</h2>
                <p>${postData.Description || 'No content available.'}</p>
                <p><strong>Starting Bid:</strong> ${postData.StartBid || 'Unknown Bid'}</p>
                <p><strong>Duration:</strong> ${postData.BidDur || 'Unknown Duration'}</p>
                <p><strong>Starting Time:</strong> ${postData.StartTime || 'Unknown StartTime'}</p>
            `;

            console.log(postData)
            addDataContainer.appendChild(article_items);
        });
    } catch (error) {
        console.log('Error loading data:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadData());
