// ==========================================
// KONFIGURASI API LARAVEL
// ==========================================
const API_URL = 'http://10.35.69.190:8000/api'; // Ganti dengan IP Termux kamu

// ==========================================
// REGISTER FUNCTION
// ==========================================
async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.status) {
            alert('Registrasi berhasil! Silakan login.');
            // Redirect ke halaman login
            window.location.href = 'login.html';
            return true;
        } else {
            let errorMsg = data.message || 'Registrasi gagal!';
            if (data.errors) {
                errorMsg += '\n' + JSON.stringify(data.errors);
            }
            alert(errorMsg);
            return false;
        }
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

// ==========================================
// SUBMIT REGISTER FORM
// ==========================================
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirmation = document.getElementById("password_confirmation").value;

    // Validasi sederhana
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

    registerUser(name, email, password);
});

// ==========================================
// REDIRECT KE LOGIN
// ==========================================
document.querySelector('.login__register a').addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = 'login.html';
});