const db = require("../config/db"); // Pastikan koneksi db Anda sudah benar

// Menampilkan form edit laporan dengan data yang sudah terisi
const showEditForm = (req, res) => {
  const laporanId = req.params.id; // Mengambil id dari parameter URL
  const sql = "SELECT * FROM laporan WHERE id_laporan = ?"; // Ubah 'id' menjadi 'id_laporan'

  db.query(sql, [laporanId], (err, result) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.send("Error fetching report");
    }

    const report = result[0];
    if (!report) {
      return res.send("Report not found");
    }

    res.render("edit-form", { report });
  });
};

const saveEditLaporan = (req, res) => {
  const laporanId = req.params.id;
  console.log("Laporan ID yang diterima:", laporanId);
  console.log("Form Data:", req.body); // Cek data yang dikirimkan

  // Ambil data laporan yang ada di database berdasarkan ID
  const sql = "SELECT * FROM laporan WHERE id_laporan = ?";

  db.query(sql, [laporanId], (err, result) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.send("Error fetching report");
    }

    const report = result[0];
    if (!report) {
      return res.send("Report not found");
    }

    // Ambil data yang dikirimkan dari form
    const {
      jenis_laporan,
      nama_barang,
      lokasi,
      tanggal_kejadian,
      deskripsi,
      existing_foto_barang,
    } = req.body;

    // Cek apakah ada foto baru yang diupload
    const foto_barang = req.file
      ? "uploads/" + req.file.filename // Ganti dengan foto yang baru diupload
      : existing_foto_barang; // Tetap pakai foto lama jika tidak ada file yang diupload

    console.log("Foto barang yang akan disimpan:", foto_barang); // Debugging foto yang diupload

    // Ambil data lainnya yang tidak berubah
    const {
      email,
      nama_penemu_penerima,
      nohp_penemu_penerima,
      tanggal_penyerahan,
      foto_bukti,
      tanggal_laporan,
      status,
    } = report;

    // Update data laporan dengan data yang diubah
    const sqlUpdate = `
      UPDATE laporan
      SET jenis_laporan = ?, nama_barang = ?, lokasi = ?, tanggal_kejadian = ?, deskripsi = ?, foto_barang = ?, status = ?
      WHERE id_laporan = ?`;

    db.query(
      sqlUpdate,
      [
        jenis_laporan || report.jenis_laporan,
        nama_barang || report.nama_barang,
        lokasi || report.lokasi,
        tanggal_kejadian || report.tanggal_kejadian,
        deskripsi || report.deskripsi,
        foto_barang, // Simpan foto yang sesuai
        "Waiting for upload verification", // Update status menjadi 'Waiting for upload verification'
        laporanId,
      ],
      (err) => {
        if (err) {
          console.error("Error updating report:", err);
          return res.send("Error updating report");
        }

        // Update data lainnya yang tidak berubah
        const sqlUpdateOtherData = `
          UPDATE laporan
          SET email = ?, nama_penemu_penerima = ?, nohp_penemu_penerima = ?, tanggal_penyerahan = ?, foto_bukti = ?, tanggal_laporan = ?
          WHERE id_laporan = ?`;

        db.query(
          sqlUpdateOtherData,
          [
            email,
            nama_penemu_penerima,
            nohp_penemu_penerima,
            tanggal_penyerahan,
            foto_bukti,
            tanggal_laporan,
            laporanId,
          ],
          (err) => {
            if (err) {
              console.error("Error updating other fields:", err);
              return res.send("Error updating other fields");
            }

            res.redirect("/dashboard"); // Redirect setelah berhasil update
          }
        );
      }
    );
  });
};

module.exports = {
  showEditForm,
  saveEditLaporan,
};
