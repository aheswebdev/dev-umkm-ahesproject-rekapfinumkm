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
  const { debit, kredit } = tentukanDebitKredit(t);

  if (debit.nama === "Kas") saldoKasTunai += t.jumlah;
  if (kredit.nama === "Kas") saldoKasTunai -= t.jumlah;
  if (debit.nama === "Kas Bank") saldoKasBank += t.jumlah;
  if (kredit.nama === "Kas Bank") saldoKasBank -= t.jumlah;

  if (kredit.kategori === "pendapatan") pendapatan += t.jumlah;
  if (debit.kategori === "beban") beban += t.jumlah;
});
```

**Grafik Tren Keuangan (`renderChartTrenKeuangan`):**

Menggunakan library **Chart.js** untuk menampilkan grafik garis (line chart) yang membandingkan Pendapatan vs Beban per bulan.

Cara kerja:
1. Kelompokkan semua transaksi berdasarkan bulan (`YYYY-MM`).
2. Hitung total pendapatan dan beban per bulan.
3. Render grafik garis dengan dua dataset (Pendapatan = hijau, Beban = merah).
4. Label sumbu-Y menggunakan `formatRupiah()`.

Jika terjadi error saat render grafik (misalnya Chart.js belum termuat), Dashboard tetap ditampilkan karena grafik dirender di dalam blok `try-catch` tersendiri.

---

### 6.7 `inputTransaksi.js`

**Peran:** Modul inti sistem. Menyediakan form input transaksi, mendeteksi akun secara otomatis, menyimpan transaksi ke localStorage, dan menampilkan Jurnal Umum.

File ini juga mendefinisikan seluruh **Master Akun** dan **Logika Deteksi Akun** yang digunakan oleh hampir semua modul lain.

#### a. Form Input Transaksi

Pengguna mengisi empat field:

| Field | Tipe | Keterangan |
|-------|------|-----------|
| **Tanggal** | `<input type="date">` | Tanggal transaksi |
| **Metode** | `<select>` | Tunai / Non-Tunai (untuk referensi pengguna, tidak mempengaruhi akun) |
| **Keterangan** | `<input type="text">` | Deskripsi transaksi — INI yang dibaca sistem untuk mendeteksi akun |
| **Jumlah** | `<input type="number">` | Nominal transaksi dalam Rupiah |

#### b. Master Akun (`AKUN_RULES`)

Array of objects yang mendefinisikan seluruh akun yang dikenal sistem:

```javascript
const AKUN_RULES = [
  { kode: "101", nama: "Kas",        kategori: "aset",       saldoNormal: "debit",  idnama: "kas" },
  { kode: "102", nama: "Kas Bank",   kategori: "aset",       saldoNormal: "debit",  idnama: "kas bank" },
  { kode: "103", nama: "Piutang",    kategori: "aset",       saldoNormal: "debit",  idnama: "piutang" },
  { kode: "104", nama: "Persediaan", kategori: "aset",       saldoNormal: "debit",  idnama: "persediaan" },
  { kode: "105", nama: "Peralatan",  kategori: "aset",       saldoNormal: "debit",  idnama: "peralatan" },
  { kode: "201", nama: "Utang Usaha",kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang usaha" },
  { kode: "202", nama: "Utang Bank", kategori: "liabilitas", saldoNormal: "kredit", idnama: "utang bank" },
  { kode: "301", nama: "Modal",      kategori: "ekuitas",    saldoNormal: "kredit", idnama: "modal" },
  { kode: "302", nama: "Prive",      kategori: "ekuitas",    saldoNormal: "kredit", idnama: "prive" },
  { kode: "302", nama: "Prive",      kategori: "ekuitas",    saldoNormal: "kredit", idnama: "ambil kas" },
  { kode: "302", nama: "Prive",      kategori: "ekuitas",    saldoNormal: "kredit", idnama: "pribadi" },
  { kode: "303", nama: "Laba Ditahan",kategori:"ekuitas",    saldoNormal: "kredit", idnama: "laba ditahan" },
  { kode: "401", nama: "Pendapatan", kategori: "pendapatan", saldoNormal: "kredit", idnama: "penjualan" },
  { kode: "402", nama: "Pendapatan Lainnya", kategori: "pendapatan", saldoNormal: "kredit", idnama: "penjualan lainnya" },
  { kode: "501", nama: "Beban Gaji",    kategori: "beban",   saldoNormal: "debit",  idnama: "bayar gaji" },
  { kode: "502", nama: "Beban Listrik", kategori: "beban",   saldoNormal: "debit",  idnama: "bayar listrik" },
  { kode: "503", nama: "Beban Air",     kategori: "beban",   saldoNormal: "debit",  idnama: "bayar air" },
  { kode: "504", nama: "Beban Internet",kategori: "beban",   saldoNormal: "debit",  idnama: "bayar internet" },
  { kode: "505", nama: "Beban Sewa",    kategori: "beban",   saldoNormal: "debit",  idnama: "bayar sewa" },
];
```

Field `idnama` adalah kata kunci yang dicocokkan dengan keterangan transaksi.

#### c. Kata Kunci HPP (`KATA_KUNCI_HPP`)

Daftar kata kunci khusus untuk mendeteksi transaksi penyesuaian Harga Pokok Penjualan:

```javascript
const KATA_KUNCI_HPP = [
  "hpp", "harga pokok penjualan", "pemakaian",
  "pakai persediaan", "penyusutan", "depresiasi", "susut"
];
```

Daftar ini sengaja diselaraskan dengan `KATA_KUNCI_HPP_OTOMATIS` di `jurnalPenyesuaian.js` supaya transaksi yang mengandung kata-kata ini otomatis muncul di tabel Penyesuaian HPP Bulanan.

#### d. Prioritas Deteksi Kategori (`PRIORITAS_KATEGORI`)

Saat keterangan mengandung lebih dari satu akun yang cocok, sistem memprioritaskan berdasarkan urutan ini:

```javascript
const PRIORITAS_KATEGORI = [
  "pendapatan",   // prioritas tertinggi
  "beban",
  "liabilitas",
  "ekuitas",
  "aset"          // prioritas terendah
];
```

#### e. Validasi Transaksi (`handleInputTransaksiSubmit`)

Sebelum transaksi disimpan, sistem melakukan pengecekan:

1. **Konfirmasi dialog** — pengguna diminta mengkonfirmasi detail transaksi sebelum disimpan.
2. **Kas tidak boleh berdiri sendiri** — jika hanya akun Kas yang terdeteksi tanpa akun lawan yang jelas, transaksi ditolak dengan pesan panduan.
3. **Keterangan harus dikenali** — jika tidak ada satu pun kata kunci yang cocok di `AKUN_RULES` maupun daftar khusus, transaksi ditolak.
4. **Akun utama harus terdeteksi** — jika `detectAkunUtama()` mengembalikan `null`, transaksi tidak disimpan.

#### f. Render Jurnal Umum (`renderInputTransaksiList`)

Menampilkan seluruh transaksi tersimpan dalam format jurnal akuntansi berpasangan (double-entry):

- Setiap transaksi ditampilkan dalam **2 baris tabel** (baris debit + baris kredit).
- Data diurutkan berdasarkan timestamp ID (terbaru di atas).
- Dapat difilter berdasarkan kategori akun: Semua, Aset, Liabilitas, Ekuitas, Pendapatan, Beban.

#### g. Struktur Data Transaksi

Setiap transaksi yang disimpan memiliki struktur:
```javascript
{
  id: "JU-1718000000000",      // ID unik (prefix JU + timestamp)
  tanggal: "2026-06-15",       // Format YYYY-MM-DD
  keterangan: "Penjualan tunai",
  akunUtama: { kode, nama, kategori, saldoNormal, idnama },
  akunLawan:  { kode, nama, kategori, saldoNormal, idnama },
  jumlah: 1500000,
  pengurangan: false,          // true jika transaksi mengurangi akun (bayar utang, dll)
  isTransfer: false            // true jika transaksi dari modul Transfer Kas
}
```

---

### 6.8 `bukuBesar.js`

**Peran:** Merender Laporan Buku Besar — pengelompokan semua transaksi per akun dengan saldo berjalan (running balance).

**Fungsi Utama:**

#### `buildBukuBesar(jurnal)`
Memproses array transaksi dan mengorganisasinya ke dalam struktur objek per akun:

```javascript
{
  "Kas": {
    saldoNormal: "debit",
    rows: [
      { tanggal, keterangan, debit: 1000000, kredit: 0 },
      { tanggal, keterangan, debit: 0, kredit: 500000 },
      ...
    ],
    saldo: 0
  },
  "Pendapatan": { ... },
  ...
}
```

Setiap transaksi menghasilkan satu entri di akun debit dan satu entri di akun kredit.

#### `renderAkunLedger(namaAkun, akunData)`
Merender satu tabel buku besar untuk satu akun. Menghitung saldo berjalan sesuai saldo normal akun:

- Saldo normal **Debit**: `saldo += debit − kredit`
- Saldo normal **Kredit**: `saldo += kredit − debit`

Tabel ditampilkan dengan kolom: Tanggal | Keterangan | Debit | Kredit | Saldo

**Urutan Tampilan:** Transaksi diurutkan berdasarkan tanggal ascending (`a.tanggal - b.tanggal`) sebelum diproses, sehingga saldo berjalan menunjukkan kronologi yang benar.

---

### 6.9 `neracaSaldo.js`

**Peran:** Merender Neraca Saldo — daftar saldo akhir semua akun yang memverifikasi bahwa total kolom Debit sama dengan total kolom Kredit (prinsip keseimbangan akuntansi).

**Fungsi `hitungNeracaSaldo()`:**

1. Membaca semua transaksi dari `getInputTransaksi()`.
2. Untuk setiap transaksi, tambahkan `jumlah` ke akun debit dan ke akun kredit di objek `neraca`.
3. Hasilnya adalah objek dengan kode akun sebagai key, masing-masing berisi total debit dan kredit kumulatif.

**Fungsi `renderNeracaSaldo()`:**

Untuk setiap akun dalam `hitungNeracaSaldo()`:
- Jika `saldoNormal === "debit"` → saldo bersih = `debit − kredit`, ditampilkan di kolom Debit.
- Jika `saldoNormal === "kredit"` → saldo bersih = `kredit − debit`, ditampilkan di kolom Kredit.

Footer tabel menampilkan total keseluruhan kolom Debit dan kolom Kredit. Jika total keduanya sama, neraca saldo **seimbang** (balanced).

---

### 6.10 `labaRugi.js`

**Peran:** Merender Laporan Laba Rugi — perhitungan selisih pendapatan dan beban dalam suatu periode.

**Cara Perhitungan:**

```javascript
data.forEach(transaksi => {
  const { debit, kredit } = tentukanDebitKredit(transaksi);

  // Pendapatan → saldo normal kredit
  if (kredit.kategori === "pendapatan") totalPendapatan += transaksi.jumlah;

  // Beban → saldo normal debit
  if (debit.kategori === "beban") totalBeban += transaksi.jumlah;
});
```

**Penyesuaian HPP:**

Data dari Jurnal Penyesuaian (HPP) dibaca menggunakan `loadData("total_penyesuaian")` dengan prefix username. Nilai ini ditambahkan ke `totalPendapatan` untuk mencerminkan penyesuaian persediaan/peralatan.

**Rumus:**
```
Laba Bersih = Total Pendapatan (+ Penyesuaian HPP) − Total Beban
```

**Tampilan Laporan:**

| Baris | Nilai |
|-------|-------|
| Penyesuaian (HPP) | Rp xxx |
| Total Pendapatan | Rp xxx |
| Total Beban | Rp xxx |
| **Laba Bersih** | **Rp xxx** |

---

### 6.11 `arusKas.js`

**Peran:** Merender Laporan Arus Kas — ringkasan pergerakan kas masuk dan kas keluar dalam suatu periode.

**Cara Perhitungan:**

```javascript
data.forEach(transaksi => {
  const { debit, kredit } = tentukanDebitKredit(transaksi);

  // KAS MASUK → Kas di posisi Debit (kas bertambah)
  if (debit.nama === "Kas") kasMasuk += transaksi.jumlah;

  // KAS KELUAR → Kas di posisi Kredit (kas berkurang)
  if (kredit.nama === "Kas") kasKeluar += transaksi.jumlah;
});
```

**Rumus:**
```
Saldo Kas Bersih = Kas Masuk − Kas Keluar
```

**Tampilan Laporan:**

| Baris | Nilai |
|-------|-------|
| Kas Masuk | Rp xxx |
| Kas Keluar | Rp xxx |
| **Saldo Kas Bersih** | **Rp xxx** |

> **Catatan:** Versi ini merupakan laporan arus kas sederhana (tidak dipisah menjadi aktivitas operasi, investasi, dan pendanaan). Ini disesuaikan dengan kebutuhan UMKM yang menginginkan kesederhanaan.

---

### 6.12 `perubahanModal.js`

**Peran:** Merender Laporan Perubahan Modal — menunjukkan perubahan ekuitas pemilik dalam suatu periode.

**Cara Perhitungan:**

```javascript
data.forEach(transaksi => {
  const { debit, kredit } = tentukanDebitKredit(transaksi);

  if (kredit.kategori === "pendapatan") totalPendapatan += transaksi.jumlah;
  if (debit.kategori === "beban")       totalBeban      += transaksi.jumlah;

  // Modal bertambah → Modal di Kredit
  if (kredit.nama === "Modal") tambahanModal += transaksi.jumlah;

  // Prive (pengambilan pribadi) → Prive di Debit
  if (debit.nama === "Prive") prive += transaksi.jumlah;
});
```

**Rumus:**
```
Laba Bersih  = Total Pendapatan − Total Beban
Modal Akhir  = Modal Awal + Tambahan Modal + Laba Bersih − Prive
```

*Modal Awal selalu dimulai dari Rp 0 karena sistem tidak mendukung input saldo awal periode sebelumnya.*

**Tampilan Laporan:**

| Baris | Nilai |
|-------|-------|
| Modal Awal | Rp 0 |
| Tambahan Modal | Rp xxx |
| Laba Bersih | Rp xxx |
| Prive | (Rp xxx) |
| **Modal Akhir** | **Rp xxx** |

---

### 6.13 `jurnalPenyesuaian.js`

**Peran:** Merender halaman Jurnal Penyesuaian — pencatatan penyesuaian nilai Persediaan dan Peralatan di akhir periode akuntansi, serta penghitungan Harga Pokok Penjualan (HPP).

**Tiga Sumber Data yang Ditampilkan:**

#### 1. Tabel Jurnal Penyesuaian – Persediaan
Menampilkan semua transaksi dari Jurnal Umum yang melibatkan akun Persediaan (kode 113).
- Filter: transaksi yang `debit.nama === "persediaan"` ATAU `kredit.nama === "persediaan"`.
- Menghitung `totalPersediaan` sebagai akumulasi (debit menambah, kredit mengurangi).

#### 2. Tabel Jurnal Penyesuaian – Peralatan
Sama seperti Persediaan, tetapi untuk akun Peralatan (kode 105).

#### 3. Tabel Penyesuaian HPP Bulanan
Menggabungkan dua sumber data:
- **Otomatis:** Transaksi Jurnal Umum yang keterangannya mengandung kata kunci HPP (dari `KATA_KUNCI_HPP_OTOMATIS`).
- **Manual:** Data yang diinput langsung melalui form "Input HPP Manual" di halaman ini, tersimpan di `localStorage` dengan key `penyesuaian_hpp`.

**Form Input HPP Manual:**

Pengguna mengisi:
- Tanggal (dibatasi maksimal hari ini — tidak boleh tanggal masa depan)
- Akun yang Dikurangi (dropdown: Persediaan / Peralatan — tidak perlu menebak dari keterangan)
- Keterangan
- Jumlah (wajib > 0)

Preview entri jurnal ditampilkan secara real-time sebelum pengguna submit:
```
Debit  511 - Harga Pokok Penjualan   Rp xxx
Kredit 113 - Persediaan              Rp xxx
```

Validasi yang dilakukan sebelum menyimpan:
- Tanggal tidak boleh kosong dan tidak boleh masa depan
- Akun target wajib dipilih dari dropdown
- Keterangan wajib diisi
- Jumlah wajib > 0

**Fungsi `deleteInputHPP(id)`:**
- Jika ID ditemukan di data manual (localStorage): hapus dengan konfirmasi.
- Jika ID berasal dari data otomatis (transaksi Jurnal Umum): tampilkan pesan bahwa penghapusan harus dilakukan dari Jurnal Umum.

---

### 6.14 `transferKas.js`

**Peran:** Menyediakan fitur transfer dana antar rekening internal (Kas Tunai ↔ Kas Bank), serupa dengan fitur transfer antar rekening di aplikasi perbankan.

**Cara Kerja:**

Transfer dicatat sebagai transaksi Jurnal Umum biasa:
- Rekening tujuan → **Debit** (bertambah)
- Rekening asal → **Kredit** (berkurang)

Karena kedua akun adalah akun Aset, transaksi ini tidak mempengaruhi Laba Rugi.

**Validasi Sebelum Transfer:**

1. Rekening asal dan tujuan tidak boleh sama.
2. Jumlah harus lebih dari 0.
3. Saldo rekening asal harus mencukupi (dicek menggunakan `hitungSaldoRekening()`).

**Fungsi `hitungSaldoRekening()`:**
Menghitung saldo Kas Tunai dan Kas Bank secara real-time dari seluruh transaksi tersimpan.

**Fungsi `syncTransferKeOptions()`:**
Mencegah pengguna memilih rekening tujuan yang sama dengan rekening asal. Saat rekening asal berubah, pilihan rekening tujuan otomatis disesuaikan.

**Penanda Transaksi Transfer (`isTransfer: true`):**
Transaksi hasil transfer diberi flag `isTransfer: true` dalam objek transaksi. Ini digunakan oleh halaman Riwayat Transfer untuk memfilter dan hanya menampilkan transaksi transfer.

---

### 6.15 `anggaran.js`

**Peran:** Menyediakan fitur anggaran (budget) pengeluaran bulanan per kategori beban — serupa dengan fitur budget di aplikasi keuangan personal modern.

**Cara Kerja:**

1. Pengguna menetapkan batas pengeluaran untuk setiap akun beban (Gaji, Listrik, Air, Internet, Sewa).
2. Sistem membandingkan batas tersebut dengan realisasi beban bulan berjalan dari transaksi yang ada.
3. Progress bar menampilkan persentase pemakaian anggaran dengan kode warna:
   - **Hijau** (< 80%): masih aman
   - **Oranye** (≥ 80%): mendekati batas
   - **Merah** (> 100%): melebihi batas — disertai ikon ⚠️

**Fungsi `hitungRealisasiBebanBulanIni(bulanIni)`:**
Memfilter transaksi berdasarkan bulan (`YYYY-MM`) dan menghitung total beban per akun untuk bulan tersebut.

**Fungsi `handleAnggaranSubmit()`:**
Jika akun sudah memiliki anggaran sebelumnya, nilai lama digantikan (update). Jika belum ada, ditambahkan (insert). Data disimpan ke localStorage dengan key `anggaran_bulanan`.

**Data Anggaran yang Tersimpan:**
```javascript
[
  { akun: "Beban Gaji",    limit: 5000000 },
  { akun: "Beban Listrik", limit: 500000 },
  ...
]
```

---

### 6.16 `Database.js`

**Peran:** Menampilkan histori seluruh transaksi dalam format tabel lengkap dan menyediakan fitur ekspor laporan mutasi rekening ke file PDF.

**Tampilan Tabel Database:**

Setiap transaksi ditampilkan dalam 2 baris (double-entry):

| No | Tanggal | Kode | Keterangan | Akun | Debit | Kredit | Aksi |
|----|---------|------|------------|------|-------|--------|------|
| 1 | 15/06/2026 | 101 | Penjualan | Kas | Rp 1.500.000 | — | 🗑️ |
|   |           | 401 |           | Pendapatan | — | Rp 1.500.000 | |

**Penghapusan Transaksi (`deleteDatabaseTransaksi`):**
Penghapusan satu transaksi memerlukan verifikasi PIN pengguna (menggunakan `verifyPin()`). Jika pengguna belum mengatur PIN, sistem meminta pembuatan PIN terlebih dahulu.

**Hapus Semua Transaksi (`deleteAllDatabaseTransaksi`):**
Memerlukan verifikasi PIN dan konfirmasi dua kali sebelum menghapus seluruh data. Ini mencegah penghapusan tidak sengaja.

**Fitur Download PDF (`downloadDatabasePDF`):**

Menghasilkan dokumen PDF bergaya mutasi rekening bank menggunakan jsPDF + AutoTable.

Struktur dokumen PDF:

**1. Header (latar biru):**
- Nama aplikasi: KeuanganKu
- Judul: MUTASI REKENING
- Periode transaksi (tanggal pertama s/d tanggal terakhir)
- Tanggal dan jam cetak

**2. Informasi Pemilik Rekening:**
- Nama pemilik: username yang login (huruf kapital)
- Jenis akun: Kas Umum
- Total jumlah transaksi

**3. Tabel Mutasi:**

| Tanggal | Keterangan | Debit (Keluar) | Kredit (Masuk) | Saldo |
|---------|------------|----------------|----------------|-------|
| SALDO AWAL | | | | Rp 0 |
| 15/06/2026 | Penjualan | — | Rp 1.500.000 | Rp 1.500.000 CR |

- Kolom Debit: teks merah (kas keluar)
- Kolom Kredit: teks hijau (kas masuk)
- Saldo berjalan: label **CR** (positif) atau **DB** (negatif)
- Baris berganti warna (zebra striping) untuk keterbacaan

**4. Ringkasan Bawah (3 kotak berdampingan):**
- Total Debit (Keluar) — latar merah muda
- Total Kredit (Masuk) — latar hijau muda
- Saldo Akhir — latar biru muda

**5. Footer:**
- Catatan: "Dokumen ini bukan dokumen resmi perbankan"
- Nama pengguna dan tanggal cetak
- Nomor halaman otomatis jika data melebihi satu halaman

**Nama file hasil download:** `mutasi_{username}_{YYYY-MM-DD}.pdf`

---

## 7. Siklus Akuntansi dalam Sistem

Sistem ini mengimplementasikan siklus akuntansi standar secara digital:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIKLUS AKUNTANSI                              │
│                                                                   │
│  1. TRANSAKSI KEUANGAN (Aktivitas bisnis nyata)                  │
│          │                                                        │
│          ▼                                                        │
│  2. JURNAL UMUM (inputTransaksi.js)                              │
│     Pencatatan kronologis setiap transaksi dalam format          │
│     double-entry (debit & kredit)                                 │
│          │                                                        │
│          ▼                                                        │
│  3. BUKU BESAR (bukuBesar.js)                                    │
│     Pengelompokan transaksi per akun dengan saldo berjalan       │
│          │                                                        │
│          ▼                                                        │
│  4. NERACA SALDO (neracaSaldo.js)                                │
│     Verifikasi keseimbangan: Total Debit = Total Kredit          │
│          │                                                        │
│          ▼                                                        │
│  5. JURNAL PENYESUAIAN (jurnalPenyesuaian.js)                   │
│     Koreksi nilai persediaan, peralatan, dan HPP                  │
│          │                                                        │
│          ▼                                                        │
│  6. LAPORAN KEUANGAN                                             │
│     ├── Laporan Laba Rugi (labaRugi.js)                         │
│     ├── Laporan Arus Kas (arusKas.js)                           │
│     └── Laporan Perubahan Modal (perubahanModal.js)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Master Akun (Chart of Accounts)

Sistem menggunakan daftar akun tetap yang telah dipredefinisikan. Akun-akun ini tidak dapat ditambah atau diubah melalui antarmuka pengguna.

### Kelompok Aset — Kode 1xx (Saldo Normal: Debit)
| Kode | Nama Akun | Kata Kunci Deteksi (`idnama`) |
|------|-----------|-------------------------------|
| 101 | Kas | `"kas"` |
| 102 | Kas Bank | `"kas bank"` |
| 103 | Piutang | `"piutang"` |
| 104 | Persediaan | `"persediaan"` |
| 105 | Peralatan | `"peralatan"` |

### Kelompok Liabilitas — Kode 2xx (Saldo Normal: Kredit)
| Kode | Nama Akun | Kata Kunci Deteksi (`idnama`) |
|------|-----------|-------------------------------|
| 201 | Utang Usaha | `"utang usaha"` |
| 202 | Utang Bank | `"utang bank"` |

### Kelompok Ekuitas — Kode 3xx (Saldo Normal: Kredit)
| Kode | Nama Akun | Kata Kunci Deteksi (`idnama`) |
|------|-----------|-------------------------------|
| 301 | Modal | `"modal"` |
| 302 | Prive | `"prive"`, `"ambil kas"`, `"pribadi"` |
| 303 | Laba Ditahan | `"laba ditahan"` |

### Kelompok Pendapatan — Kode 4xx (Saldo Normal: Kredit)
| Kode | Nama Akun | Kata Kunci Deteksi (`idnama`) |
|------|-----------|-------------------------------|
| 401 | Pendapatan | `"penjualan"` |
| 402 | Pendapatan Lainnya | `"penjualan lainnya"` |

### Kelompok Beban — Kode 5xx (Saldo Normal: Debit)
| Kode | Nama Akun | Kata Kunci Deteksi (`idnama`) |
|------|-----------|-------------------------------|
| 501 | Beban Gaji | `"bayar gaji"` |
| 502 | Beban Listrik | `"bayar listrik"` |
| 503 | Beban Air | `"bayar air"` |
| 504 | Beban Internet | `"bayar internet"` |
| 505 | Beban Sewa | `"bayar sewa"` |

---

## 9. Logika Deteksi Akun Otomatis

Sistem menggunakan pendekatan **Rule-Based Keyword Matching** — keterangan transaksi dicocokkan secara berurutan dengan aturan yang telah dipredefinisikan.

### Fungsi `detectAkunUtama(keterangan)`

Menentukan akun utama transaksi berdasarkan keterangan. Urutan pemeriksaan (prioritas dari atas ke bawah):

**Prioritas 1 — Penjualan Piutang**
```
Syarat : keterangan mengandung "piutang" DAN ("penjualan" ATAU "jual")
Hasil  : Akun Utama = Piutang (103)
Contoh : "penjualan piutang" → Debit Piutang, Kredit Pendapatan
```

**Prioritas 2 — Pembelian Aset**
```
Syarat : keterangan mengandung "beli" ATAU "membeli" ATAU "pembelian"
         DAN mengandung nama aset selain Kas
Hasil  : Akun Utama = Aset yang disebutkan
Contoh : "beli peralatan" → Debit Peralatan, Kredit Kas
```

**Prioritas 3 — Bayar Utang Bank**
```
Syarat : keterangan mengandung "bayar utang bank"
Hasil  : Akun Utama = Utang Bank (202)
Contoh : "bayar utang bank" → Debit Utang Bank, Kredit Kas
```

**Prioritas 4 — Bayar Utang Usaha**
```
Syarat : keterangan mengandung "bayar utang" (tanpa "bank")
Hasil  : Akun Utama = Utang Usaha (201)
Contoh : "bayar utang usaha" → Debit Utang Usaha, Kredit Kas
```

**Prioritas 5 — Terima/Bayar Piutang**
```
Syarat : keterangan mengandung "bayar piutang" ATAU "terima piutang"
         ATAU "pelunasan piutang"
Hasil  : Akun Utama = Piutang (103)
Contoh : "terima piutang" → Debit Kas, Kredit Piutang
```

**Prioritas 6 — Penyesuaian HPP**
```
Syarat : keterangan mengandung salah satu KATA_KUNCI_HPP
         ("hpp", "pemakaian", "penyusutan", "depresiasi", "susut", dll)
Hasil  : Akun Utama = Peralatan (jika "peralatan" disebutkan) ATAU Persediaan
Contoh : "pemakaian persediaan" → Debit HPP, Kredit Persediaan
```

**Prioritas 7 — Deteksi Umum (fallback)**
```
Syarat : Cocokkan keterangan dengan field idnama di seluruh AKUN_RULES
Hasil  : Ambil akun dengan kategori prioritas tertinggi
         (pendapatan > beban > liabilitas > ekuitas > aset)
Contoh : "bayar gaji" → cocok dengan idnama "bayar gaji" → Beban Gaji (501)
```

### Fungsi `detectAkunLawan(akunUtama, keterangan)`

Setelah akun utama diketahui, sistem menentukan akun lawan (akun penyeimbang):

| Kondisi | Akun Lawan |
|---------|-----------|
| Akun utama = Piutang + keterangan mengandung "penjualan" | Pendapatan |
| Akun utama = Aset (bukan Kas/Piutang) + keterangan mengandung "utang" | Utang Usaha |
| Akun utama = Kas + keterangan mengandung "setor"/"modal" | Modal |
| Akun utama = Utang Usaha ATAU Utang Bank | Kas |
| Akun utama = Piutang (bukan penjualan) | Kas |
| Akun utama = Pendapatan ATAU Beban | Kas |
| Akun utama = Aset selain Kas | Kas |
| Akun utama = Ekuitas | Kas |
| Default | Kas |

---

## 10. Logika Penentuan Debit dan Kredit

### Fungsi `tentukanDebitKredit(transaksi)`

Setelah akun utama dan akun lawan diketahui, posisi Debit/Kredit ditentukan berdasarkan **saldo normal** akun:

**Langkah 1 — Tentukan berdasarkan saldo normal:**
```
Jika akunUtama.saldoNormal === "debit":
    debit  = akunUtama
    kredit = akunLawan

Jika akunUtama.saldoNormal === "kredit":
    debit  = akunLawan
    kredit = akunUtama
```

**Langkah 2 — Balik jika transaksi pengurangan (`pengurangan === true`):**
```
Jika transaksi.pengurangan === true:
    [debit, kredit] = [kredit, debit]   (swap)
```

Transaksi pengurangan (`isPenguranganAkun`) meliputi:
- `"bayar piutang"`, `"bayar utang"`, `"pelunasan"`, `"pembayaran"`
- Kata kunci HPP (pemakaian, penyusutan, dll.)

**Pengecualian Khusus — Akun Prive:**
```
Jika akunUtama = Prive DAN keterangan mengandung "kembalikan"/"setor":
    debit  = Kas (akunLawan)     ← kembalikan prive: Kas masuk
    kredit = Prive (akunUtama)

Jika akunUtama = Prive (ambil pribadi):
    debit  = Prive (akunUtama)   ← ambil prive: Prive bertambah
    kredit = Kas (akunLawan)
```

### Tabel Contoh Transaksi

| Keterangan Input | Akun Utama | Akun Lawan | Debit | Kredit |
|------------------|-----------|-----------|-------|--------|
| `penjualan tunai` | Pendapatan | Kas | Kas (101) | Pendapatan (401) |
| `bayar gaji` | Beban Gaji | Kas | Beban Gaji (501) | Kas (101) |
| `setor modal` | Kas | Modal | Kas (101) | Modal (301) |
| `beli peralatan` | Peralatan | Kas | Peralatan (105) | Kas (101) |
| `bayar utang usaha` | Utang Usaha | Kas | Utang Usaha (201) | Kas (101) |
| `penjualan piutang` | Piutang | Pendapatan | Piutang (103) | Pendapatan (401) |
| `terima piutang` | Piutang | Kas | Kas (101) | Piutang (103) |
| `ambil kas pribadi` | Prive | Kas | Prive (302) | Kas (101) |
| `pemakaian persediaan` | Persediaan | — | HPP (511) | Persediaan (104) |

---

## 11. Sistem Penyimpanan Data (localStorage)

Seluruh data aplikasi disimpan di `localStorage` browser pengguna. `localStorage` adalah Web Storage API yang memungkinkan penyimpanan data key-value secara persisten (data tidak hilang saat browser ditutup).

### Daftar Lengkap Key localStorage

| Key | Tipe Data | Scope | Keterangan |
|-----|-----------|-------|-----------|
| `users` | `Array` | **Global** | Daftar semua akun pengguna `[{username, password}]` |
| `isLoggedIn` | `String ("true")` | **Global** | Status sesi login aktif |
| `username` | `String` | **Global** | Username pengguna yang sedang login |
| `{user}_input_transaksi` | `Array` | Per pengguna | Semua transaksi jurnal umum |
| `{user}_penyesuaian_hpp` | `Array` | Per pengguna | HPP manual dari form penyesuaian |
| `{user}_total_penyesuaian` | `Number` | Per pengguna | Total nilai penyesuaian (aset − HPP) |
| `{user}_pin_transaksi` | `String` | Per pengguna | PIN untuk konfirmasi hapus transaksi |
| `{user}_anggaran_bulanan` | `Array` | Per pengguna | Daftar batas anggaran per kategori beban |

### Keterbatasan localStorage

- **Kapasitas:** Sekitar 5–10 MB per domain (bervariasi per browser). Cukup untuk ribuan transaksi.
- **Scope:** Hanya tersedia di browser dan perangkat yang sama. Data tidak tersinkronisasi antar perangkat.
- **Keamanan:** Data tersimpan dalam bentuk teks biasa (tidak dienkripsi). Tidak disarankan untuk data keuangan yang sangat sensitif di komputer publik.
- **Persistensi:** Data bertahan selama pengguna tidak menghapus data browser atau menggunakan mode penyamaran (incognito).

---

## 12. Sistem Autentikasi dan Manajemen Sesi

### Alur Login

```
Pengguna isi username & password
         │
         ▼
loadUsers() → ambil array users dari localStorage['users']
         │
         ▼
users.find(u => u.username === username && u.password === password)
         │
    ┌────┴────┐
   Cocok    Tidak
    │         │
    ▼         ▼
Simpan      Tampilkan
isLoggedIn  pesan error
= "true"
    │
    ▼
showMainContent()
navigateTo("Dashboard")
```

### Persistensi Sesi

Saat halaman dibuka atau di-refresh:
```javascript
function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) showMainContent();
  else showLoginForm();
}
```

Pengguna tidak perlu login ulang selama `isLoggedIn` masih ada di localStorage.

### Logout

Menghapus `isLoggedIn` dan `username` dari localStorage, lalu kembali menampilkan form login. Data keuangan pengguna tidak ikut terhapus saat logout — tetap tersimpan dengan prefix username.

### Keamanan PIN

Untuk aksi sensitif (hapus transaksi, hapus semua data), sistem meminta verifikasi PIN. PIN disimpan terpisah dari password login di `{user}_pin_transaksi`. Ini adalah lapisan keamanan tambahan untuk mencegah penghapusan data tidak sengaja.

---

## 13. Manajemen Data Per Pengguna

Setiap operasi baca/tulis data keuangan melewati fungsi `getPrefixedKey()` di `storage.js`:

```javascript
function getPrefixedKey(key) {
  const username = localStorage.getItem('username');
  return username ? `${username}_${key}` : key;
}
```

**Contoh Skenario Multi-User:**

Jika dua pengguna (`Zaqi26` dan `Budi`) menggunakan browser yang sama:

```
localStorage:
├── users                     → [{username:"Zaqi26",...}, {username:"Budi",...}]
├── isLoggedIn                → "true" (siapa yang sedang aktif)
├── username                  → "Zaqi26" (atau "Budi")
│
├── Zaqi26_input_transaksi    → [{...transaksi Zaqi...}]
├── Zaqi26_anggaran_bulanan   → [{...anggaran Zaqi...}]
│
├── Budi_input_transaksi      → [{...transaksi Budi...}]
└── Budi_anggaran_bulanan     → [{...anggaran Budi...}]
```

Data masing-masing pengguna sepenuhnya terpisah dan tidak saling terpengaruh.

---

## 14. Alur Sistem Lengkap

```
[Buka Aplikasi / Refresh]
         │
         ▼
   checkAuth()
   ┌──────┴──────┐
  Sudah        Belum
  Login        Login
   │              │
   ▼              ▼
