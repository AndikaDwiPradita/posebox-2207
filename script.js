let stream;

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
    console.log(err);
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