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
    applyMirror();
  } catch (err) {
    alert(err.message);
  }
}

function gantiKamera() {
  currentMode = currentMode === "user" ? "environment" : "user";
  bukaKamera(currentMode);
}

function applyMirror() {
  if (currentMode === "user") {
    video.style.transform = "scaleX(-1)";
  } else {
    video.style.transform = "scaleX(1)";
  }
}

bukaKamera(currentMode);

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

function openTemplatePopup() {
  document.getElementById("templatePopup").style.display = "flex";
}
function closeTemplate() {
  document.getElementById("templatePopup").style.display = "none";
}
function pilihTemplate(nama) {
  selectedTemplate = nama;
  
  // Jika template ini punya stiker bawaan, aktifkan stiker tersebut
  if (templateStikerBawaan[nama]) {
    activeSticker = {
      type: "image",
      src: templateStikerBawaan[nama],
      width: 80,   // sesuaikan dengan lebar stiker Anda (dalam pixel canvas)
      height: 80   // sesuaikan
    };
  } else {
    // Jika tidak ada stiker bawaan, biarkan activeSticker seperti sebelumnya (atau null)
    // activeSticker = null; // hati-hati jangan hapus pilihan user sebelumnya
  }
  
  closeTemplate();
  buatStrip();
}

// Template gambar PNG (dari Canva)
const templateGambar = {
  "strip-1": "assets/strip/strip-1.png",
  "strip-2": "assets/strip/strip-2.png",
  "strip-3": "assets/strip/strip-3.png",
  "strip-4": "assets/strip/strip-4.png",
  "strip-5": "assets/strip/strip-5.png"
};

// Stiker bawaan untuk setiap template gambar
const templateStikerBawaan = {
  "strip-1": "assets/sticker/sticker-1.png",
  "strip-2": "assets/sticker/sticker-2.png",
  "strip-3": "assets/sticker/sticker-3.png",
  "strip-4": "assets/sticker/sticker-4.png",
  "strip-5": "assets/sticker/sticker-5.png"
};

// Untuk stiker yang diupload user (opsional, bisa emoji atau gambar custom nanti)
let activeSticker = null;       // bisa berisi string emoji atau object { type: "image", src: "path" }

function openStickerPopup() {
  document.getElementById("stickerPopup").style.display = "flex";
}
document.getElementById("closeStickerPopup").onclick = () => {
  document.getElementById("stickerPopup").style.display = "none";
};
function pilihStiker(emoji) {
  activeSticker = emoji;
  document.getElementById("stickerPopup").style.display = "none";
  buatStrip();
}

function drawSticker(ctx, sticker, x, y) {
  if (!sticker) return;
  
  // Jika sticker berupa object gambar PNG
  if (sticker.type === "image") {
    const img = new Image();
    img.src = sticker.src;
    // Gambar di koordinat (x, y) dengan ukuran sticker.width, sticker.height
    // Untuk menghindari async, kita gambar langsung karena gambar mungkin belum load.
    // Cara terbaik: load gambar di awal (cache) atau gunakan await di buatStrip.
    // Tapi untuk kemudahan, kita gambar di sini dengan gambar yang sudah di-cache.
    // Kita perlu pastikan gambar termuat sebelum dipanggil. Alternatif: gambar di buatStrip dengan await.
    // Saya akan modifikasi pemanggilan di buatStrip nanti.
    ctx.drawImage(img, x, y, sticker.width, sticker.height);
  } 
  // Jika sticker berupa emoji (string)
  else if (typeof sticker === "string") {
    ctx.font = `70px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillText(sticker, x + 2, y + 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(sticker, x, y);
  }
}

function retakeSlot(index) {
  stripPhotos[index] = null;
  currentSlot = index;
  buatStrip();
  countdownEl.style.display = "block";
  countdownEl.innerText = `Retake ${index+1}`;
  setTimeout(() => {
    countdownEl.style.display = "none";
  }, 1000);
}

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

  // Cek apakah template berupa gambar PNG dari Canva
  if (templateGambar[selectedTemplate]) {
    const bgImg = new Image();
    bgImg.src = templateGambar[selectedTemplate];
    await new Promise((resolve) => {
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        resolve();
      };
    });
  } else {
    // Jika bukan gambar, pakai warna solid/gradien
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
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Simpan textColor untuk digunakan nanti
    window._tempTextColor = textColor;
  }

  // Gunakan textColor yang sudah disimpan, atau untuk template gambar gunakan warna putih
  let textColor = window._tempTextColor || "#fff";
  if (templateGambar[selectedTemplate]) textColor = "#333"; // sesuaikan

  // Judul (jika template gambar, mungkin tidak perlu, tapi tetap ditulis)
  ctx.fillStyle = textColor;
  ctx.font = "bold 44px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PoseBox", lebar / 2, 70);

  // 2. Gambar 3 foto (atau placeholder)
  for (let i = 0; i < MAX_STRIP; i++) {
    const yBase = 140 + i * (tinggiFoto + jarak);
    if (!stripPhotos[i]) {
      ctx.fillStyle = "#eeeeee";
      ctx.fillRect(50, yBase, 700, tinggiFoto);
      ctx.fillStyle = "#999";
      ctx.font = "40px 'Poppins'";
      ctx.fillText("📷 Kosong", lebar / 2, yBase + tinggiFoto / 2);
      continue;
    }
    
    // Gambar stiker overlay (jika ada template stiker)
if (templateStiker[selectedTemplate]) {
  const stikerImg = new Image();
  stikerImg.src = templateStiker[selectedTemplate];
  await new Promise((resolve) => {
    stikerImg.onload = () => {
      ctx.drawImage(stikerImg, 0, 0, canvas.width, canvas.height);
      resolve();
    };
  });
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
        ctx.fillRect(x - 12, y - 12, w + 24, h + 24);
        ctx.shadowBlur = 0;
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();

        ctx.font = "bold 20px 'Poppins'";
        ctx.fillStyle = textColor;
        ctx.fillText(`${i + 1}`, x + 25, y + 45);
        resolve();
      };
      img.src = stripPhotos[i];
    });
  }

  // 3. Stiker (jika ada)
  if (activeSticker) {
  // Jika activeSticker adalah object gambar
  if (activeSticker.type === "image") {
    // Load gambar stiker
    const stickerImg = new Image();
    stickerImg.src = activeSticker.src;
    await new Promise((resolve) => {
      stickerImg.onload = () => {
        // Tentukan posisi stiker (sesuai desain Canva Anda)
        // Contoh: stiker diletakkan di pojok kanan atas setiap frame (x = 730, y = yBase + 60)
        // Atau bisa juga hanya satu stiker besar di tengah strip? Sesuaikan.
        for (let i = 0; i < MAX_STRIP; i++) {
          const yBase = 140 + i * (tinggiFoto + jarak);
          // Posisi: kanan atas frame (seperti emoji sebelumnya)
          ctx.drawImage(stickerImg, 730, yBase + 60, activeSticker.width, activeSticker.height);
          // Bisa juga tambah posisi lain jika perlu
        }
        resolve();
      };
    });
  } 
  // Jika activeSticker adalah string emoji
  else if (typeof activeSticker === "string") {
    const ukuran = 70;
    for (let i = 0; i < MAX_STRIP; i++) {
      const yBase = 140 + i * (tinggiFoto + jarak);
      drawSticker(ctx, activeSticker, 70, yBase + 60, ukuran);
      drawSticker(ctx, activeSticker, 730, yBase + tinggiFoto - 60, ukuran);
    }
  }
}

  // Footer tanggal
  const today = new Date().toLocaleDateString("id-ID", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  ctx.font = "italic 16px 'Poppins'";
  ctx.fillStyle = textColor;
  ctx.fillText(`dicapture • ${today}`, lebar / 2, canvas.height - 35);

  // Tampilkan hasil strip
  const resultImg = document.createElement("img");
  resultImg.src = canvas.toDataURL("image/png");
  container.innerHTML = "";

  const preview = document.createElement("div");
  preview.className = "strip-preview";
  preview.appendChild(resultImg);

  resultImg.onload = () => {
    const scale = resultImg.clientHeight / canvas.height;
    for (let i = 0; i < MAX_STRIP; i++) {
      if (stripPhotos[i]) {
        const btn = document.createElement("button");
        btn.className = "retake-x";
        btn.innerHTML = "✕";
        const yBase = 140 + i * (tinggiFoto + jarak);
        btn.style.left = (20 * scale) + "px";
        btn.style.top = ((yBase + 10) * scale) + "px";
        btn.onclick = () => retakeSlot(i);
        preview.appendChild(btn);
      }
    }
  };
  container.appendChild(preview);

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

      if (flashEnabled) {
        const flash = document.getElementById("flash");
        flash.style.opacity = "1";
        setTimeout(() => { flash.style.opacity = "0"; }, 100);
      }
      if (soundEnabled) {
        document.getElementById("shutter").play().catch(() => {});
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");

      if (currentMode === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      context.filter = video.style.filter;
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/png");

      if (currentSlot >= MAX_STRIP) {
        alert("Semua frame terisi. Gunakan retake.");
        isTakingPhoto = false;
        return;
      }
      stripPhotos[currentSlot] = imageData;
      const next = stripPhotos.findIndex(p => p === null);
      currentSlot = next === -1 ? MAX_STRIP : next;

      buatStrip();
      isTakingPhoto = false;
    }
  }, 1000);
}

// ===================================
// TEMA WEBSITE (Global)
// ===================================
function openTemaPopup() {
  document.getElementById("temaPopup").style.display = "flex";
}
function closeTemaPopup() {
  document.getElementById("temaPopup").style.display = "none";
}
function pilihTema(tema) {
  if (tema === "creammaroon") {
    document.body.classList.add("tema-creammaroon");
    document.body.classList.remove("tema-pink");
  } else {
    document.body.classList.add("tema-pink");
    document.body.classList.remove("tema-creammaroon");
  }
  closeTemaPopup();
}
document.body.classList.add("tema-pink");

// ========== UPLOAD GAMBAR ==========
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("File harus gambar!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;

    if (currentSlot >= MAX_STRIP) {
      alert("Semua frame terisi. Gunakan retake.");
      return;
    }
    stripPhotos[currentSlot] = imageData;
    const next = stripPhotos.findIndex(p => p === null);
    currentSlot = next === -1 ? MAX_STRIP : next;
    buatStrip();
  };
  reader.readAsDataURL(file);
  fileInput.value = "";
});

// ========== THUMBNAIL TEMPLATE (PREVIEW GAMBAR) ==========
const templateList = [
  { id: "pink", label: "🌸 Pink", bg: "#ffe4ec", text: "#b34180" },
  { id: "dark", label: "🖤 Dark", bg: "#1a1a2e", text: "#eee" },
  { id: "retro", label: "📼 Retro", bg: "#f4e1c1", text: "#6b3e1f" },
  { id: "minimal", label: "🤍 Minimal", bg: "#ffffff", text: "#222" }
];

// Fungsi membuat thumbnail (gambar kecil) untuk suatu template
async function buatThumbnail(templateId, width = 120, height = 200) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  let bgColor, textColor;
  switch (templateId) {
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
    default:
      bgColor = "#ffe4ec";
      textColor = "#b34180";
  }

  if (bgColor === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#fdebf7");
    grad.addColorStop(1, "#fff3e6");
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = bgColor;
  }
  ctx.fillRect(0, 0, width, height);

  // Judul kecil
  ctx.fillStyle = textColor;
  ctx.font = "bold 10px 'Poppins'";
  ctx.textAlign = "center";
  ctx.fillText("PoseBox", width/2, 15);

  // 3 kotak foto kecil
  const boxW = width - 16;
  const boxH = 38;
  const gap = 5;
  for (let i = 0; i < 3; i++) {
    const y = 28 + i * (boxH + gap);
    ctx.fillStyle = "#dddddd";
    ctx.fillRect(8, y, boxW, boxH);
    ctx.fillStyle = "#999";
    ctx.font = "10px 'Poppins'";
    ctx.fillText("📷", width/2, y + boxH/2 + 2);
  }

  return canvas.toDataURL();
}

// Ubah fungsi openTemplatePopup agar menampilkan thumbnail di tombol
async function openTemplatePopup() {
  const popup = document.getElementById("templatePopup");
  if (!popup) return;
  popup.style.display = "flex";
  
  const content = popup.querySelector(".popup-content");
  if (!content) return;
  
  // Cari semua tombol template (kecuali tombol "Tutup")
  const buttons = content.querySelectorAll("button:not(:last-child)");
  
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const tpl = templateList[i];
    if (tpl) {
      const thumbData = await buatThumbnail(tpl.id);
      // Simpan teks asli
      const originalText = btn.innerText;
      btn.style.display = "flex";
      btn.style.flexDirection = "column";
      btn.style.alignItems = "center";
      btn.style.gap = "5px";
      btn.style.padding = "8px";
      btn.innerHTML = `
        <img src="${thumbData}" style="width:80px; height:auto; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <span style="font-size:0.8rem;">${originalText}</span>
      `;
    }
  }
}

// Fungsi closeTemplate tetap sama
function closeTemplate() {
  document.getElementById("templatePopup").style.display = "none";
}