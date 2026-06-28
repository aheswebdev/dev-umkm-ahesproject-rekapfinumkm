// ===============================
// STORAGE - DENGAN PREFIX USERNAME
// ===============================

function loadusers() {
  return localStorage.getItem('username') || null;
}

function getPrefixedKey(key) {
  const username = loadusers();
  return username ? `${username}_${key}` : key;
}

// ===== FUNGSI UMUM =====
function saveData(key, data) {
  const finalKey = getPrefixedKey(key);
  localStorage.setItem(finalKey, JSON.stringify(data));
}

function loadData(key) {
  const finalKey = getPrefixedKey(key);
  const data = localStorage.getItem(finalKey);
  return data ? JSON.parse(data) : null;
}

function removeData(key) {
  const finalKey = getPrefixedKey(key);
  localStorage.removeItem(finalKey);
}

// ===== FUNGSI UNTUK DATA PENGGUNA (GLOBAL) =====
function loadUsers() {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Inisialisasi storage (panggil sekali di awal)
function initStorage() {
  if (!localStorage.getItem('users')) {
    saveUsers([]);
  }
}