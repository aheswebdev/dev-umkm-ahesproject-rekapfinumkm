function renderDatabase() {
  const app = document.getElementById("app");
  const transaksi = getInputTransaksi(); // ⬅️ SUMBER DATA YANG BENAR

  if (transaksi.length === 0) {
    app.innerHTML = `
      <section class="card">
        <h2>Database Transaksi</h2>
        <p>Belum ada data transaksi.</p>
      </section>
    `;
    return;
  }

  let rows = "";

  transaksi.forEach((t, index) => {
    const { debit, kredit } = tentukanDebitKredit(t);

    rows += `
      <tr>
        <td rowspan="2">${index + 1}</td>
        <td rowspan="2">${formatTanggal(t.tanggal)}</td>
        <td>${debit.kode}</td>
        <td rowspan="2">${t.keterangan}</td>
        <td>${capitalize(debit.nama)}</td>
        <td class="text-right">${formatRupiah(t.jumlah)}</td>
        <td></td>
        <td rowspan="2" class="delete-cell"
            onclick="deleteDatabaseTransaksi('${t.id}')"
            title="Hapus">
          🗑️
        </td>
      </tr>
      <tr>
        <td>${kredit.kode}</td>
        <td style="padding-left:20px">${capitalize(kredit.nama)}</td>
        <td></td>
        <td class="text-right">${formatRupiah(t.jumlah)}</td>
      </tr>
    `;
  });

  app.innerHTML = `
    <section class="cardDatabase">
      <h2>Database Transaksi</h2>
      
      <div class="database-actions">
        <button class="btn-delete-all" onclick="deleteAllDatabaseTransaksi()">
          🗑️ Hapus Semua Transaksi
        </button>
        <button class="btn-download" onclick="downloadDatabasePDF()">
          📄 Download PDF
        </button>
      </div>

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
        <tbody>
          ${rows}
        </tbody>
      </table>
    </section>
  `;
}

