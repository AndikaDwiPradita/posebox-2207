// ==========================================
// DOM ELEMENTS
// ==========================================
let usernameRef = document.getElementById("username");
let passwordRef = document.getElementById("password");
let eyeL = document.querySelector(".eyeball-l");
let eyeR = document.querySelector(".eyeball-r");
let handL = document.querySelector(".hand-l");
let handR = document.querySelector(".hand-r");

// ==========================================
// ANIMASI PANDA
// ==========================================
let normalEyeStyle = () => {
  eyeL.style.cssText = `left:0.6em; top: 0.6em;`;
  eyeR.style.cssText = `right:0.6em; top:0.6em;`;
};

let normalHandStyle = () => {
  handL.style.cssText = `height: 2.81em; top:8.4em; left:7.5em; transform: rotate(0deg);`;
  handR.style.cssText = `height: 2.81em; top: 8.4em; right: 7.5em; transform: rotate(0deg)`;
};

usernameRef.addEventListener("focus", () => {
  eyeL.style.cssText = `left: 0.75em; top: 1.12em;`;
  eyeR.style.cssText = `right: 0.75em; top: 1.12em;`;
  normalHandStyle();
});

passwordRef.addEventListener("focus", () => {
  handL.style.cssText = `height: 6.56em; top: 3.87em; left: 11.75em; transform: rotate(-155deg);`;
  handR.style.cssText = `height: 6.56em; top: 3.87em; right: 11.75em; transform: rotate(155deg);`;
  normalEyeStyle();
});

document.addEventListener("click", (e) => {
  let clickedElem = e.target;
  if (clickedElem != usernameRef && clickedElem != passwordRef) {
    normalEyeStyle();
    normalHandStyle();
  }
});

// ==========================================
// SUBMIT LOGIN FORM
// ==========================================
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Username dan password harus diisi!");
    return;
  }

  // ========== KAMU TARUH LOGIKA LOGIN SENDIRI DI SINI ==========
  // Contoh: window.location.href = 'index.html';
  alert("Login berhasil! (masih simulasi)");
  window.location.href = "index.html";
});

// ==========================================
// REGISTER LINK
// ==========================================
document.getElementById("registerLink").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "register.html";
});

// ==========================================
// FORGOT PASSWORD
// ==========================================
document.getElementById("forgotPassword").addEventListener("click", function(e) {
  e.preventDefault();
  alert("Fitur reset password akan segera hadir!");
});