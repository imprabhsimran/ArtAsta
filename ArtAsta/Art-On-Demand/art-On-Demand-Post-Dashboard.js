import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
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

async function loadData() {
    try {
        const snapshot = await getDocs(collection(db, "Art-on-demand"));
        const postsContainer = document.getElementById('postsContainer');

        snapshot.forEach(doc => {
            const postData = doc.data();
            const postElement = document.createElement('article');

            postElement.innerHTML = `
                ${postData.ImageUrl ? `<img src="${postData.ImageUrl}" alt="Post image" width="300">` : ''}
                <h2>${postData.Title || 'Untitled Post'}</h2>
                <p>${postData.Description || 'No content available.'}</p>
                <p><strong>Deadline By:</strong> ${postData.Deadline || 'Unknown date'}</p>
            `;

            console.log("dnfjdf")
            postsContainer.appendChild(postElement);
            postsContainer.appendChild(document.createElement('hr'));
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadData);