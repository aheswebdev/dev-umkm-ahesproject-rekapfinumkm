// =====================================================================
// JURNAL PENYESUAIAN
// -----------------------------------------------------------------------
// PERUBAHAN SESUAI PERMINTAAN:
// 1. Persediaan TIDAK lagi ditampilkan/dihitung di Jurnal Penyesuaian.
//    Data persediaan tetap tercatat di Jurnal Umum, Buku Besar, Neraca
//    Saldo, dll (ditangani di file lain), kecuali di Jurnal Penyesuaian.
// 2. Akun "Perlengkapan" (sebagai akun aset) ditambahkan di AKUN_RULES
//    pada inputTransaksi.js, sehingga otomatis masuk ke Jurnal Umum,
//    Buku Besar, Neraca Saldo, dll. Di sini yang muncul hanyalah AYAT
//    PENYESUAIAN perlengkapan (pemakaiannya), bukan akun mentahnya.
// 3. Jurnal Penyesuaian sekarang berisi 4 jenis penyesuaian akhir bulan:
//    - Penyusutan Peralatan
//    - Penyesuaian Perlengkapan
//    - Penyesuaian Sewa
//    - Penyesuaian Gaji
//
// CATATAN: Kode & nama akun di bawah ini SUDAH DISELARASKAN dengan
// AKUN_RULES di inputTransaksi.js (Beban Gaji 501 & Beban Sewa 505
// dipakai ulang, bukan dibuat baru). Kalau kamu mengubah kode akun di
// inputTransaksi.js, ubah juga di sini agar tetap konsisten.
// =====================================================================

const KONFIGURASI_PENYESUAIAN = {
  peralatan: {
    label: "Penyusutan Peralatan",
    storageKey: "penyesuaian_peralatan",
    kataKunci: ["penyusutan peralatan", "susut peralatan", "depresiasi peralatan"],
    debit: { kode: "507", nama: "Beban Penyusutan Peralatan" },
    kredit: { kode: "108", nama: "Akumulasi Penyusutan Peralatan" }
  },
  perlengkapan: {
    label: "Penyesuaian Perlengkapan",
    storageKey: "penyesuaian_perlengkapan",
    kataKunci: ["penyesuaian perlengkapan", "pemakaian perlengkapan", "perlengkapan terpakai"],
    debit: { kode: "506", nama: "Beban Perlengkapan" },
    kredit: { kode: "106", nama: "Perlengkapan" }
  },
  sewa: {
    label: "Penyesuaian Sewa",
    storageKey: "penyesuaian_sewa",
    kataKunci: ["penyesuaian sewa", "beban sewa", "sewa dibayar dimuka"],
    debit: { kode: "505", nama: "Beban Sewa" },
    kredit: { kode: "107", nama: "Sewa Dibayar Dimuka" }
  },
  gaji: {
    label: "Penyesuaian Gaji",
    storageKey: "penyesuaian_gaji",
    kataKunci: ["penyesuaian gaji", "gaji terutang", "utang gaji"],
    debit: { kode: "501", nama: "Beban Gaji" },
    kredit: { kode: "203", nama: "Utang Gaji" }
  }
};

