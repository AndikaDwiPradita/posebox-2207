let stream;
let currentMode = "user"; // kamera depan default

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

    document.getElementById("video").srcObject = stream;

  } catch (err) {
    console.log("Error kamera:", err);
  }
}

function gantiKamera() {
  currentMode =
    currentMode === "user"
      ? "environment"
      : "user";

  bukaKamera(currentMode);
}

// Pertama buka kamera depan
bukaKamera(currentMode);

function settings() {
  alert("Settings");
}

function takeFoto() {
  alert("Foto diambil");
}