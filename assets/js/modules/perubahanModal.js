// ===============================
// LAPORAN PERUBAHAN MODAL
// ===============================
function renderPerubahanModal() {
  const app = document.getElementById("app");
  const data = getInputTransaksi();

  let totalPendapatan = 0;
  let totalBeban = 0;
  let tambahanModal = 0;
  let prive = 0;

  data.forEach(transaksi => {
    const { debit, kredit } = tentukanDebitKredit(transaksi);

    // LABA RUGI
    if (kredit.kategori === "pendapatan") {
      totalPendapatan += transaksi.jumlah;
    }

    if (debit.kategori === "beban") {
      totalBeban += transaksi.jumlah;
    }

    // MODAL BERTAMBAH → Modal di Kredit
    if (kredit.nama === "Modal") {
      tambahanModal += transaksi.jumlah;
    }

    // PRIVE → Prive di Debit
    if (debit.nama === "Prive") {
      prive += transaksi.jumlah;
    }
  });

  const labaBersih = totalPendapatan - totalBeban;
  const modalAkhir = tambahanModal + labaBersih - prive;

  app.innerHTML = `
    <section class="card perubahan-modal-card">
      <h2>Laporan Perubahan Modal</h2>

      <table class="table perubahan-modal-table">
        <tr>
          <td>Modal Awal</td>
          <td class="text-right">${formatRupiah(0)}</td>
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

        <tr>
          <th>Modal Akhir</th>
          <th class="text-right">${formatRupiah(modalAkhir)}</th>
        </tr>
      </table>
    </section>
  `;
}
