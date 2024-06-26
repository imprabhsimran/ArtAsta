// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDu1mNebskATIVQmz59QosBS1AhdMAkxqM",
    authDomain: "art-asta-50475.firebaseapp.com",
    projectId: "art-asta-50475",
    storageBucket: "art-asta-50475.appspot.com",
    messagingSenderId: "343332230219",
    appId: "1:343332230219:web:efe5a85c164e5e461c69ce"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();
const form = document.getElementById('imageUploadForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    // Create a storage reference
    const storageRef = storage.ref();

    // Upload file to Firebase Storage
    const uploadTask = storageRef.child('images/' + file.name).put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            console.log('Upload is ' + snapshot.state);
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error(error);
        },
        () => {
            // Handle successful uploads on complete
            console.log('File uploaded successfully');
            // You can get the download URL for the file here
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                // Use this URL for displaying the image or storing it in a database
            });
        }
    );
});
