import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
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

// Event listener for form submission
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const fileInput = document.getElementById('postImage').files[0]; // Get the selected file
    const filePath = `images/${fileInput.name}`; // Path within the storage bucket

    // Create a reference to the file path
    const fileRef = ref(storage, filePath);

    try {
        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(fileRef, fileInput);
        console.log('File uploaded successfully');

        // Get download URL of the uploaded file
        const downloadURL = await getDownloadURL(fileRef);
        console.log('Download URL:', downloadURL);

        // Add document with the download URL to Firestore
        await addDoc(collection(db, 'images'), { url: downloadURL });
        console.log('Document added to Firestore');

        // Optionally reset form or show success message
        document.getElementById('postForm').reset(); // Reset the form after successful upload
    } catch (error) {
        console.error('Error uploading file or adding document:', error);
    }
});