// ===============================
// DOWNLOAD PDF - GAYA MUTASI BANK
// ===============================
function downloadDatabasePDF() {
  const transaksi = getInputTransaksi();
  if (transaksi.length === 0) {
    alert("Tidak ada data untuk di-download.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const username = localStorage.getItem("username") || "Nasabah";
  const now = new Date();
  const tanggalCetak = now.toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });
  const jamCetak = now.toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit" });

  // Sort transaksi berdasarkan tanggal
  const sorted = [...transaksi].sort((a, b) => {
    const da = new Date(a.tanggal), db = new Date(b.tanggal);
    return da - db || Number(a.id.split("-")[1]) - Number(b.id.split("-")[1]);
  });

  // Hitung periode
  const tglAwal = formatTanggal(sorted[0].tanggal);
  const tglAkhir = formatTanggal(sorted[sorted.length - 1].tanggal);

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── HEADER BIRU ──────────────────────────────
  doc.setFillColor(0, 48, 135);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("KeuanganKu", margin, 13);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 200, 255);
  doc.text("Aplikasi Keuangan UMKM", margin, 19);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("MUTASI REKENING", pageW - margin, 13, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 200, 255);
  doc.text("Periode: " + tglAwal + " s/d " + tglAkhir, pageW - margin, 19, { align: "right" });
  doc.text("Dicetak: " + tanggalCetak + ", " + jamCetak, pageW - margin, 24, { align: "right" });

  // ── INFO NASABAH ─────────────────────────────
  let y = 36;
  doc.setFillColor(240, 245, 255);
  doc.setDrawColor(180, 200, 240);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 3, 3, "FD");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 120);
  doc.text("NAMA PEMILIK", margin + 4, y + 6);
  doc.text("JENIS AKUN", pageW / 2 - 10, y + 6);
  doc.text("TOTAL TRANSAKSI", pageW - margin - 4, y + 6, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 48, 135);
  doc.text(username.toUpperCase(), margin + 4, y + 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text("Kas Umum", pageW / 2 - 10, y + 15);
  doc.text(transaksi.length + " transaksi", pageW - margin - 4, y + 15, { align: "right" });

  // ── TABEL MUTASI ─────────────────────────────
  y = 64;
  let saldoBerjalan = 0;
  let totalDebit = 0;
  let totalKredit = 0;

  const tableRows = [];

  // Baris saldo awal
  tableRows.push([
    { content: "SALDO AWAL", colSpan: 4, styles: { fontStyle: "bold", fillColor: [232, 244, 253], textColor: [0, 48, 135] } },
    { content: "Rp 0", styles: { fontStyle: "bold", fillColor: [232, 244, 253], textColor: [26, 92, 46], halign: "right" } }
  ]);

  sorted.forEach((t, i) => {
    const { debit, kredit } = tentukanDebitKredit(t);
    const kasDebit = debit.nama === "Kas";
    const kasKredit = kredit.nama === "Kas";

    let mutasiDebit = "";
    let mutasiKredit = "";

    if (kasDebit) {
      mutasiKredit = formatRupiah(t.jumlah);
      saldoBerjalan += t.jumlah;
      totalKredit += t.jumlah;
    } else {
      mutasiDebit = formatRupiah(t.jumlah);
      saldoBerjalan -= t.jumlah;
      totalDebit += t.jumlah;
    }

    const saldoLabel = formatRupiah(Math.abs(saldoBerjalan)) + (saldoBerjalan < 0 ? " DB" : " CR");
    const saldoColor = saldoBerjalan >= 0 ? [26, 92, 46] : [192, 57, 43];
    const rowBg = i % 2 === 0 ? [255, 255, 255] : [249, 250, 251];

    tableRows.push([
      { content: formatTanggal(t.tanggal), styles: { fillColor: rowBg } },
      { content: capitalize(t.keterangan), styles: { fillColor: rowBg } },
      { content: mutasiDebit, styles: { halign: "right", textColor: mutasiDebit ? [192, 57, 43] : [150,150,150], fillColor: rowBg } },
      { content: mutasiKredit, styles: { halign: "right", textColor: mutasiKredit ? [26, 92, 46] : [150,150,150], fillColor: rowBg } },
      { content: saldoLabel, styles: { halign: "right", fontStyle: "bold", textColor: saldoColor, fillColor: rowBg } }
    ]);
  });

  doc.autoTable({
    startY: y,
    head: [[
      { content: "Tanggal", styles: { halign: "left" } },
      { content: "Keterangan", styles: { halign: "left" } },
      { content: "Debit (Keluar)", styles: { halign: "right" } },
      { content: "Kredit (Masuk)", styles: { halign: "right" } },
      { content: "Saldo", styles: { halign: "right" } }
    ]],
    body: tableRows,
    headStyles: {
      fillColor: [0, 48, 135],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: { top: 4, right: 5, bottom: 4, left: 5 }
    },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 36 },
      3: { cellWidth: 36 },
      4: { cellWidth: 38 }
    },
    margin: { left: margin, right: margin },
    tableLineColor: [210, 215, 225],
    tableLineWidth: 0.2,
    didDrawPage: function(data) {
      // Footer tiap halaman
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Halaman " + doc.internal.getCurrentPageInfo().pageNumber + " dari " + pageCount,
        pageW - margin, pageH - 8, { align: "right" }
      );
      doc.text("Dokumen otomatis - bukan dokumen resmi perbankan", margin, pageH - 8);
    }
  });

  // ── RINGKASAN SALDO ───────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;

  // Cek apakah ringkasan muat di halaman ini
  if (finalY + 28 > pageH - 15) {
    doc.addPage();
  }

  const boxY = doc.lastAutoTable.finalY + 8;
  const boxW = (pageW - margin * 2 - 8) / 3;

  // Kotak Debit
  doc.setFillColor(255, 245, 245);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, boxY, boxW, 22, 2, 2, "FD");
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(100,100,100);
  doc.text("TOTAL DEBIT (KELUAR)", margin + 4, boxY + 7);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(192, 57, 43);
  doc.text(formatRupiah(totalDebit), margin + 4, boxY + 16);

  // Kotak Kredit
  const box2X = margin + boxW + 4;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(box2X, boxY, boxW, 22, 2, 2, "FD");
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(100,100,100);
  doc.text("TOTAL KREDIT (MASUK)", box2X + 4, boxY + 7);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(26, 92, 46);
  doc.text(formatRupiah(totalKredit), box2X + 4, boxY + 16);

  // Kotak Saldo Akhir
  const box3X = margin + (boxW + 4) * 2;
  doc.setFillColor(240, 245, 255);
  doc.setDrawColor(180, 200, 240);
  doc.roundedRect(box3X, boxY, boxW, 22, 2, 2, "FD");
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(100,100,100);
  doc.text("SALDO AKHIR", box3X + 4, boxY + 7);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 48, 135);
  doc.text(formatRupiah(Math.abs(saldoBerjalan)), box3X + 4, boxY + 16);

  // ── GARIS + FOOTER ───────────────────────────
  const footerY = boxY + 28;
  doc.setDrawColor(0, 48, 135);
  doc.setLineWidth(0.8);
  doc.line(margin, footerY, pageW - margin, footerY);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("Dokumen ini dicetak secara otomatis oleh Aplikasi Keuangan UMKM. Bukan dokumen resmi perbankan.", margin, footerY + 6);
  doc.text(username.toUpperCase() + " — " + tanggalCetak, pageW - margin, footerY + 6, { align: "right" });

  // ── SAVE ─────────────────────────────────────
  doc.save("mutasi_" + username + "_" + now.toISOString().slice(0, 10) + ".pdf");
}
// ===============================
// FUNGSI LAINNYA (SAMA SEPERTI SEBELUMNYA)
// ===============================

