document.addEventListener("DOMContentLoaded", function() {
  initStorage();
  bindLogin();
  bindRegister();
  toggleForms();
  checkAuth();
});

// ===============================
// LOGIN
// ===============================

function bindLogin() {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const errorEl = document.getElementById("loginError");

      const users = loadUsers();
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        errorEl.classList.add("hidden");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        showMainContent();
      } else {
        errorEl.classList.remove("hidden");
      }
    });
  }

  // Tombol logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      showLoginForm();
    });
  }
}

// ===============================
// REGISTRASI
// ===============================

function bindRegister() {
  const form = document.getElementById("registerForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("registerUsername").value.trim();
      const password = document.getElementById("registerPassword").value.trim();
      const confirm = document.getElementById("registerConfirm").value.trim();
      const errorEl = document.getElementById("registerError");
      const errorMsg = document.getElementById("registerErrorMessage");
      const successEl = document.getElementById("registerSuccess");

      // Reset pesan
      errorEl.classList.add("hidden");
      successEl.classList.add("hidden");

      // Validasi
      if (!username || !password || !confirm) {
        errorMsg.textContent = "Semua field harus diisi!";
        errorEl.classList.remove("hidden");
        return;
      }
      if (password.length < 3) {
        errorMsg.textContent = "Password minimal 3 karakter!";
        errorEl.classList.remove("hidden");
        return;
      }
      if (password !== confirm) {
        errorMsg.textContent = "Password dan konfirmasi tidak cocok!";
        errorEl.classList.remove("hidden");
        return;
      }

      const users = loadUsers();
      if (users.some(u => u.username === username)) {
        errorMsg.textContent = "Username sudah digunakan!";
        errorEl.classList.remove("hidden");
        return;
      }

      // Simpan user baru
      users.push({ username, password });
      saveUsers(users);

      // Tampilkan sukses
      successEl.classList.remove("hidden");
      form.reset();

      // Setelah 1.5 detik, pindah ke login
      setTimeout(() => {
        document.getElementById("registerFormContainer").classList.add("hidden");
        document.getElementById("loginFormContainer").classList.remove("hidden");
        document.getElementById("toggleLoginLink").classList.remove("hidden");
        document.getElementById("toggleRegisterLink").classList.add("hidden");
        successEl.classList.add("hidden");
        // Reset form login
        document.getElementById("loginForm").reset();
      }, 1500);
    });
  }
}

// ===============================
// TOGGLE FORM LOGIN / REGISTER
// ===============================

function toggleForms() {
  const showRegisterLink = document.getElementById("showRegister");
  const showLoginLink = document.getElementById("showLogin");
  const loginContainer = document.getElementById("loginFormContainer");
  const registerContainer = document.getElementById("registerFormContainer");
  const toggleLogin = document.getElementById("toggleLoginLink");
  const toggleRegister = document.getElementById("toggleRegisterLink");

  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", function(e) {
      e.preventDefault();
      loginContainer.classList.add("hidden");
      registerContainer.classList.remove("hidden");
      toggleLogin.classList.add("hidden");
      toggleRegister.classList.remove("hidden");
      // Reset error/success
      document.getElementById("registerError").classList.add("hidden");
      document.getElementById("registerSuccess").classList.add("hidden");
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", function(e) {
      e.preventDefault();
      registerContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
      toggleLogin.classList.remove("hidden");
      toggleRegister.classList.add("hidden");
    });
  }
}

// ===============================
// AUTH CHECK
// ===============================

function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    showMainContent();
  } else {
    showLoginForm();
  }
}

function showMainContent() {
  document.getElementById("loginContainer").classList.add("hidden");
  document.getElementById("mainContent").classList.remove("hidden");
  // Navigasi ke Dashboard setelah login
  navigateTo("Dashboard");
  // Bind navigasi setelah konten muncul
  bindNavigation();
  // Set active nav (Dashboard)
  const dashboardLink = document.querySelector('.nav a[data-page="Dashboard"]');
  if (dashboardLink) setActiveNav(dashboardLink);
}

function showLoginForm() {
  document.getElementById("loginContainer").classList.remove("hidden");
  document.getElementById("mainContent").classList.add("hidden");
  // Reset form
  const form = document.getElementById("loginForm");
  if (form) form.reset();
  const errorEl = document.getElementById("loginError");
  if (errorEl) errorEl.classList.add("hidden");
}

// ===============================
// NAVIGATION (tidak berubah)
// ===============================

function bindNavigation() {
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach(link => {
    link.removeEventListener("click", handleNavClick);
    link.addEventListener("click", handleNavClick);
  });
}

function handleNavClick(e) {
  e.preventDefault();
  const link = e.currentTarget;
  const page = link.dataset.page;
  setActiveNav(link);
  navigateTo(page);
}

function setActiveNav(activeLink) {
  document.querySelectorAll(".nav a").forEach(link => {
    link.classList.remove("active");
  });
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

function navigateTo(page) {
  switch (page) {
    case "Dashboard":
      renderDashboard(true);
      break;
    case "inputTransaksi":
      renderInputTransaksi();
      break;
    case "bukuBesar":
      renderBukuBesar();
      break;
    case "neracaSaldo":
      renderNeracaSaldo();
      break;
    case "labaRugi":
      renderLabaRugi();
      break;
    case "arusKas":
      renderArusKas();
      break;
    case "perubahanModal":
      renderPerubahanModal();
      break;
    case "jurnalPenyesuaian":
      renderJurnalPenyesuaianPersediaan();
      break;
    case "Database":
      renderDatabase();
      break;
    default:
      renderDashboard(true);
  }
}