[Dashboard]   [Form Login]
               │
               ▼
        [Isi Username & Password]
               │
               ▼
        [Validasi ke 'users' di localStorage]
          ┌────┴────┐
        Cocok    Tidak
          │         │
          ▼         ▼
   [Simpan sesi] [Pesan error]
          │
          ▼
      [Dashboard]
    ┌────────────────────────────────────┐
    │  Ringkasan Keuangan Real-time      │
    │  • Total Saldo, Laba Bersih,       │
    │    Jumlah Transaksi                │
    │  • Kas Tunai vs Kas Bank           │
    │  • Grafik Tren Keuangan Bulanan    │
    └────────────────────────────────────┘
          │
          ▼ (klik menu navigasi)
   ┌──────────────────────────────────────────────────────────────┐
   │                    ALUR INPUT TRANSAKSI                       │
   │                                                              │
   │  [Isi Form: Tanggal, Metode, Keterangan, Jumlah]            │
   │         │                                                    │
   │         ▼                                                    │
   │  [Konfirmasi Dialog]                                         │
   │         │                                                    │
   │         ▼                                                    │
   │  [Validasi Keterangan → detectAkunUtama()]                   │
   │         │                                                    │
   │         ▼                                                    │
   │  [Tentukan Akun Lawan → detectAkunLawan()]                   │
   │         │                                                    │
   │         ▼                                                    │
   │  [Tentukan Posisi → tentukanDebitKredit()]                   │
   │         │                                                    │
   │         ▼                                                    │
   │  [Simpan ke {username}_input_transaksi]                      │
   │         │                                                    │
   │         ▼                                                    │
   │  [Tampilkan di Jurnal Umum]                                  │
   └──────────────────────────────────────────────────────────────┘
          │
          ▼ (data mengalir otomatis ke semua laporan)
   ┌──────┬──────┬────────────────┬──────────┬───────────────────┐
   │      │      │                │          │                   │
   ▼      ▼      ▼                ▼          ▼                   ▼
