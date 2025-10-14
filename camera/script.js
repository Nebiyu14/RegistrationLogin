const cameraFeed = document.querySelector("#camera");
const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
let stream;
startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);

//start camera
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraFeed.srcObject = stream;
  } catch (error) {
    console.log("Camera access denied or not available", error);
  }
}
startCamera();

//stop camera

function stopCamera() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    cameraFeed.srcObject = null;
  }
}
stopCamera();
