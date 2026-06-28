// ==========================================
// SUBMIT REGISTER FORM
// ==========================================
document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById("password_confirmation").value;

  if (!name || !email || !password) {
    alert("Semua field harus diisi!");
    return;
  }

  if (password !== passwordConfirmation) {
    alert("Password dan konfirmasi password tidak sama!");
    return;
  }

  if (password.length < 8) {
    alert("Password minimal 8 karakter!");
    return;
  }

  // ========== KAMU TARUH LOGIKA REGISTER SENDIRI DI SINI ==========
  // Contoh: alert("Registrasi berhasil! Silakan login.");
  alert("Registrasi berhasil! (masih simulasi)");
  window.location.href = "login.html";
});

// ==========================================
// REDIRECT KE LOGIN
// ==========================================
document.querySelector('.login__register a').addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "login.html";
});