// ===== Variabel global =====
let transaksiYangDihapus = null;
let modeDelete = "single"; // "single" | "all"

function deleteDatabaseTransaksi(id) {
  const data = getInputTransaksi();
  const transaksi = data.find(t => t.id === id);
  if (!transaksi) return;

  const yakin = confirm(
    "Yakin ingin menghapus transaksi ini?\n\n" +
    "Tanggal : " + formatTanggal(transaksi.tanggal) + "\n" +
    "Keterangan : " + transaksi.keterangan + "\n" +
    "Jumlah : Rp " + transaksi.jumlah.toLocaleString("id-ID")
  );

  if (!yakin) return;

  mintaPassword(transaksi);
}

function mintaPassword(transaksi) {
  modeDelete = "single";
  transaksiYangDihapus = transaksi;

  document.getElementById("passwordInput").value = "";
  document.getElementById("passwordModal").classList.remove("hidden");
  document.getElementById("passwordInput").focus();
}

function batalPassword() {
  transaksiYangDihapus = null;
  modeDelete = "single";
  document.getElementById("passwordModal").classList.add("hidden");
}

function submitPassword() {
  const password = document.getElementById("passwordInput").value;

  if (password !== "Esya69") {
    alert("❌ Password salah. Data tidak dihapus.");
    return;
  }

  // Proses hapus sesuai mode
  if (modeDelete === "single") {
    const data = getInputTransaksi();
    const filtered = data.filter(t => t.id !== transaksiYangDihapus.id);
    localStorage.setItem("input_transaksi", JSON.stringify(filtered));
    alert("✅ Transaksi berhasil dihapus.");
  } else if (modeDelete === "all") {
    localStorage.setItem("input_transaksi", JSON.stringify([]));
    alert("🔥 Semua transaksi berhasil dihapus.");
  }

  // Tutup modal dan refresh tampilan
  batalPassword();
  renderDatabase();
}

function deleteAllDatabaseTransaksi() {
  const data = getInputTransaksi();
  if (data.length === 0) return;

  const yakin = confirm(
    "⚠️ PERINGATAN!\n\n" +
    "Anda akan menghapus SEMUA transaksi.\n" +
    "Jumlah data: " + data.length + "\n\n" +
    "Tindakan ini tidak dapat dibatalkan.\n\n" +
    "Lanjutkan?"
  );

  if (!yakin) return;

  modeDelete = "all";
  transaksiYangDihapus = null;
  document.getElementById("passwordInput").value = "";
  document.getElementById("passwordModal").classList.remove("hidden");
  document.getElementById("passwordInput").focus();
}