let video_permission =  document.getElementById("main-video");
const startBtn = document.getElementById('start');
const snapBtn = document.getElementById('snap');
const stopBtn = document.getElementById('stop');


if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true})
    .then((source)=>{
        src.object = source
    })
    .catch((error)=>{
        console.log(error)
    })
}
else {
    console.log("this browser doesn't support media devices");
  }

  //reference : https://davidwalsh.name/browser-camera
// Elements for taking the snapshot
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');


function startCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` bcuz we only want video
    const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
    mediaPromise.then((stream) => { // called if successful
      video.srcObject = stream;
      // video.play();  // or autplay
      startBtn.disabled = true;
      snapBtn.disabled = false;
      stopBtn.disabled = false;
    });
    mediaPromise.catch((error) => { // called if failed
      console.error(error);
      context.font = '16px Tahoma';
      context.fillStyle = 'darkred';
      context.fillText(error, 25, 80);
    });
  } else {
    console.log("this browser doesn't support media devices");
  }
}
// attach startCamera function to start button
startBtn.addEventListener('click', startCamera);

function stopCamera() {
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  startBtn.disabled = false;
  snapBtn.disabled = true;
  stopBtn.disabled = true;
}
// attach stopCamera function to stop button
stopBtn.addEventListener('click', stopCamera);

// attach snapPhoto function to snap button
snapBtn.addEventListener('click', snapPhoto);

// Trigger taking photo
function snapPhoto() {
  //to scale properly we pass canvas width & height too
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const canvasDataURL = canvas.toDataURL();
  //you can upload this to store image in an Storage
  console.log(canvasDataURL);

  //this just shows we can also create image element
  createSnapshotImage(canvasDataURL);
}

function createSnapshotImage(dataURL) {
  const copyImg = document.createElement('img');
  copyImg.style.height = '120px';
  copyImg.src = dataURL;
  document.body.appendChild(copyImg);
}

/*
// ETXTRA:

//we can also get canvas content as blob (a file-like object)
// for that you would need a callback function e.g.
// canvas.toBlob(handleBlob, 'image/jpeg');

function handleBlob(blob) {

  // if we want to store the image into server
  //if the server accept the blob , simply upload the blob here 
  //e.g. in case of firebase storage
     const storage = getStorage(app); // default bucket
    const imageRef = ref(storage,  'photo_'+Date.now());
    await uploadBytes(imageRef, blob) 
 
}
*/
