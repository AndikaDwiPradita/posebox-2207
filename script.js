/* ===================================
Bagian Kamera
====================================== */ 
let stream;
let currentMode = "user";

const video = document.getElementById("video");

async function bukaKamera(mode) {

  // Matikan kamera sebelumnya
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  try {

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: mode
      },
      audio: false
    });

    video.srcObject = stream;

    await video.play();

    console.log("Kamera berhasil aktif");

  } catch (err) {

    console.log("ERROR:", err);
    alert(err.message);

  }
}

function gantiKamera() {

  currentMode =
    currentMode === "user"
      ? "environment"
      : "user";

  bukaKamera(currentMode);
}

function settings() {
  alert("Settings");
}

function takeFoto() {
  alert("Foto");
}

bukaKamera(currentMode);

/* ===================================
Bagian Canvas (menyimpan hasil foto)
====================================== */
function takeFoto() {

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0);

  const image = canvas.toDataURL("image/png");

  const img = document.createElement("img");
  img.src = image;

  document.getElementById("hasil").appendChild(img);
}

/* ===================================
Bagian Timer
====================================== */ 
let delay = 3;

document.getElementById("s3").onclick = () => delay = 3;
document.getElementById("s5").onclick = () => delay = 5;
document.getElementById("s10").onclick = () => delay = 10;