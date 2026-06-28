# 📊 Aplikasi Laporan Keuangan UMKM

> Sistem pencatatan dan pelaporan keuangan berbasis web untuk Usaha Mikro, Kecil, dan Menengah (UMKM) yang dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa framework atau database server.

---

## 📋 Daftar Isi

1. [Deskripsi Aplikasi](#deskripsi-aplikasi)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Struktur File](#struktur-file)
4. [Fitur Lengkap](#fitur-lengkap)
   - [Sistem Autentikasi](#1-sistem-autentikasi)
   - [Manajemen Data Per Pengguna](#2-manajemen-data-per-pengguna)
   - [Dashboard](#3-dashboard)
   - [Input Transaksi & Jurnal Umum](#4-input-transaksi--jurnal-umum)
   - [Buku Besar](#5-buku-besar)
   - [Neraca Saldo](#6-neraca-saldo)
   - [Laporan Laba Rugi](#7-laporan-laba-rugi)
   - [Laporan Arus Kas](#8-laporan-arus-kas)
   - [Laporan Perubahan Modal](#9-laporan-perubahan-modal)
   - [Jurnal Penyesuaian](#10-jurnal-penyesuaian)
   - [Histori Transaksi (Database)](#11-histori-transaksi-database)
   - [Download Mutasi PDF](#12-download-mutasi-pdf)
5. [Alur Sistem](#alur-sistem)
6. [Master Akun](#master-akun)
7. [Logika Deteksi Akun Otomatis](#logika-deteksi-akun-otomatis)
8. [Penyimpanan Data](#penyimpanan-data)
9. [Cara Menjalankan](#cara-menjalankan)

---

## Deskripsi Aplikasi

Aplikasi Laporan Keuangan UMKM adalah sistem informasi akuntansi berbasis web yang dirancang untuk membantu pelaku UMKM dalam mencatat transaksi keuangan sehari-hari secara otomatis dan menghasilkan laporan keuangan standar tanpa memerlukan pengetahuan akuntansi mendalam.

Sistem ini mengimplementasikan siklus akuntansi penuh mulai dari pencatatan jurnal umum, buku besar, neraca saldo, hingga laporan keuangan akhir (Laba Rugi, Arus Kas, Perubahan Modal). Seluruh proses pencatatan debit-kredit dilakukan secara **otomatis** berdasarkan keterangan transaksi yang dimasukkan pengguna.

---

## Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| HTML5 | - | Struktur antarmuka |
| CSS3 | - | Tampilan dan responsivitas |
| JavaScript (Vanilla) | ES6+ | Logika bisnis dan rendering UI |
| jsPDF | 2.5.1 | Generate file PDF mutasi rekening |
| jsPDF AutoTable | 3.5.31 | Tabel otomatis dalam PDF |
| Font Awesome | - | Ikon antarmuka |
| localStorage | Web API | Penyimpanan data lokal per browser |

> Tidak menggunakan framework JavaScript (React, Vue, Angular) maupun database server (MySQL, MongoDB). Seluruh data tersimpan di **localStorage** browser pengguna.

---

## Struktur File

```
/
├── index.html                  # Entry point, struktur halaman utama
├── assets/
│   ├── css/
│   │   └── style.css           # Seluruh styling aplikasi
│   └── js/
│       ├── utils.js            # Fungsi utilitas (format rupiah, tanggal, dsb)
│       ├── storage.js          # Manajemen penyimpanan data per pengguna
│       ├── app.js              # Autentikasi, navigasi, routing halaman
│       └── modules/
│           ├── Dashboard.js          # Halaman ringkasan keuangan
│           ├── inputTransaksi.js     # Input transaksi & jurnal umum
│           ├── bukuBesar.js          # Laporan buku besar
│           ├── neracaSaldo.js        # Neraca saldo
│           ├── labaRugi.js           # Laporan laba rugi
│           ├── arusKas.js            # Laporan arus kas
│           ├── perubahanModal.js     # Laporan perubahan modal
│           ├── jurnalPenyesuaian.js  # Jurnal penyesuaian HPP
│           └── Database.js           # Histori transaksi & export PDF
```

---

## Fitur Lengkap

### 1. Sistem Autentikasi

**File:** `app.js`

Aplikasi memiliki sistem autentikasi lengkap dengan tiga form utama:

#### a. Login
- Pengguna memasukkan **username** dan **password**.
- Data pengguna dicocokkan dengan daftar akun yang tersimpan di `localStorage` (key: `users`).
- Jika cocok, status login disimpan (`isLoggedIn = true`) dan username aktif disimpan (`username`).
- Setelah login berhasil, pengguna langsung diarahkan ke halaman **Dashboard**.

#### b. Registrasi
- Pengguna mengisi username, password, dan konfirmasi password.
- Validasi meliputi:
  - Semua field wajib diisi.
  - Password minimal 3 karakter.
  - Password dan konfirmasi harus sama.
  - Username tidak boleh sudah terdaftar.
- Akun baru ditambahkan ke array `users` di localStorage.
- Setelah berhasil, sistem otomatis berpindah ke form login setelah 1,5 detik.

#### c. Lupa Password
- Pengguna memasukkan username untuk dicari.
- Jika ditemukan, pengguna dapat mengatur password baru.
- Password baru divalidasi minimal 3 karakter dan harus dikonfirmasi.

#### d. Logout
- Menghapus `isLoggedIn` dan `username` dari localStorage.
- Tampilan kembali ke halaman login.

#### e. Persistensi Sesi
- Saat halaman dibuka ulang, sistem mengecek `isLoggedIn`.
- Jika masih aktif, langsung masuk ke konten utama tanpa perlu login ulang.

---

### 2. Manajemen Data Per Pengguna

**File:** `storage.js`

Ini adalah fitur kunci yang memastikan setiap pengguna memiliki **data keuangan yang terpisah** meski menggunakan browser yang sama.

#### Mekanisme Prefix Key
```
Format key: {username}_{namaData}

Contoh:
- Zaqi26_input_transaksi
- Budi_input_transaksi
- Zaqi26_penyesuaian_hpp
```

Setiap operasi baca/tulis data melewati fungsi:

```javascript
function getPrefixedKey(key) {
  const username = localStorage.getItem('username');
  return username ? `${username}_${key}` : key;
}

function saveData(key, data)  // Simpan dengan prefix username
function loadData(key)        // Baca dengan prefix username
function removeData(key)      // Hapus dengan prefix username
```

Data daftar pengguna (username & password) disimpan secara **global** tanpa prefix di key `users`, agar dapat diakses saat proses login sebelum pengguna teridentifikasi.

---

### 3. Dashboard

**File:** `Dashboard.js`

Halaman pertama yang ditampilkan setelah login. Menampilkan ringkasan keuangan real-time:

| Kartu | Keterangan |
|-------|-----------|
| **Saldo Kas** | Total kas masuk dikurangi kas keluar dari seluruh transaksi |
| **Laba Bersih** | Total pendapatan dikurangi total beban |
| **Jumlah Transaksi** | Total seluruh transaksi yang telah dicatat |

Di bagian atas kartu terdapat **sapaan personal** dengan nama pengguna yang sedang login (diambil dari `localStorage.getItem("username")`).

---

### 4. Input Transaksi & Jurnal Umum

**File:** `inputTransaksi.js`

Modul inti yang menjadi sumber data seluruh laporan keuangan.

#### a. Form Input Transaksi
Pengguna mengisi:
- **Tanggal** transaksi
- **Metode** pembayaran (Tunai / Non-Tunai)
- **Keterangan** transaksi (teks bebas, sistem akan mendeteksi akun secara otomatis)
- **Jumlah** (Rupiah)

#### b. Deteksi Akun Otomatis
Sistem membaca keterangan yang dimasukkan dan secara otomatis menentukan:
- **Akun Utama** (akun yang terpengaruh langsung)
- **Akun Lawan** (akun penyeimbang)
- **Posisi Debit/Kredit** sesuai saldo normal akun

Contoh deteksi:
```
Keterangan: "bayar gaji"   → Debit: Beban Gaji (501) | Kredit: Kas (101)
Keterangan: "penjualan"    → Debit: Kas (101)         | Kredit: Pendapatan (401)
Keterangan: "setor modal"  → Debit: Kas (101)         | Kredit: Modal (301)
Keterangan: "beli peralatan" → Debit: Peralatan (105) | Kredit: Kas (101)
```

#### c. Validasi Transaksi
- Keterangan harus mengandung nama akun yang dikenali sistem.
- Kas tidak boleh berdiri sendiri (harus ada akun lawan).
- Konfirmasi dialog muncul sebelum data disimpan.

#### d. Filter Jurnal Umum
Transaksi yang tersimpan ditampilkan dalam tabel **Jurnal Umum** dengan filter berdasarkan kategori akun:
- Semua
- Aset
- Liabilitas
- Ekuitas
- Pendapatan
- Beban

Data ditampilkan dalam format jurnal akuntansi berpasangan (double-entry) dengan kolom Tanggal, Kode Akun, Nama Akun, Debit, dan Kredit.

---

### 5. Buku Besar

**File:** `bukuBesar.js`

Menampilkan rekapitulasi setiap akun secara terpisah dalam format buku besar (T-Account) standar.

#### Cara Kerja:
1. Membaca seluruh transaksi dari `getInputTransaksi()`.
2. Mengelompokkan setiap transaksi ke akun yang terlibat (akun debit dan akun kredit).
3. Setiap akun ditampilkan dalam tabel tersendiri dengan kolom:

| Tanggal | Keterangan | Debit | Kredit | Saldo |
|---------|------------|-------|--------|-------|

4. Saldo dihitung secara **berjalan (running balance)** berdasarkan saldo normal akun:
   - Akun bersaldo normal **Debit**: Saldo = Debit − Kredit
   - Akun bersaldo normal **Kredit**: Saldo = Kredit − Debit

5. Transaksi diurutkan berdasarkan tanggal (ascending).

---

### 6. Neraca Saldo

**File:** `neracaSaldo.js`

Merangkum saldo akhir seluruh akun dalam satu tabel untuk memverifikasi keseimbangan antara total debit dan total kredit.

#### Cara Kerja:
- Setiap akun dihitung saldo bersihnya berdasarkan saldo normal.
- Akun bersaldo normal debit → ditampilkan di kolom Debit.
- Akun bersaldo normal kredit → ditampilkan di kolom Kredit.
- Baris Total menampilkan jumlah kolom Debit dan Kredit.
- Jika pembukuan benar, Total Debit = Total Kredit (**balanced**).

#### Kolom Tampilan:
| Kode | Nama Akun | Debit | Kredit |
|------|-----------|-------|--------|

---

### 7. Laporan Laba Rugi

**File:** `labaRugi.js`

Menghitung dan menampilkan laporan Laba atau Rugi usaha dalam periode tertentu.

#### Komponen Perhitungan:

```
Total Pendapatan  =  Σ transaksi dengan kredit kategori "pendapatan"
                  +  Nilai penyesuaian (dari Jurnal Penyesuaian HPP)

Total Beban       =  Σ transaksi dengan debit kategori "beban"

Laba Bersih       =  Total Pendapatan − Total Beban
```

#### Integrasi Jurnal Penyesuaian:
Nilai penyesuaian HPP dari modul Jurnal Penyesuaian disimpan di localStorage (key: `total_penyesuaian`) dan diintegrasikan langsung ke perhitungan Laba Rugi untuk menghasilkan nilai yang akurat.

---

### 8. Laporan Arus Kas

**File:** `arusKas.js`

Menampilkan ringkasan pergerakan uang kas dalam periode transaksi.

#### Logika Klasifikasi:
- **Kas Masuk** → transaksi di mana akun **Kas berada di posisi Debit** (kas bertambah)
- **Kas Keluar** → transaksi di mana akun **Kas berada di posisi Kredit** (kas berkurang)

#### Tampilan:
| Uraian | Jumlah |
|--------|--------|
| Kas Masuk | Rp xxx |
| Kas Keluar | Rp xxx |
| **Saldo Kas Bersih** | **Rp xxx** |

---

### 9. Laporan Perubahan Modal

**File:** `perubahanModal.js`

Menunjukkan perubahan ekuitas pemilik usaha selama periode berjalan.

#### Komponen Perhitungan:

```
Modal Awal        =  Rp 0 (periode awal)
Tambahan Modal    =  Σ transaksi dengan kredit akun "Modal"
Laba Bersih       =  Total Pendapatan − Total Beban
Prive             =  Σ transaksi dengan debit akun "Prive"

Modal Akhir       =  Modal Awal + Tambahan Modal + Laba Bersih − Prive
```

---

### 10. Jurnal Penyesuaian

**File:** `jurnalPenyesuaian.js`

Modul khusus untuk mencatat dan mengelola penyesuaian Harga Pokok Penjualan (HPP), persediaan, dan peralatan di akhir periode.

#### Sub-Fitur:

**a. Penyesuaian Otomatis**
Sistem secara otomatis mendeteksi transaksi yang berkaitan dengan HPP berdasarkan kata kunci pada keterangan:

| Kata Kunci | Keterangan |
|-----------|-----------|
| `hpp` | Harga pokok penjualan |
| `harga pokok penjualan` | Lengkap |
| `pemakaian` | Pemakaian bahan/persediaan |
| `pakai persediaan` | Pemakaian persediaan |
| `penyusutan` | Penyusutan aset |
| `depresiasi` | Depresiasi peralatan |
| `susut` | Penyusutan |

**b. Input HPP Manual**
Pengguna dapat menambahkan penyesuaian HPP secara manual dengan form:
- Tanggal
- Keterangan (harus mengandung kata "persediaan" atau "peralatan")
- Jumlah

**c. Tiga Tabel Penyesuaian:**

| Tabel | Isi |
|-------|-----|
| **Jurnal Penyesuaian Persediaan** | Seluruh transaksi yang melibatkan akun Persediaan |
| **Jurnal Penyesuaian Peralatan** | Seluruh transaksi yang melibatkan akun Peralatan |
| **Penyesuaian HPP Bulanan** | Transaksi HPP otomatis + manual, dengan label sumber |

**d. Kartu Ringkasan:**
- **Total Penyesuaian**: Total nilai HPP
- **Total Aset**: Total Persediaan + Peralatan

**e. Hapus Data HPP:**
- Data HPP manual dapat dihapus langsung dari tabel.
- Data HPP otomatis tidak dapat dihapus dari sini; harus dihapus dari Jurnal Umum (Histori Transaksi).

---

### 11. Histori Transaksi (Database)

**File:** `Database.js`

Menampilkan seluruh transaksi yang pernah dicatat dalam format tabel lengkap gaya jurnal akuntansi berpasangan (double-entry).

#### Kolom Tabel:
| No | Tanggal | Kode | Keterangan | Akun | Debit | Kredit | Aksi |
|----|---------|------|-----------|------|-------|--------|------|

#### Fitur Hapus Transaksi:

**Hapus Satu Transaksi:**
1. Klik ikon 🗑️ pada baris transaksi.
2. Dialog konfirmasi muncul berisi detail transaksi.
3. Modal input password muncul (password: `Esya69`).
4. Jika password benar, transaksi dihapus.

**Hapus Semua Transaksi:**
1. Klik tombol "🗑️ Hapus Semua Transaksi".
2. Dialog konfirmasi peringatan muncul.
3. Modal input password muncul.
4. Jika benar, seluruh data transaksi dihapus.

> Password perlindungan digunakan untuk mencegah penghapusan data secara tidak sengaja.

---

### 12. Download Mutasi PDF

**File:** `Database.js`

Menghasilkan laporan mutasi rekening dalam format **PDF** yang tampilannya menyerupai mutasi rekening bank pada umumnya.

#### Cara Kerja:
1. Pengguna klik tombol **📄 Download PDF** di halaman Histori.
2. Sistem mengumpulkan seluruh transaksi dan mengurutkan berdasarkan tanggal.
3. Dokumen PDF dibuat menggunakan library **jsPDF + AutoTable**.
4. File tersimpan otomatis dengan nama: `mutasi_{username}_{tanggal}.pdf`

#### Struktur Dokumen PDF:

**Header (latar biru):**
- Nama aplikasi: KeuanganKu
- Judul: MUTASI REKENING
- Periode transaksi (tanggal awal s/d tanggal akhir)
- Tanggal dan jam cetak

**Info Nasabah:**
- Nama pemilik (username yang login, huruf kapital)
- Jenis akun: Kas Umum
- Total jumlah transaksi

**Tabel Mutasi:**
| Tanggal | Keterangan | Debit (Keluar) | Kredit (Masuk) | Saldo |
|---------|-----------|----------------|----------------|-------|
| SALDO AWAL | | | | Rp 0 |
| … | … | … | … | … (CR/DB) |

- Baris berganti warna (zebra striping) untuk keterbacaan.
- Kolom Debit berwarna merah, Kredit berwarna hijau.
- Saldo berjalan ditampilkan dengan label **CR** (saldo positif) atau **DB** (saldo negatif).

**Ringkasan Bawah (3 kotak):**
- Total Debit (Keluar) — latar merah muda
- Total Kredit (Masuk) — latar hijau muda
- Saldo Akhir — latar biru muda

**Footer:**
- Catatan: "Bukan dokumen resmi perbankan"
- Nama pengguna dan tanggal cetak
- Nomor halaman (otomatis jika data lebih dari satu halaman)

---

## Alur Sistem

```
[Buka Aplikasi]
      │
      ▼
[Cek isLoggedIn]
   │         │
  Tidak      Ya
   │         │
   ▼         ▼
[Login]   [Dashboard]
   │
   ▼
[Input Username & Password]
   │
   ▼
[Validasi ke localStorage 'users']
   │
   ├── Gagal → Tampilkan pesan error
   │
   └── Berhasil → Simpan session → Dashboard
                        │
                        ▼
              [Input Transaksi]
                        │
                        ▼
              [Deteksi Akun Otomatis]
                        │
                        ▼
              [Simpan ke {username}_input_transaksi]
                        │
                        ▼
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
    [Buku Besar]  [Neraca Saldo]  [Laporan]
                                       │
                        ┌──────────────┼──────────┐
                        ▼              ▼          ▼
                  [Laba Rugi]    [Arus Kas] [Perubahan Modal]
                        │
                        ▼
              [Jurnal Penyesuaian]
                        │
                        ▼
              [Histori / Database]
                        │
                        ▼
              [Download PDF Mutasi]
```

---

## Master Akun

Sistem menggunakan daftar akun tetap (Chart of Accounts) yang telah didefinisikan:

### Kelompok Aset (Kode 1xx)
| Kode | Nama Akun | Saldo Normal |
|------|-----------|-------------|
| 101 | Kas | Debit |
| 102 | Kas Bank | Debit |
| 103 | Piutang | Debit |
| 104 | Persediaan | Debit |
| 105 | Peralatan | Debit |

### Kelompok Liabilitas (Kode 2xx)
| Kode | Nama Akun | Saldo Normal |
|------|-----------|-------------|
| 201 | Utang Usaha | Kredit |
| 202 | Utang Bank | Kredit |

### Kelompok Ekuitas (Kode 3xx)
| Kode | Nama Akun | Saldo Normal |
|------|-----------|-------------|
| 301 | Modal | Kredit |
| 302 | Prive | Kredit |
| 303 | Laba Ditahan | Kredit |

### Kelompok Pendapatan (Kode 4xx)
| Kode | Nama Akun | Saldo Normal |
|------|-----------|-------------|
| 401 | Pendapatan | Kredit |
| 402 | Pendapatan Lainnya | Kredit |

### Kelompok Beban (Kode 5xx)
| Kode | Nama Akun | Saldo Normal |
|------|-----------|-------------|
| 501 | Beban Gaji | Debit |
| 502 | Beban Listrik | Debit |
| 503 | Beban Air | Debit |
| 504 | Beban Internet | Debit |
| 505 | Beban Sewa | Debit |

---

## Logika Deteksi Akun Otomatis

Sistem menggunakan **Rule-Based NLP sederhana** untuk mencocokkan keterangan transaksi dengan akun yang tepat.

### Prioritas Deteksi Akun Utama:

```
1. Penjualan Piutang
   → Keterangan mengandung "piutang" + "penjualan/jual"
   → Akun Utama: Piutang

2. Pembelian Aset
   → Keterangan mengandung "beli/membeli/pembelian" + nama aset
   → Akun Utama: Aset yang dibeli

3. Bayar Utang Bank
   → Keterangan mengandung "bayar utang bank"
   → Akun Utama: Utang Bank

4. Bayar Utang Usaha
   → Keterangan mengandung "bayar utang"
   → Akun Utama: Utang Usaha

5. Terima Piutang
   → Keterangan mengandung "bayar piutang/terima piutang/pelunasan piutang"
   → Akun Utama: Piutang

6. Penyesuaian HPP
   → Keterangan mengandung kata kunci HPP
   → Akun Utama: Persediaan / Peralatan

7. Deteksi Umum
   → Cocokkan keterangan dengan field idnama di master akun
   → Prioritas: Pendapatan > Beban > Liabilitas > Ekuitas > Aset
```

### Logika Penentuan Debit/Kredit:

```
Jika akun utama bersaldo normal Debit:
   → Akun Utama = Debit, Akun Lawan = Kredit

Jika akun utama bersaldo normal Kredit:
   → Akun Lawan = Debit, Akun Utama = Kredit

Pengecualian (dibalik):
   → Transaksi pengurangan akun (bayar piutang, bayar utang, pemakaian HPP)
   → Akun Prive dengan kata "kembalikan/setor"
```

---

## Penyimpanan Data

Seluruh data disimpan di **localStorage** browser dengan sistem prefix per pengguna:

| Key localStorage | Isi | Scope |
|-----------------|-----|-------|
| `users` | Array semua akun pengguna | Global |
| `isLoggedIn` | Status sesi login | Global |
| `username` | Username aktif | Global |
| `{user}_input_transaksi` | Array transaksi | Per pengguna |
| `{user}_penyesuaian_hpp` | Array HPP manual | Per pengguna |
| `{user}_total_penyesuaian` | Nilai total HPP | Per pengguna |

> Data bersifat **lokal** dan hanya tersedia di browser yang sama. Membuka aplikasi di browser atau perangkat berbeda tidak akan menampilkan data yang sama.

---

## Cara Menjalankan

Aplikasi ini merupakan **static web app** yang tidak memerlukan server backend maupun instalasi apapun.

### Langkah:
1. Unduh atau clone seluruh file proyek.
2. Pastikan struktur folder sesuai dengan yang tertera di bagian Struktur File.
3. Buka file `index.html` menggunakan browser modern (Chrome, Firefox, Edge).
4. Daftarkan akun baru melalui form Registrasi.
5. Login dan mulai mencatat transaksi.

### Persyaratan Browser:
- Google Chrome 80+
- Mozilla Firefox 75+
- Microsoft Edge 80+
- Safari 13+

### Catatan:
- Pastikan JavaScript tidak diblokir di browser.
- Fitur localStorage harus diaktifkan (default aktif di semua browser modern).
- Koneksi internet diperlukan hanya untuk memuat library CDN (jsPDF, Font Awesome) saat pertama kali membuka aplikasi.

---

## Informasi Pengembang

Aplikasi ini dikembangkan sebagai proyek tugas akhir (skripsi) untuk memenuhi persyaratan kelulusan program studi. Sistem dirancang dengan pendekatan **client-side only** untuk kemudahan deployment dan aksesibilitas bagi UMKM tanpa memerlukan infrastruktur server.

---

*Dokumen README ini dibuat untuk keperluan laporan tugas akhir skripsi.*