function renderJurnalPenyesuaianPersediaan() {
  const app = document.getElementById("app");
  const transaksi = getInputTransaksi();

  // ===============================
  // 1. HELPER: COCOK KATA KUNCI
  // ===============================
  function cocokKataKunci(teks, daftarKataKunci) {
    const t = (teks || "").toLowerCase().trim();
    if (!t) return false;
    return daftarKataKunci.some(kata => t.includes(kata));
  }

  // ===============================
  // 2. AMBIL DATA OTOMATIS (DARI JURNAL UMUM) + MANUAL PER JENIS
  // ===============================
  function ambilDataPenyesuaian(jenisKey) {
    const cfg = KONFIGURASI_PENYESUAIAN[jenisKey];

    const otomatis = transaksi
      .filter(t => cocokKataKunci(t.keterangan, cfg.kataKunci))
      .map(t => ({
        id: t.id || ("oto-" + jenisKey + "-" + (t.tanggal || "") + "-" + t.jumlah),
        tanggal: t.tanggal,
        keterangan: t.keterangan,
        total: t.jumlah,
        sumber: "otomatis"
      }));

    const manual = (loadData(cfg.storageKey) || []).map(t => ({
      ...t,
      sumber: "manual"
    }));

    const gabungan = [...otomatis, ...manual];

    // Hapus duplikat berdasarkan id
    const hasil = [];
    const seenIds = new Set();
    gabungan.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        hasil.push(item);
      }
    });
    return hasil;
  }

  const dataPerJenis = {};
  Object.keys(KONFIGURASI_PENYESUAIAN).forEach(key => {
    dataPerJenis[key] = ambilDataPenyesuaian(key);
  });

  // ===============================
  // 2b. DETEKSI OTOMATIS JENIS PENYESUAIAN DARI KETERANGAN
  // ===============================
  // Dipakai oleh form input manual supaya orang tidak perlu memilih
  // jenis penyesuaian sendiri lewat dropdown. Urutan pengecekan dibuat
  // dari kata kunci yang lebih spesifik dulu supaya tidak salah deteksi.
  function deteksiJenisDariKeterangan(teks) {
    const t = (teks || "").toLowerCase().trim();
    if (!t) return null;

    if (t.includes("peralatan")) return "peralatan";
    if (t.includes("perlengkapan")) return "perlengkapan";
    if (t.includes("sewa")) return "sewa";
    if (t.includes("gaji")) return "gaji";
    return null;
  }

  // ===============================
  // 3. RENDER TABEL PER JENIS PENYESUAIAN
  // ===============================
  function renderTabelJenis(jenisKey) {
    const cfg = KONFIGURASI_PENYESUAIAN[jenisKey];
    const data = dataPerJenis[jenisKey];

    let rows = "";
    let total = 0;

    if (data.length === 0) {
      rows = `<tr><td colspan="8" style="text-align:center;">Belum ada data ${cfg.label.toLowerCase()}</td></tr>`;
    } else {
      data.forEach((t, index) => {
        total += t.total;
        const labelSumber = t.sumber === "otomatis" ? "🔄 Otomatis" : "✏️ Manual";
        const tombolHapus = t.sumber === "manual"
          ? `<td rowspan="2" class="delete-cell" onclick="deletePenyesuaian('${jenisKey}','${t.id}')" title="Hapus">🗑️</td>`
          : `<td rowspan="2"></td>`;

        rows += `
          <tr>
            <td rowspan="2">${index + 1}</td>
            <td rowspan="2">${formatTanggal(t.tanggal)}</td>
            <td>${cfg.debit.kode}</td>
            <td rowspan="2">${t.keterangan} <small>(${labelSumber})</small></td>
            <td>${cfg.debit.nama}</td>
            <td class="text-right">${formatRupiah(t.total)}</td>
            <td></td>
            ${tombolHapus}
          </tr>
          <tr>
            <td>${cfg.kredit.kode}</td>
            <td style="padding-left:20px">${cfg.kredit.nama}</td>
            <td></td>
            <td class="text-right">${formatRupiah(t.total)}</td>
          </tr>
        `;
      });
    }

    return { rows, total };
  }

  const tabel = {};
  Object.keys(KONFIGURASI_PENYESUAIAN).forEach(key => {
    tabel[key] = renderTabelJenis(key);
  });

  // ===============================
  // 4. TOTAL PENYESUAIAN
  // ===============================
  const totalPenyesuaian = Object.values(tabel).reduce((sum, t) => sum + t.total, 0);

  // Disimpan dengan key yang sama seperti sebelumnya ("total_penyesuaian")
  // supaya laporan lain (misal Neraca Saldo Setelah Penyesuaian) yang
  // sudah membaca key ini tetap mendapat nilai total terbaru.
  saveData("total_penyesuaian", totalPenyesuaian);

  // ===============================
  // 5. RENDER UI
  // ===============================
  function bagianTabel(jenisKey) {
    const cfg = KONFIGURASI_PENYESUAIAN[jenisKey];
    const hasil = tabel[jenisKey];
    return `
      <section class="cardHPP">
        <h2>Jurnal Penyesuaian - ${cfg.label} <small></small></h2>
        <table class="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Kode</th>
              <th>Keterangan</th>
              <th>Akun</th>
              <th class="text-right">Debit</th>
              <th class="text-right">Kredit</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>${hasil.rows}</tbody>
          <tfoot>
            <tr>
              <th colspan="5" class="text-right">Total ${cfg.label}</th>
              <th colspan="2" class="text-right">${formatRupiah(hasil.total)}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </section>
    `;
  }

  app.innerHTML = `
    <section class="card">
      <div class="dashboard-sesuaikan">
        <h3>Total Penyesuaian</h3>
        <p class="amount">${formatRupiah(totalPenyesuaian)}</p>
        <small style="color: #666;">Penyusutan Peralatan + Perlengkapan + Sewa + Gaji</small>
      </div>
    </section>

    <section class="card">
      <h2>Input Penyesuaian Akhir Bulan</h2>
      <form id="inputPenyesuaianForm" class="form">
        <div class="form-group">
          <label>Tanggal</label>
          <input type="date" id="tanggal" required />
        </div>
        <div class="form-group">
          <label>Keterangan</label>
          <input type="text" id="keterangan" placeholder="Contoh: penyusutan peralatan bulan ini" required />
          <small style="color: #666;">Cukup masukkan kata "peralatan", "perlengkapan", "sewa", atau "gaji" di keterangan — jenis penyesuaian akan terdeteksi otomatis.</small>
        </div>
        <div class="form-group">
          <label>Jumlah (Rp)</label>
          <input type="number" id="jumlah" required />
        </div>
        <button type="submit">Simpan Penyesuaian</button>
      </form>
      <small style="color: #2563eb;">💡 Atau masukkan transaksi biasa di Jurnal Umum dengan kata kunci penyesuaian (misal "penyusutan peralatan", "penyesuaian perlengkapan", "penyesuaian sewa", "penyesuaian gaji") agar otomatis muncul di sini.</small>
    </section>

    ${bagianTabel("peralatan")}
    ${bagianTabel("perlengkapan")}
    ${bagianTabel("sewa")}
    ${bagianTabel("gaji")}
  `;

  // ===============================
  // 6. EVENT SUBMIT FORM PENYESUAIAN MANUAL
  // ===============================
  const form = document.getElementById("inputPenyesuaianForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value.trim();
    const jumlah = Number(document.getElementById("jumlah").value);

    if (!tanggal || !keterangan || !jumlah) return;

    const jenisKey = deteksiJenisDariKeterangan(keterangan);
    if (!jenisKey) {
      alert("Keterangan harus mengandung kata 'peralatan', 'perlengkapan', 'sewa', atau 'gaji' supaya jenis penyesuaian bisa terdeteksi otomatis.");
      return;
    }

    const cfg = KONFIGURASI_PENYESUAIAN[jenisKey];

    const yakin = confirm(
      "Yakin ingin menyimpan penyesuaian ini?\n\n" +
      "Jenis : " + cfg.label + "\n" +
      "Tanggal : " + formatTanggal(tanggal) + "\n" +
      "Keterangan : " + keterangan + "\n" +
      "Jumlah : " + formatRupiah(jumlah)
    );
    if (!yakin) return;

    const data = loadData(cfg.storageKey) || [];
    data.push({
      id: Date.now() + Math.random(),
      tanggal,
      keterangan,
      total: jumlah
    });
    saveData(cfg.storageKey, data);

    form.reset();
    renderJurnalPenyesuaianPersediaan();
  });
}

// ===============================
// FUNGSI HAPUS PENYESUAIAN MANUAL
// ===============================
function deletePenyesuaian(jenisKey, id) {
  const cfg = KONFIGURASI_PENYESUAIAN[jenisKey];
  if (!cfg) return;

  let data = loadData(cfg.storageKey) || [];
  const item = data.find(d => d.id == id);

  if (!item) {
    alert("Data penyesuaian otomatis dari transaksi tidak bisa dihapus di sini. Hapus transaksi aslinya di Jurnal Umum.");
    return;
  }

  const yakin = confirm(
    "Yakin ingin menghapus data penyesuaian ini?\n\n" +
    "Jenis : " + cfg.label + "\n" +
    "Tanggal : " + formatTanggal(item.tanggal) + "\n" +
    "Keterangan : " + item.keterangan
  );
  if (!yakin) return;

  const filtered = data.filter(d => d.id != id);
  saveData(cfg.storageKey, filtered);
  renderJurnalPenyesuaianPersediaan();
}
