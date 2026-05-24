/* ===================================
Bagian Kamera
====================================== */
let stream;
let currentMode = "user";
const video = document.getElementById("video");

async function bukaKamera(mode) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert(err.message);
  }
}

function gantiKamera() {
  currentMode = currentMode === "user" ? "environment" : "user";
  bukaKamera(currentMode);
}

bukaKamera(currentMode);
buatStrip();

/* ===================================
Timer
====================================== */
let selectedTimer = 3;
const countdownEl = document.getElementById("countdown");
const timerButtons = document.querySelectorAll(".timer button");

function setActiveButton(id) {
  timerButtons.forEach(button => button.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

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

setActiveButton("s3");

/* ===================================
SETTINGS
====================================== */
const popup = document.getElementById("settingsPopup");
const flashToggle = document.getElementById("flashToggle");
const soundToggle = document.getElementById("soundToggle");
let flashEnabled = true;
let soundEnabled = true;

function settings() {
  popup.style.display = "flex";
}

document.getElementById("closePopup").onclick = () => {
  popup.style.display = "none";
};

flashToggle.addEventListener("change", () => {
  flashEnabled = flashToggle.checked;
});

soundToggle.addEventListener("change", () => {
  soundEnabled = soundToggle.checked;
});

/* ===================================
FILTER
====================================== */
const filterPopup = document.getElementById("filterPopup");

function openFilterPopup() {
  filterPopup.style.display = "flex";
}

document.getElementById("closeFilterPopup").onclick = () => {
  filterPopup.style.display = "none";
};

function setFilter(filter) {
  video.style.filter = filter;
}

/* ===================================
FOTO & STRIP
====================================== */
let isTakingPhoto = false;
let selectedTemplate = "pink";
const MAX_STRIP = 3;
let stripPhotos = [null, null, null];
let currentSlot = 0;
let activeSticker = null;

// Fungsi untuk membuka/tutup popup template (background)
function openTemplatePopup() {
  document.getElementById("templatePopup").style.display = "flex";
}
function closeTemplate() {
  document.getElementById("templatePopup").style.display = "none";
}
function pilihTemplate(nama) {
  selectedTemplate = nama;
  closeTemplate();
  if (stripPhotos.some(photo => photo !== null)) {
    buatStrip();
  }
}

// Fungsi untuk membuka/tutup popup stiker
function openStickerPopup() {
  document.getElementById("stickerPopup").style.display = "flex";
}
document.getElementById("closeStickerPopup").onclick = () => {
  document.getElementById("stickerPopup").style.display = "none";
};
function pilihStiker(emoji) {
  activeSticker = emoji;
  document.getElementById("stickerPopup").style.display = "none";
  if (stripPhotos.some(photo => photo !== null)) {
    buatStrip();
  }
}

// Fungsi menggambar stiker ke canvas
function drawSticker(ctx, emoji, x, y, size) {
  ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillText(emoji, x+2, y+2);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(emoji, x, y);
}

// Retake foto tertentu
function retakeSlot(index){
stripPhotos[index]=null;
currentSlot=index;
buatStrip();
}

// Fungsi utama membuat strip foto
async function buatStrip() {
  const container = document.getElementById("hasilStrip");
  if (!container) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const lebar = 800;
  const tinggiFoto = 540;
  const jarak = 30;
  const tinggiTotal = MAX_STRIP * (tinggiFoto + jarak) + 180;
  canvas.width = lebar;
  canvas.height = tinggiTotal;

  // 1. Background berdasarkan template
  let bgColor, textColor;
  switch (selectedTemplate) {
    case "dark":
      bgColor = "#1a1a2e";
      textColor = "#eee";
      break;
    case "retro":
      bgColor = "#f4e1c1";
      textColor = "#6b3e1f";
      break;
    case "minimal":
      bgColor = "#ffffff";
      textColor = "#222";
      break;
    case "canva":
      bgColor = "gradient";
      textColor = "#2d3436";
      break;
    default:
      bgColor = "#ffe4ec";
      textColor = "#b34180";
  }

  if (bgColor === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#fdebf7");
    grad.addColorStop(1, "#fff3e6");
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = bgColor;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Judul
  ctx.fillStyle = textColor;
  ctx.font = "bold 44px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PoseBox", lebar/2, 70);

  // 2. Gambar 3 foto (atau placeholder)
  for (let i = 0; i < MAX_STRIP; i++) {
    const yBase = 140 + i * (tinggiFoto + jarak);
    if (!stripPhotos[i]) {
      // Placeholder kosong
      ctx.fillStyle = "#eeeeee";
      ctx.fillRect(50, yBase, 700, tinggiFoto);
      ctx.fillStyle = "#999";
      ctx.font = "40px 'Poppins'";
      ctx.textAlign = "center";
      ctx.fillText("📷 Kosong", lebar/2, yBase + tinggiFoto/2);
      continue;
    }
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 700;
        const maxH = tinggiFoto - 30;
        let w = img.width;
        let h = img.height;
        if (w > maxW) { h = (h * maxW) / w; w = maxW; }
        if (h > maxH) { w = (w * maxH) / h; h = maxH; }
        const x = (lebar - w) / 2;
        const y = yBase + (tinggiFoto - h) / 2;

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x-12, y-12, w+24, h+24);
        ctx.shadowBlur = 0;
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();

        ctx.font = "bold 20px 'Poppins'";
        ctx.fillStyle = textColor;
        ctx.fillText(`${i+1}`, x+15, y+35);
        resolve();
      };
      img.src = stripPhotos[i];
    });
  }

  // 3. Stiker (jika ada) - ditempatkan di pojok kiri atas dan kanan bawah setiap frame
  if (activeSticker) {
    const ukuran = 70;
    for (let i = 0; i < MAX_STRIP; i++) {
      const yBase = 140 + i * (tinggiFoto + jarak);
      // kiri atas
      drawSticker(ctx, activeSticker, 70, yBase + 60, ukuran);
      // kanan bawah
      drawSticker(ctx, activeSticker, 730, yBase + tinggiFoto - 60, ukuran);
    }
  }

  // Footer tanggal
  const today = new Date().toLocaleDateString("id-ID", { day:'numeric', month:'long', year:'numeric' });
  ctx.font = "italic 16px 'Poppins'";
  ctx.fillStyle = textColor;
  ctx.fillText(`dicapture • ${today}`, lebar/2, canvas.height-35);

  // Tampilkan hasil strip
  const resultImg = document.createElement("img");
  resultImg.src = canvas.toDataURL("image/png");
  container.innerHTML = "";

  container.appendChild(resultImg);
  
  // WRAPPER tombol
  const retakeWrapper =
  document.createElement("div");
  
  retakeWrapper.className =
  "retake-wrapper";
  
  for (
  let i=0;
  i<MAX_STRIP;
  i++
  ){
  
  if(stripPhotos[i]){
  
  const btn =
  document.createElement(
  "button"
  );
  
  btn.innerText =
  `📸 ${i+1}`;
  
  btn.onclick=
  ()=>retakeSlot(i);
  
  retakeWrapper
  .appendChild(
  btn
  );
  
  }
  
  }
  
  container
  .appendChild(
  retakeWrapper
  );

  // Tombol download
  const downloadBtn = document.getElementById("downloadStripBtn");
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      const link = document.createElement("a");
      link.download = "posebox.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  }
}

// Fungsi ambil foto (takeFoto) yang sudah dimodifikasi untuk strip
async function takeFoto() {
  if (isTakingPhoto) return;
  isTakingPhoto = true;

  let timeLeft = selectedTimer;
  countdownEl.style.display = "block";
  countdownEl.innerText = timeLeft;

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
        setTimeout(() => { flash.style.opacity = "0"; }, 100);
      }

      // SOUND
      if (soundEnabled) {
        document.getElementById("shutter").play().catch(() => {});
      }

      // Ambil gambar dari video
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.filter = video.style.filter;
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/png");

      // Simpan ke stripPhotos di slot yang tersedia
      stripPhotos[currentSlot] = imageData;
      // cari slot kosong berikutnya
      const next = stripPhotos.findIndex(
        p => p === null
        );
        currentSlot =
        next === -1
        ? MAX_STRIP
        : next;

      buatStrip();
      isTakingPhoto = false;
    }
  }, 1000);
}