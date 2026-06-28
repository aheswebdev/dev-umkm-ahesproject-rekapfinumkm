function renderJurnalPenyesuaianPersediaan() {
  const app = document.getElementById("app");
  const transaksi = getInputTransaksi();

  // ===============================
  // 1. DATA OTOMATIS DARI TRANSAKSI
  // ===============================

  // Filter transaksi persediaan
  const dataPersediaan = transaksi.filter(t => {
    const { debit, kredit } = tentukanDebitKredit(t);
    return (
      debit.nama.toLowerCase() === "persediaan" ||
      kredit.nama.toLowerCase() === "persediaan"
    );
  });

  // Filter transaksi peralatan
  const dataPeralatan = transaksi.filter(t => {
    const { debit, kredit } = tentukanDebitKredit(t);
    return (
      debit.nama.toLowerCase() === "peralatan" ||
      kredit.nama.toLowerCase() === "peralatan"
    );
  });

  // Filter transaksi HPP (otomatis dari kata kunci di keterangan)
  // Dibuat lebih stabil:
  // - Tidak error kalau t.keterangan kosong/undefined
  // - Trim spasi & lowercase supaya "  Pemakaian Persediaan " tetap kedeteksi
  // - Daftar kata kunci diperluas supaya berbagai variasi penulisan tetap kena
  const KATA_KUNCI_HPP_OTOMATIS = [
    "hpp",
    "harga pokok penjualan",
    "pemakaian",
    "pakai persediaan",
    "penyusutan",
    "depresiasi",
    "susut"
  ];

  function cocokKataKunciHPP(teks) {
    const t = (teks || "").toLowerCase().trim();
    if (!t) return false;
    return KATA_KUNCI_HPP_OTOMATIS.some(kata => t.includes(kata));
  }

  const dataHPPOtomatis = transaksi.filter(t => cocokKataKunciHPP(t.keterangan));

  // Data HPP manual dari localStorage (tetap dipertahankan untuk kompatibilitas)
  const dataHPPManual = JSON.parse(
    localStorage.getItem("penyesuaian_hpp") || "[]"
  );

  // Gabungkan data HPP otomatis + manual
  const dataHPPGabungan = [
    ...dataHPPOtomatis.map(t => ({
      id: t.id || Date.now() + Math.random(),
      tanggal: t.tanggal,
      keterangan: t.keterangan,
      total: t.jumlah,
      akunTarget: t.akunTarget || "Persediaan",
      sumber: "otomatis"
    })),
    ...dataHPPManual.map(t => ({
      ...t,
      sumber: "manual"
    }))
  ];

  // Hapus duplikat berdasarkan id
  const dataHPP = [];
  const seenIds = new Set();
  dataHPPGabungan.forEach(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      dataHPP.push(item);
    }
  });

  // ===============================
  // 2. RENDER TABEL PERSEDIAAN
  // ===============================
  let rowsPersediaan = "";
  let totalPersediaan = 0;

  if (dataPersediaan.length === 0) {
    rowsPersediaan = `<tr><td colspan="7" style="text-align:center;">Belum ada data persediaan</td></tr>`;
  } else {
    dataPersediaan.forEach((t, index) => {
      const { debit, kredit } = tentukanDebitKredit(t);

      if (debit.nama.toLowerCase() === "persediaan") {
        totalPersediaan += t.jumlah;
      }
      if (kredit.nama.toLowerCase() === "persediaan") {
        totalPersediaan -= t.jumlah;
      }

      rowsPersediaan += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>${debit.kode}</td>
          <td rowspan="2">${t.keterangan}</td>
          <td>${capitalize(debit.nama)}</td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
          <td></td>
        </tr>
        <tr>
          <td>${kredit.kode}</td>
          <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 3. RENDER TABEL PERALATAN
  // ===============================
  let rowsPeralatan = "";
  let totalPeralatan = 0;

  if (dataPeralatan.length === 0) {
    rowsPeralatan = `<tr><td colspan="7" style="text-align:center;">Belum ada data peralatan</td></tr>`;
  } else {
    dataPeralatan.forEach((t, index) => {
      const { debit, kredit } = tentukanDebitKredit(t);

      if (debit.nama.toLowerCase() === "peralatan") {
        totalPeralatan += t.jumlah;
      }
      if (kredit.nama.toLowerCase() === "peralatan") {
        totalPeralatan -= t.jumlah;
      }

      rowsPeralatan += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>${debit.kode}</td>
          <td rowspan="2">${t.keterangan}</td>
          <td>${capitalize(debit.nama)}</td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
          <td></td>
        </tr>
        <tr>
          <td>${kredit.kode}</td>
          <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.jumlah)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 4. RENDER TABEL HPP BULANAN (OTOMATIS + MANUAL)
  // ===============================
  let rowsInputHPP = "";
  if (dataHPP.length === 0) {
    rowsInputHPP = `<tr><td colspan="8" style="text-align:center;">Belum ada penyesuaian HPP</td></tr>`;
  } else {
    dataHPP.forEach((t, index) => {
      const akunTarget = t.akunTarget || "Persediaan";
      const kodeAkun = akunTarget === "Peralatan" ? "105" : "113";
      const labelSumber = t.sumber === "otomatis" ? "🔄 Otomatis" : "✏️ Manual";
      rowsInputHPP += `
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${formatTanggal(t.tanggal)}</td>
          <td>511</td>
          <td rowspan="2">${t.keterangan} <small>(${labelSumber})</small></td>
          <td>Harga Pokok Penjualan</td>
          <td class="text-right">${formatRupiah(t.total)}</td>
          <td></td>
          <td rowspan="2" class="delete-cell"
            onclick="deleteInputHPP('${t.id}')"
            title="Hapus">
            🗑️
          </td>
        </tr>
        <tr>
          <td>${kodeAkun}</td>
          <td style="padding-left:20px">${akunTarget}</td>
          <td></td>
          <td class="text-right">${formatRupiah(t.total)}</td>
        </tr>
      `;
    });
  }

  // ===============================
  // 5. HITUNG TOTAL
  // ===============================
  const totalAset = totalPeralatan + totalPersediaan;
  const totalHPP = dataHPP.reduce((sum, item) => sum + item.total, 0);
  const totalPenyesuaian = totalHPP; // sesuai screenshot

  // Simpan total penyesuaian untuk Laba Rugi
  localStorage.setItem("total_penyesuaian", JSON.stringify(totalAset - totalHPP));

  // ===============================
  // 6. RENDER UI
  // ===============================
  app.innerHTML = `
    <section class="card">
      <div class="dashboard-sesuaikan">
        <h3>Total Penyesuaian</h3>
        <p class="amount">${formatRupiah(totalPenyesuaian)}</p>
        <small style="color: #666;">Total HPP</small>
      </div>
    </section>

    <section class="card">
      <h2>Input HPP Manual</h2>
      <form id="inputTransaksiForm" class="form">
        <div class="form-group">
          <label>Tanggal</label>
          <input type="date" id="tanggal" required />
        </div>
        <div class="form-group">
          <label>Keterangan</label>
          <input type="text" id="keterangan" placeholder="Contoh: pemakaian persediaan 1 bulan" required />
          <small style="color: #666;">Masukkan kata "persediaan" atau "peralatan" untuk menentukan akun target.</small>
        </div>
        <div class="form-group">
          <label>Jumlah (Rp)</label>
          <input type="number" id="jumlah" required />
        </div>
        <button type="submit">Simpan HPP Manual</button>
      </form>
      <small style="color: #2563eb;">💡 Atau masukkan transaksi biasa dengan kata "HPP" atau "pemakaian" di keterangan untuk otomatis.</small>
    </section>

    <section class="cardHPP">
      <h2>Jurnal Penyesuaian - Persediaan <small></small></h2>
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
          </tr>
        </thead>
        <tbody>${rowsPersediaan}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total Persediaan</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalPersediaan)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="cardHPP">
      <h2>Jurnal Penyesuaian - Peralatan <small></small></h2>
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
          </tr>
        </thead>
        <tbody>${rowsPeralatan}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total Peralatan</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalPeralatan)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="cardTotalAset">
      <h3>Total Aset (Persediaan + Peralatan)</h3>
      <p class="amount">${formatRupiah(totalAset)}</p>
    </section>

    <section class="cardHPP">
      <h2>Penyesuaian HPP Bulanan <small></small></h2>
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
        <tbody>${rowsInputHPP}</tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-right">Total HPP</th>
            <th colspan="2" class="text-right">
              ${formatRupiah(totalHPP)}
            </th>
          </tr>
        </tfoot>
      </table>
    </section>
  `;

  // ===============================
  // 7. EVENT SUBMIT FORM HPP MANUAL
  // ===============================
  const form = document.getElementById("inputTransaksiForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value.trim();
    const jumlah = Number(document.getElementById("jumlah").value);

    if (!tanggal || !keterangan || !jumlah) return;

    // Deteksi akun target dari keterangan
    const text = keterangan.toLowerCase();
    let akunTarget = "Persediaan";
    if (text.includes("peralatan")) {
      akunTarget = "Peralatan";
    } else if (text.includes("persediaan")) {
      akunTarget = "Persediaan";
    } else {
      alert("Keterangan harus mengandung kata 'persediaan' atau 'peralatan' untuk menentukan akun yang dikurangi.");
      return;
    }

    const yakin = confirm(
      "Yakin ingin menyimpan HPP manual ini?\n\n" +
      "Tanggal : " + formatTanggal(tanggal) + "\n" +
      "Keterangan : " + keterangan + "\n" +
      "Akun Target : " + akunTarget + "\n" +
      "Jumlah : " + formatRupiah(jumlah)
    );
    if (!yakin) return;

    const dataHPP = JSON.parse(
      localStorage.getItem("penyesuaian_hpp") || "[]"
    );

    dataHPP.push({
      id: Date.now() + Math.random(),
      tanggal,
      keterangan,
      total: jumlah,
      akunTarget,
      sumber: "manual"
    });

    localStorage.setItem("penyesuaian_hpp", JSON.stringify(dataHPP));

    form.reset();
    renderJurnalPenyesuaianPersediaan();
  });
}

// ===============================
// FUNGSI HAPUS HPP
// ===============================
function deleteInputHPP(id) {
  // Coba hapus dari data manual dulu
  let dataHPP = JSON.parse(
    localStorage.getItem("penyesuaian_hpp") || "[]"
  );

  const manualItem = dataHPP.find(d => d.id == id);
  if (manualItem) {
    const yakin = confirm(
      "Yakin ingin menghapus data HPP manual ini?\n\n" +
      "Tanggal : " + formatTanggal(manualItem.tanggal) + "\n" +
      "Keterangan : " + manualItem.keterangan
    );
    if (!yakin) return;

    const filtered = dataHPP.filter(d => d.id != id);
    localStorage.setItem("penyesuaian_hpp", JSON.stringify(filtered));
    renderJurnalPenyesuaianPersediaan();
    return;
  }

  // Jika tidak ditemukan di manual, mungkin data otomatis dari transaksi
  alert("Data HPP otomatis dari transaksi tidak bisa dihapus. Hapus transaksi aslinya di Jurnal Umum.");
}