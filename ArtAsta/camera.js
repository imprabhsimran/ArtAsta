
const videoElement = document.getElementById("main-video");
const startBtn = document.getElementById('start');
const snapBtn = document.getElementById('snap');
const stopBtn = document.getElementById('stop');

// Check for getUserMedia support
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
} else {
  console.log("This browser doesn't support media devices.");
}

// Elements for taking the snapshot
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function startCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
    mediaPromise.then((stream) => {
      videoElement.srcObject = stream;
      startBtn.disabled = true;
      snapBtn.disabled = false;
      stopBtn.disabled = false;
    });
    mediaPromise.catch((error) => {
      console.error(error);
      context.font = '16px Tahoma';
      context.fillStyle = 'darkred';
      context.fillText(error, 25, 80);
    });
  } else {
    console.log("This browser doesn't support media devices.");
  }
}

function stopCamera() {
  const tracks = videoElement.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  videoElement.srcObject = null;
  startBtn.disabled = false;
  snapBtn.disabled = true;
  stopBtn.disabled = true;
}

function snapPhoto() {
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const canvasDataURL = canvas.toDataURL();
  console.log(canvasDataURL);
  createSnapshotImage(canvasDataURL);
}

function createSnapshotImage(dataURL) {
  const copyImg = document.createElement('img');
  copyImg.style.height = '120px';
  copyImg.src = dataURL;
  document.body.appendChild(copyImg);
}

// Attach event listeners to buttons
startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);
snapBtn.addEventListener('click', snapPhoto);
