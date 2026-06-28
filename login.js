// ==========================================
// KONFIGURASI API LARAVEL
// ==========================================
const API_URL = 'http://10.35.69.190:8000/api'; // Ganti dengan IP Termux kamu

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
// ANIMASI PANDA (tetap sama)
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
// LOGIN FUNCTION (PAKAI API LARAVEL)
// ==========================================
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.status) {
            // Simpan token & user ke localStorage
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            localStorage.setItem('role', data.data.role);
            
            alert('Login berhasil!');
            
            // Redirect ke halaman utama PoseBox
            window.location.href = 'index.html';
            return true;
        } else {
            alert(data.message || 'Login gagal!');
            return false;
        }
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

// ==========================================
// SUBMIT LOGIN FORM
// ==========================================
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Email dan password harus diisi!");
        return;
    }

    loginUser(email, password);
});

// ==========================================
// REGISTER LINK (redirect ke halaman register)
// ==========================================
document.getElementById("registerLink").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = 'register.html';
});

// ==========================================
// FORGOT PASSWORD (opsional)
// ==========================================
document.getElementById("forgotPassword").addEventListener("click", function(e) {
    e.preventDefault();
    alert("Fitur reset password akan segera hadir!");
});