[Buku] [Neraca] [Jurnal      [Laba    [Arus    [Perubahan
[Besar][Saldo]  [Penyesuaian] Rugi]    Kas]    Modal]
                     │
                     ▼
             [Transfer Kas]   [Anggaran]   [Database/Histori]
                                                   │
                                                   ▼
                                          [Download PDF Mutasi]
```

---

## 15. Cara Instalasi dan Menjalankan Aplikasi

Aplikasi ini adalah **static web application** — tidak memerlukan instalasi server, database, atau perangkat lunak khusus.

### Langkah-langkah:

**1. Unduh atau clone seluruh file proyek:**
```
Pastikan seluruh file berada dalam satu folder dengan struktur yang benar:
/
├── index.html
└── assets/
    ├── css/style.css
    └── js/
        ├── utils.js
        ├── storage.js
        ├── app.js
        └── modules/
            ├── Dashboard.js
            ├── inputTransaksi.js
            └── ... (seluruh modul lainnya)
```

**2. Buka file `index.html` langsung di browser:**
- Klik dua kali file `index.html`, atau
- Tarik dan lepas (drag & drop) file `index.html` ke jendela browser.

**3. Pastikan koneksi internet aktif saat pertama kali membuka** (untuk memuat Google Fonts, Font Awesome, jsPDF, Chart.js dari CDN).

**4. Daftarkan akun baru** melalui tautan "Belum punya akun?" di halaman login.

**5. Login dan mulai mencatat transaksi.**

### Catatan Penting:
- JavaScript **tidak boleh diblokir** di browser.
- `localStorage` harus diaktifkan (aktif secara default di semua browser modern).
- Jangan membuka dari mode penyamaran (incognito) jika ingin data tersimpan permanen.

---

## 16. Persyaratan Sistem

### Browser yang Didukung

| Browser | Versi Minimum |
|---------|--------------|
| Google Chrome | 80+ |
| Mozilla Firefox | 75+ |
| Microsoft Edge | 80+ |
| Safari | 13+ |
| Chrome Android | 80+ |
| Safari iOS | 13+ |

### Perangkat
- Desktop, laptop, tablet, atau smartphone
- Tidak diperlukan spesifikasi hardware khusus

### Konektivitas
- Koneksi internet diperlukan **hanya** untuk memuat library CDN pada pemuatan pertama
- Setelah halaman dimuat, aplikasi dapat berjalan secara offline

---

## 17. Batasan dan Keterbatasan Sistem

| No | Keterbatasan | Keterangan |
|----|-------------|-----------|
| 1 | **Data lokal saja** | Data hanya tersimpan di browser lokal. Tidak ada sinkronisasi antar perangkat. |
| 2 | **Tidak ada backup otomatis** | Jika data browser dihapus (clear site data), data keuangan ikut hilang. |
| 3 | **Akun tidak dapat ditambah** | Chart of Accounts bersifat tetap dan tidak dapat dikustomisasi oleh pengguna. |
| 4 | **Periode tidak dapat ditentukan** | Sistem menampilkan semua transaksi tanpa batasan periode (tidak ada filter per tahun buku). |
| 5 | **Modal awal selalu nol** | Laporan Perubahan Modal selalu dimulai dari Modal Awal = Rp 0 karena tidak ada mekanisme input saldo awal. |
| 6 | **Keamanan password terbatas** | Password disimpan dalam bentuk teks biasa di localStorage (tidak di-hash). |
| 7 | **Tidak ada multi-perusahaan** | Setiap akun pengguna mewakili satu entitas bisnis saja. |
| 8 | **Arus Kas disederhanakan** | Tidak dipisah menjadi aktivitas operasi, investasi, dan pendanaan sesuai standar PSAK 2. |

---

## 18. Glosarium Istilah

| Istilah | Definisi |
|---------|---------|
| **Akun** | Catatan sistematis perubahan nilai suatu elemen keuangan (aset, liabilitas, ekuitas, pendapatan, beban) |
| **Aset** | Sumber daya yang dimiliki perusahaan dan memberikan manfaat ekonomi di masa depan (Kas, Piutang, Persediaan, Peralatan) |
| **Beban** | Pengeluaran yang terjadi dalam rangka menghasilkan pendapatan (Gaji, Listrik, Sewa, dll) |
| **Buku Besar** | Kumpulan semua akun yang digunakan perusahaan, menampilkan saldo berjalan per akun |
| **Debit** | Sisi kiri dalam entri jurnal. Menambah saldo akun bersaldo normal debit (aset, beban) |
| **Double-Entry** | Sistem pencatatan akuntansi di mana setiap transaksi selalu mempengaruhi minimal dua akun (debit = kredit) |
| **Ekuitas** | Hak pemilik atas aset perusahaan setelah dikurangi liabilitas (Modal, Prive, Laba Ditahan) |
| **HPP** | Harga Pokok Penjualan — biaya langsung yang terkait dengan produksi/pembelian barang yang dijual |
| **Jurnal Umum** | Buku catatan pertama di mana setiap transaksi dicatat secara kronologis |
| **Jurnal Penyesuaian** | Jurnal yang dibuat di akhir periode untuk menyesuaikan nilai akun agar mencerminkan kondisi sebenarnya |
| **Kas** | Uang tunai yang dimiliki perusahaan, siap digunakan kapan saja |
| **Kredit** | Sisi kanan dalam entri jurnal. Menambah saldo akun bersaldo normal kredit (liabilitas, ekuitas, pendapatan) |
| **Laporan Arus Kas** | Laporan yang menggambarkan aliran masuk dan keluar kas dalam suatu periode |
| **Laporan Laba Rugi** | Laporan yang menunjukkan pendapatan, beban, dan laba/rugi bersih dalam suatu periode |
| **Laporan Perubahan Modal** | Laporan yang menjelaskan perubahan ekuitas pemilik dari awal hingga akhir periode |
| **Liabilitas** | Kewajiban perusahaan kepada pihak lain yang harus dilunasi (Utang Usaha, Utang Bank) |
| **localStorage** | Web Storage API di browser yang memungkinkan penyimpanan data key-value secara persisten |
| **Neraca Saldo** | Daftar saldo semua akun untuk memverifikasi total debit sama dengan total kredit |
| **Pendapatan** | Penghasilan yang diterima perusahaan dari kegiatan usaha utamanya |
| **Persediaan** | Barang-barang yang dimiliki perusahaan untuk dijual atau digunakan dalam proses produksi |
| **Prive** | Pengambilan aset perusahaan oleh pemilik untuk keperluan pribadi |
| **Rule-Based NLP** | Pendekatan pemrosesan bahasa alami berbasis aturan; mencocokkan teks dengan pola/kata kunci yang telah ditentukan |
| **Saldo Normal** | Sisi (debit atau kredit) di mana suatu akun biasanya memiliki saldo positif berdasarkan jenisnya |
| **Single Page Application (SPA)** | Aplikasi web yang memuat satu halaman HTML dan memperbarui konten secara dinamis tanpa reload halaman |
| **Static Web Application** | Aplikasi web yang tidak memerlukan server backend; semua logika berjalan di browser klien |
| **UMKM** | Usaha Mikro, Kecil, dan Menengah — klasifikasi usaha berdasarkan skala aset dan omzet |

---

*Dokumen ini disusun secara lengkap dan menyeluruh untuk keperluan laporan Tugas Akhir / Skripsi.*  
*Seluruh penjelasan didasarkan pada implementasi kode sumber aktual yang terdapat dalam proyek ini.*
