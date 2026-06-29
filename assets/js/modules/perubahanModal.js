// ===============================
// LAPORAN PERUBAHAN MODAL
// ===============================
function renderPerubahanModal() {
  const app = document.getElementById("app");
  const data = getInputTransaksi();

  let totalPendapatan = 0;
  let totalBeban = 0;
  let modalAwal = 0;
  let tambahanModal = 0;
  let prive = 0;

  // Kata kunci keterangan yang dianggap sebagai Modal Awal
  const KATA_KUNCI_MODAL_AWAL = [
    "modal awal", "setoran awal", "modal pertama",
    "investasi awal", "modal dasar"
  ];

  // Kata kunci keterangan yang dianggap sebagai Tambahan Modal
  const KATA_KUNCI_TAMBAHAN_MODAL = [
    "tambahan modal", "setoran modal", "tambah modal",
    "penambahan modal", "investasi tambahan"
  ];

  function cocokKataKunci(keterangan, daftarKataKunci) {
    const k = (keterangan || "").toLowerCase().trim();
    return daftarKataKunci.some(kata => k.includes(kata));
  }

  data.forEach(transaksi => {
    const { debit, kredit } = tentukanDebitKredit(transaksi);
    const keterangan = (transaksi.keterangan || "").toLowerCase().trim();

    // PENDAPATAN
    if (kredit.kategori === "pendapatan") {
      totalPendapatan += transaksi.jumlah;
    }

    // BEBAN
    if (debit.kategori === "beban") {
      totalBeban += transaksi.jumlah;
    }

    // MODAL → cek apakah akun kredit adalah akun Modal
    const isAkunModal =
      kredit.nama === "Modal" ||
      (kredit.nama || "").toLowerCase().includes("modal") ||
      kredit.kode === "301" ||
      kredit.kategori === "modal";

    if (isAkunModal) {
      if (cocokKataKunci(transaksi.keterangan, KATA_KUNCI_MODAL_AWAL)) {
        // Keterangan eksplisit "modal awal" → Modal Awal
        modalAwal += transaksi.jumlah;
      } else if (cocokKataKunci(transaksi.keterangan, KATA_KUNCI_TAMBAHAN_MODAL)) {
        // Keterangan eksplisit "tambahan modal" → Tambahan Modal
        tambahanModal += transaksi.jumlah;
      } else {
        // Tidak ada kata kunci eksplisit → masuk Tambahan Modal
        tambahanModal += transaksi.jumlah;
      }
    }

    // PRIVE → akun Prive di Debit
    const isAkunPrive =
      debit.nama === "Prive" ||
      (debit.nama || "").toLowerCase().includes("prive");

    if (isAkunPrive) {
      prive += transaksi.jumlah;
    }
  });

  const labaBersih = totalPendapatan - totalBeban;
  const modalAkhir = modalAwal + tambahanModal + labaBersih - prive;

  app.innerHTML = `
    <section class="card perubahan-modal-card">
      <h2>Laporan Perubahan Modal</h2>

      <table class="table perubahan-modal-table">
        <tr>
          <td>Modal Awal</td>
          <td class="text-right">${formatRupiah(modalAwal)}</td>
        </tr>

        <tr>
          <td>Tambahan Modal</td>
          <td class="text-right">${formatRupiah(tambahanModal)}</td>
        </tr>

        <tr>
          <td>Laba Bersih</td>
          <td class="text-right">${formatRupiah(labaBersih)}</td>
        </tr>

        <tr>
          <td>Prive</td>
          <td class="text-right">(${formatRupiah(prive)})</td>
        </tr>

        <tr class="modal-akhir-row">
          <th>Modal Akhir</th>
          <th class="text-right">${formatRupiah(modalAkhir)}</th>
        </tr>
      </table>

      <small style="color:#666; display:block; margin-top:12px;">
        💡 Untuk mengisi Modal Awal: input transaksi di Jurnal Umum dengan keterangan mengandung kata
        <strong>"modal awal"</strong> dan akun Modal (kode 301) di sisi kredit.
      </small>
    </section>
  `;
}
