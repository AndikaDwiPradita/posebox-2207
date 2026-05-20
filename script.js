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

bukaKamera(currentMode);

/* ===================================
Bagian Canvas (menyimpan hasil foto)
====================================== */
let selectedTimer = 3;

const countdownEl = document.getElementById("countdown");

// tombol timer
const timerButtons = document.querySelectorAll(".timer button");

document.getElementById("s3").onclick = () => {

  selectedTimer = 3;

  setActiveButton("s3");

};

document.getElementById("s5").onclick = () => {

  selectedTimer = 5;

  setActiveButton("s5");

};

document.getElementById("s10").onclick = () => {

  selectedTimer = 10;

  setActiveButton("s10");

};

function setActiveButton(id) {

  timerButtons.forEach(button => {

    button.classList.remove("active");

  });

  document.getElementById(id).classList.add("active");

}




// =========================
// SETTINGS
// =========================

const popup = document.getElementById("settingsPopup");

const flashToggle = document.getElementById("flashToggle");

const soundToggle = document.getElementById("soundToggle");

let flashEnabled = true;
let soundEnabled = true;

// buka popup
function settings() {

  popup.style.display = "flex";

}

// tutup popup
document.getElementById("closePopup").onclick = () => {

  popup.style.display = "none";

};

// toggle flash
flashToggle.addEventListener("change", () => {

  flashEnabled = flashToggle.checked;

});

// toggle suara
soundToggle.addEventListener("change", () => {

  soundEnabled = soundToggle.checked;

});


let isTakingPhoto = false;
async function takeFoto() {

  if (isTakingPhoto) return;

  isTakingPhoto = true;

  let timeLeft = selectedTimer;

  countdownEl.style.display = "block";
  countdownEl.innerText = timeLeft;

  // countdown berjalan
  const timer = setInterval(() => {

    timeLeft--;

    if (timeLeft > 0) {

      countdownEl.innerText = timeLeft;

    } else {

      clearInterval(timer);

      countdownEl.style.display = "none";
      
      // FLASH
if (flashEnabled) {

  const flash = document.getElementById("flash");

  flash.style.opacity = "1";

  setTimeout(() => {
    flash.style.opacity = "0";
  }, 100);

}

// SOUND
if (soundEnabled) {

  document.getElementById("shutter").play();

}

      // =========================
      // AMBIL FOTO
      // =========================

      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/png");
      
      // container foto
      const fotoItem = document.createElement("div");
      
      fotoItem.classList.add("foto-item");
      
      // gambar
      const img = document.createElement("img");
      
      img.src = imageData;
      
      // tombol hapus
      const hapusBtn = document.createElement("button");
      
      hapusBtn.innerHTML = "✖";
      
      hapusBtn.classList.add("hapus-btn");
      
      // saat tombol ditekan
      hapusBtn.onclick = () => {
      
        fotoItem.remove();
      
      };
      
      // masukkan ke container
      fotoItem.appendChild(img);
      
      fotoItem.appendChild(hapusBtn);
      
      // tampilkan di hasil
      document.getElementById("hasil").prepend(fotoItem);
      
      isTakingPhoto = false;

    }

  }, 1000);

}



