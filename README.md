# 📊 Aplikasi Laporan Keuangan UMKM — KeuanganKu

> **Sistem Informasi Akuntansi Berbasis Web untuk Usaha Mikro, Kecil, dan Menengah**  
> Dibangun menggunakan HTML5, CSS3, dan JavaScript (ES6+) tanpa framework atau database server.

---

## 📋 Daftar Isi

1. [Deskripsi Umum Aplikasi](#1-deskripsi-umum-aplikasi)
2. [Latar Belakang dan Tujuan Sistem](#2-latar-belakang-dan-tujuan-sistem)
3. [Teknologi yang Digunakan](#3-teknologi-yang-digunakan)
4. [Arsitektur Sistem](#4-arsitektur-sistem)
5. [Struktur File dan Direktori](#5-struktur-file-dan-direktori)
6. [Penjelasan Detail Setiap File](#6-penjelasan-detail-setiap-file)
   - [index.html](#61-indexhtml)
   - [style.css](#62-stylecss)
   - [utils.js](#63-utilsjs)
   - [storage.js](#64-storagejs)
   - [app.js](#65-appjs)
   - [Dashboard.js](#66-dashboardjs)
   - [inputTransaksi.js](#67-inputtransaksiis)
   - [bukuBesar.js](#68-bukubesarjs)
   - [neracaSaldo.js](#69-neracasaldojs)
   - [labaRugi.js](#610-labarugiis)
   - [arusKas.js](#611-aruskasjs)
   - [perubahanModal.js](#612-perubahanmodaljs)
   - [jurnalPenyesuaian.js](#613-jurnalpenyesuaianjs)
   - [transferKas.js](#614-transferkasjs)
   - [anggaran.js](#615-anggaranjs)
   - [Database.js](#616-databasejs)
7. [Siklus Akuntansi dalam Sistem](#7-siklus-akuntansi-dalam-sistem)
8. [Master Akun (Chart of Accounts)](#8-master-akun-chart-of-accounts)
9. [Logika Deteksi Akun Otomatis](#9-logika-deteksi-akun-otomatis)
10. [Logika Penentuan Debit dan Kredit](#10-logika-penentuan-debit-dan-kredit)
11. [Sistem Penyimpanan Data (localStorage)](#11-sistem-penyimpanan-data-localstorage)
12. [Sistem Autentikasi dan Manajemen Sesi](#12-sistem-autentikasi-dan-manajemen-sesi)
13. [Manajemen Data Per Pengguna](#13-manajemen-data-per-pengguna)
14. [Alur Sistem Lengkap](#14-alur-sistem-lengkap)
15. [Cara Instalasi dan Menjalankan Aplikasi](#15-cara-instalasi-dan-menjalankan-aplikasi)
16. [Persyaratan Sistem](#16-persyaratan-sistem)
17. [Batasan dan Keterbatasan Sistem](#17-batasan-dan-keterbatasan-sistem)
18. [Glosarium Istilah](#18-glosarium-istilah)

---

## 1. Deskripsi Umum Aplikasi

**KeuanganKu** adalah aplikasi sistem informasi akuntansi berbasis web yang dirancang khusus untuk pelaku Usaha Mikro, Kecil, dan Menengah (UMKM). Aplikasi ini memungkinkan pengguna mencatat transaksi keuangan sehari-hari secara otomatis dan menghasilkan laporan keuangan standar tanpa memerlukan pengetahuan akuntansi yang mendalam.

Sistem ini mengimplementasikan **siklus akuntansi penuh** mulai dari:
1. Pencatatan transaksi ke dalam Jurnal Umum
2. Pengelompokan ke dalam Buku Besar
3. Penyusunan Neraca Saldo
4. Penyesuaian Jurnal (Jurnal Penyesuaian)
5. Penyusunan Laporan Keuangan akhir:
   - Laporan Laba Rugi
   - Laporan Arus Kas
   - Laporan Perubahan Modal

Seluruh proses pencatatan debit-kredit dilakukan secara **otomatis** berdasarkan keterangan transaksi yang dimasukkan pengguna menggunakan pendekatan **Rule-Based NLP (Natural Language Processing) sederhana**.

---

## 2. Latar Belakang dan Tujuan Sistem

### Latar Belakang
Sebagian besar pelaku UMKM di Indonesia tidak memiliki latar belakang akuntansi yang memadai untuk mengelola pembukuan keuangan bisnis mereka secara benar. Aplikasi akuntansi yang ada di pasaran umumnya terlalu kompleks, berbayar, atau memerlukan koneksi internet dan server khusus.

### Tujuan Sistem
1. **Menyederhanakan pencatatan keuangan** bagi pelaku UMKM yang tidak memiliki latar belakang akuntansi.
2. **Mengotomatisasi** proses penentuan akun debit dan kredit berdasarkan keterangan transaksi.
3. **Menghasilkan laporan keuangan standar** yang dapat digunakan sebagai dasar pengambilan keputusan bisnis.
4. **Tidak memerlukan server atau instalasi** — cukup dibuka melalui browser.
5. **Mendukung banyak pengguna** dalam satu browser dengan data yang terpisah per akun.

---

## 3. Teknologi yang Digunakan

| Teknologi | Versi | Fungsi dalam Sistem |
|-----------|-------|---------------------|
| **HTML5** | — | Struktur antarmuka dan markup semantik halaman |
| **CSS3** | — | Tampilan visual, layout responsif, animasi antarmuka |
| **JavaScript (Vanilla)** | ES6+ | Seluruh logika bisnis, routing, dan rendering UI dinamis |
| **jsPDF** | 2.5.1 | Pembuat file PDF laporan mutasi rekening |
| **jsPDF AutoTable** | 3.5.31 | Pembuatan tabel otomatis dalam dokumen PDF |
| **Chart.js** | 4.4.0 | Grafik tren keuangan bulanan di halaman Dashboard |
| **Font Awesome** | 5.15.4 | Ikon antarmuka (menu, tombol, indikator) |
| **Google Fonts (Quicksand)** | — | Tipografi antarmuka yang bersih dan mudah dibaca |
| **Web API: localStorage** | — | Penyimpanan data keuangan dan autentikasi secara lokal di browser |

> **Catatan Penting:** Sistem ini adalah **static web application** — tidak menggunakan framework JavaScript (React, Vue, Angular), tidak menggunakan database server (MySQL, MongoDB, PostgreSQL), dan tidak memerlukan backend (Node.js, PHP, Python). Seluruh data tersimpan di `localStorage` browser pengguna.

---

## 4. Arsitektur Sistem

Aplikasi ini menggunakan pola arsitektur **Single Page Application (SPA)** sederhana yang diimplementasikan secara manual tanpa framework:

```
┌──────────────────────────────────────────────────┐
│                  BROWSER (CLIENT)                 │
│                                                   │
│  ┌─────────────┐     ┌──────────────────────────┐│
│  │  index.html │────▶│  app.js (Router & Auth)  ││
│  │  (Shell UI) │     └──────────┬───────────────┘│
│  └─────────────┘                │                 │
│                                 │ navigateTo(page) │
│  ┌──────────────────────────────▼───────────────┐ │
│  │              MODUL HALAMAN                    │ │
│  │  Dashboard  │ inputTransaksi │  bukuBesar     │ │
│  │  neracaSaldo│ labaRugi       │  arusKas       │ │
│  │  perubahanModal │ jurnalPenyesuaian           │ │
│  │  transferKas│ anggaran       │  Database      │ │
│  └──────────────────────────────┬───────────────┘ │
│                                 │                  │
│  ┌──────────────────────────────▼───────────────┐ │
│  │           LAPISAN UTILITAS & DATA             │ │
│  │    utils.js    │    storage.js                │ │
│  └──────────────────────────────┬───────────────┘ │
│                                 │                  │
│  ┌──────────────────────────────▼───────────────┐ │
│  │              localStorage (Browser)           │ │
│  │  users │ isLoggedIn │ username                │ │
│  │  {user}_input_transaksi │ {user}_penyesuaian  │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Pola Rendering:** Setiap modul halaman bertanggung jawab merender isi `<div id="app">` secara keseluruhan saat dipanggil oleh router (`navigateTo()`). Halaman tidak pernah di-refresh — hanya konten dalam `#app` yang diganti.

---

## 5. Struktur File dan Direktori

```
/
├── index.html                    # Entry point — struktur HTML utama (shell)
│
├── assets/
│   ├── css/
│   │   └── style.css             # Seluruh styling: layout, warna, responsif
│   └── js/
│       ├── utils.js              # Fungsi utilitas umum (format uang, tanggal, validasi)
│       ├── storage.js            # Abstraksi localStorage dengan prefix per pengguna
│       ├── app.js                # Autentikasi (login/register/logout), routing navigasi
│       └── modules/
│           ├── Dashboard.js          # Halaman utama: ringkasan keuangan + grafik
│           ├── inputTransaksi.js     # Input transaksi, Jurnal Umum, deteksi akun otomatis
│           ├── bukuBesar.js          # Laporan Buku Besar per akun dengan saldo berjalan
│           ├── neracaSaldo.js        # Neraca Saldo: verifikasi keseimbangan debit-kredit
│           ├── labaRugi.js           # Laporan Laba Rugi
│           ├── arusKas.js            # Laporan Arus Kas
│           ├── perubahanModal.js     # Laporan Perubahan Modal
│           ├── jurnalPenyesuaian.js  # Jurnal Penyesuaian HPP & Persediaan
│           ├── transferKas.js        # Transfer antar rekening Kas Tunai ↔ Kas Bank
│           ├── anggaran.js           # Anggaran bulanan per kategori beban
│           └── Database.js           # Histori seluruh transaksi + export PDF mutasi
```

---

## 6. Penjelasan Detail Setiap File

---

### 6.1 `index.html`

**Peran:** Entry point aplikasi. File ini adalah satu-satunya file HTML dan berfungsi sebagai "shell" atau kerangka halaman yang tidak pernah di-reload ulang selama pengguna menggunakan aplikasi.

**Komponen Utama:**

#### a. `<head>` — Deklarasi Resource Eksternal
```html
<!-- Tipografi -->
<link href="https://fonts.googleapis.com/css2?family=Quicksand..." />

<!-- Ikon -->
<link href="https://cdnjs.cloudflare.com/.../font-awesome/.../all.min.css" />

<!-- Library PDF -->
<script src="https://cdnjs.cloudflare.com/.../jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/.../jspdf-autotable/3.5.31/..."></script>

<!-- Library Grafik -->
<script src="https://cdnjs.cloudflare.com/.../Chart.js/4.4.0/chart.umd.min.js"></script>
```
Semua library dimuat dari CDN (Content Delivery Network). Ini berarti koneksi internet dibutuhkan hanya pada pemuatan pertama.

#### b. `#loginContainer` — Tampilan Sebelum Login
Berisi tiga form yang dapat ditampilkan secara bergantian:
- **`#loginFormContainer`** — form login (username + password)
- **`#registerFormContainer`** — form registrasi akun baru
- Form reset password (lupa password)

Perpindahan antar form dilakukan dengan menambahkan/menghapus class CSS `hidden` tanpa navigasi halaman.

#### c. `#mainContent` — Tampilan Setelah Login
Berisi:
- **`.header`** — nama aplikasi "KeuanganKu" dan tombol menu pengguna (ikon titik tiga / `⋮`)
- **`.nav`** — navigasi utama berisi link ke seluruh modul (Dashboard, Input Transaksi, Buku Besar, dst.)
- **`#app`** — area konten dinamis. Ini adalah satu-satunya elemen yang isinya berganti saat pengguna berpindah halaman.

#### d. `<script>` — Urutan Pemuatan File JavaScript
```html
<script src="assets/js/utils.js"></script>
<script src="assets/js/storage.js"></script>
<script src="assets/js/modules/inputTransaksi.js"></script>
...
<script src="assets/js/app.js"></script>   <!-- Harus dimuat PALING AKHIR -->
```
`app.js` dimuat paling akhir karena ia memanggil fungsi-fungsi yang didefinisikan di file lain (`renderDashboard`, `renderInputTransaksi`, dll). Jika dimuat lebih awal, fungsi-fungsi tersebut belum tersedia.

---

### 6.2 `style.css`

**Peran:** Mengatur seluruh tampilan visual aplikasi, termasuk layout, warna, responsivitas untuk perangkat mobile, dan komponen UI yang digunakan di semua halaman.

**Bagian-Bagian Utama:**

| Bagian | Keterangan |
|--------|-----------|
| **Reset & Base** | Mengatur margin/padding default browser, font keluarga Quicksand |
| **`.hidden`** | Class utilitas untuk menyembunyikan elemen (`display: none`) |
| **`.card`** | Komponen kartu putih bershadow yang digunakan di hampir semua halaman |
| **`.form`, `.form-group`** | Styling form input (label, input text, select, button) |
| **`.table`** | Styling tabel data keuangan (header, baris, zebra striping) |
| **`.nav`** | Navigasi horizontal yang bisa di-scroll secara horizontal di layar kecil |
| **`.dashboard-grid`** | Layout kartu ringkasan di Dashboard menggunakan CSS Grid |
| **`.text-right`** | Perataan teks kanan untuk nilai rupiah di kolom tabel |
| **`.amount`** | Styling angka nominal besar di kartu ringkasan |
| **`.progress-bar-track`, `.progress-bar-fill`** | Komponen progress bar untuk halaman Anggaran |
| **`.btn-download`, `.btn-delete-all`** | Tombol aksi khusus di halaman Database |
| **`.delete-cell`** | Sel ikon hapus (🗑️) di tabel transaksi |
| **Responsif (`@media`)** | Menyesuaikan layout untuk layar ponsel (lebar < 600px) |

**Palet Warna Utama:**

| Variabel Warna | Nilai | Digunakan Untuk |
|----------------|-------|-----------------|
| Hijau Tua | `#1a5c2e` | Warna primer — header, tombol utama, aksen |
| Merah | `#c0392b` | Indikator rugi, tombol hapus, nilai minus |
| Hijau Muda | Turunan | Indikator laba, nilai positif |
| Abu-abu | `#666` | Teks sekunder, label kecil |
| Putih | `#ffffff` | Latar kartu, form |

---

### 6.3 `utils.js`

**Peran:** Menyediakan fungsi-fungsi utilitas umum yang digunakan bersama oleh semua modul lain. File ini harus dimuat pertama karena modul lain bergantung padanya.

**Fungsi-Fungsi yang Tersedia:**

#### `formatRupiah(angka)`
Mengubah angka numerik menjadi format mata uang Rupiah Indonesia.

```javascript
formatRupiah(1500000)
// → "Rp 1.500.000"
```

Menggunakan `Intl.NumberFormat` dengan locale `id-ID` dan currency `IDR`. Tidak menampilkan desimal (minimumFractionDigits: 0).

#### `formatTanggal(tanggal)`
Mengubah format tanggal dari `YYYY-MM-DD` (format input HTML) menjadi `DD/MM/YYYY` (format tampilan Indonesia).

```javascript
formatTanggal("2026-06-15")
// → "15/06/2026"
```

**Catatan teknis penting:** Fungsi ini melakukan parse manual string tanggal (bukan `new Date()`) untuk menghindari masalah timezone. Jika menggunakan `new Date("2026-06-15")`, JavaScript menginterpretasikannya sebagai tengah malam UTC, sehingga di zona waktu Asia/Jakarta (UTC+7) tanggal yang ditampilkan bisa maju 1 hari.

#### `generateId(prefix)`
Membuat ID unik dengan gabungan prefix dan timestamp Unix (milisecond).

```javascript
generateId("TRX")
// → "TRX-1718000000000"
```

#### `isNotEmpty(value)`
Validasi bahwa sebuah nilai tidak kosong, null, atau undefined. Mengembalikan `true` jika nilai valid.

#### `isNumber(value)`
Validasi bahwa sebuah nilai adalah angka yang valid. Mengembalikan `true` jika nilai adalah bilangan.

---

### 6.4 `storage.js`

**Peran:** Lapisan abstraksi untuk semua operasi baca-tulis data ke `localStorage`. Memastikan data setiap pengguna tersimpan secara terpisah menggunakan sistem prefix berbasis username.

**Konsep Utama — Prefix Key:**

Setiap data pengguna disimpan dengan format key:
```
{username}_{namaData}
```

Contoh:
```
Zaqi26_input_transaksi
Zaqi26_penyesuaian_hpp
Budi_input_transaksi
Budi_anggaran_bulanan
```

Dengan sistem ini, dua pengguna yang login bergantian di browser yang sama tidak akan saling menimpa data.

**Fungsi-Fungsi yang Tersedia:**

#### `getPrefixedKey(key)`
Fungsi internal. Membaca username aktif dari `localStorage.getItem('username')`, lalu mengembalikan key yang sudah diberi prefix.

```javascript
// Jika username = "Zaqi26"
getPrefixedKey("input_transaksi")
// → "Zaqi26_input_transaksi"
```

#### `saveData(key, data)`
Menyimpan data (dalam bentuk apapun) ke localStorage dengan prefix username. Data dikonversi ke string JSON menggunakan `JSON.stringify`.

#### `loadData(key)`
Membaca data dari localStorage dengan prefix username. Data dikonversi kembali dari JSON menggunakan `JSON.parse`. Mengembalikan `null` jika data tidak ditemukan.

#### `removeData(key)`
Menghapus satu data dari localStorage berdasarkan key (dengan prefix).

#### `loadUsers()` dan `saveUsers(users)`
Khusus untuk data daftar akun pengguna (username & password). Data ini disimpan secara **global** di key `users` tanpa prefix, karena harus dapat diakses sebelum pengguna login.

#### `hasPin()`, `setPin(pin)`, `verifyPin(inputPin)`
Sistem PIN per pengguna untuk mengamankan aksi sensitif (hapus transaksi, hapus semua data). PIN disimpan terpisah dari password login menggunakan prefix username, sehingga setiap pengguna memiliki PIN sendiri.

#### `initStorage()`
Dipanggil sekali saat aplikasi pertama kali dimuat. Memastikan key `users` sudah ada di localStorage (diinisialisasi sebagai array kosong `[]` jika belum ada).

---

### 6.5 `app.js`

**Peran:** File JavaScript utama yang mengelola autentikasi pengguna (login, registrasi, logout) dan sistem navigasi antar halaman. File ini dipanggil terakhir saat halaman dimuat.

**Inisialisasi (`DOMContentLoaded`):**

Saat halaman selesai dimuat, sistem menjalankan:
```javascript
initStorage()    // Pastikan localStorage siap
bindLogin()      // Pasang event listener form login & tombol logout
bindRegister()   // Pasang event listener form registrasi
toggleForms()    // Pasang event listener toggle antar form (login ↔ registrasi)
checkAuth()      // Cek apakah pengguna sudah login; tampilkan halaman sesuai
```

Jika salah satu langkah gagal (misalnya ada file JS yang tidak termuat), sistem menampilkan pesan error langsung di halaman daripada diam-diam blank — sangat membantu debugging di perangkat mobile yang tidak memiliki DevTools.

**Fungsi Autentikasi:**

#### `bindLogin()`
Menangani submit form login:
1. Ambil nilai username dan password dari form.
2. Panggil `loadUsers()` untuk mendapatkan daftar akun terdaftar.
3. Cari akun yang cocok dengan `Array.find()`.
4. Jika cocok: simpan `isLoggedIn = "true"` dan `username` ke localStorage, lalu panggil `showMainContent()`.
5. Jika tidak cocok: tampilkan elemen error `#loginError`.

Juga memasang event listener pada tombol logout untuk menghapus sesi dan kembali ke form login.

#### `bindRegister()`
Menangani submit form registrasi dengan validasi bertahap:
- Semua field wajib diisi → tampilkan error jika kosong
- Password minimal 3 karakter → tampilkan error jika kurang
- Password dan konfirmasi harus sama → tampilkan error jika beda
- Username tidak boleh sudah terdaftar → cek ke array `users`

Jika semua validasi lolos: tambahkan akun baru ke array `users`, simpan kembali, tampilkan pesan sukses, lalu otomatis pindah ke form login setelah 1,5 detik.

#### `toggleForms()`
Menangani klik link "Belum punya akun?" dan "Sudah punya akun?" dengan menampilkan/menyembunyikan container form yang sesuai.

#### `checkAuth()`
Dipanggil saat halaman dibuka. Memeriksa apakah `localStorage.getItem("isLoggedIn") === "true"`:
- **Ya** → panggil `showMainContent()` (masuk langsung ke Dashboard)
- **Tidak** → panggil `showLoginForm()` (tampilkan halaman login)

Ini memastikan sesi pengguna bertahan walau halaman di-refresh.

**Sistem Navigasi (`navigateTo`):**

```javascript
function navigateTo(page) {
  switch (page) {
    case "Dashboard":          renderDashboard(true);   break;
    case "inputTransaksi":     renderInputTransaksi();  break;
    case "bukuBesar":          renderBukuBesar();       break;
    case "neracaSaldo":        renderNeracaSaldo();     break;
    case "labaRugi":           renderLabaRugi();        break;
    case "arusKas":            renderArusKas();         break;
    case "perubahanModal":     renderPerubahanModal();  break;
    case "jurnalPenyesuaian":  renderJurnalPenyesuaianPersediaan(); break;
    case "transferKas":        renderTransferKas();     break;
    case "anggaran":           renderAnggaran();        break;
    case "Database":           renderDatabase();        break;
  }
}
```

Setiap pemanggilan `navigateTo` merender ulang seluruh isi `<div id="app">` dengan konten halaman yang dipilih. Fungsi ini juga dilengkapi `try-catch` sehingga jika modul tertentu error, pesan kesalahan ditampilkan di layar (bukan hanya di console).

---

### 6.6 `Dashboard.js`

**Peran:** Merender halaman utama yang pertama tampil setelah login. Menampilkan ringkasan kondisi keuangan terkini secara real-time beserta grafik tren keuangan bulanan.

**Data yang Ditampilkan:**

#### Kartu Ringkasan Atas (Baris 1)

| Kartu | Cara Hitung |
|-------|------------|
| **Total Saldo** | Saldo Kas Tunai + Saldo Kas Bank |
| **Laba Bersih** | Total Pendapatan − Total Beban |
| **Jumlah Transaksi** | `data.length` (panjang array transaksi) |

#### Kartu Rekening (Baris 2)

| Kartu | Cara Hitung |
|-------|------------|
| **Kas Tunai** | Σ Debit Kas − Σ Kredit Kas (dari semua transaksi) |
| **Kas Bank** | Σ Debit Kas Bank − Σ Kredit Kas Bank |
| **Transfer Antar Rekening** | Tombol pintasan menuju halaman Transfer |

Sapaan personal di atas kartu menampilkan nama pengguna yang diambil dari `localStorage.getItem("username")`.

**Cara Hitung Saldo:**

```javascript
data.forEach(t => {
  const { debit, kredit } = tentukanDebitKred