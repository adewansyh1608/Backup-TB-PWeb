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

// Menyimpan perubahan laporan setelah form di-submit
const saveEditLaporan = (req, res) => {
  console.log("req.body:", req.body); // Cek apakah data ada di sini
  console.log("req.file:", req.file); // Cek apakah file ada di sini

  const laporanId = req.params.id;
  const { jenis_laporan, nama_barang, lokasi, tanggal_kejadian, deskripsi } =
    req.body;
  const foto_barang = req.file ? "uploads/" + req.file.filename : null;

  const sql = `
    UPDATE laporan
    SET jenis_laporan = ?, nama_barang = ?, lokasi = ?, tanggal_kejadian = ?, deskripsi = ?, foto_barang = ?
    WHERE id_laporan = ?
  `;

  db.query(
    sql,
    [
      jenis_laporan,
      nama_barang,
      lokasi,
      tanggal_kejadian,
      deskripsi,
      foto_barang,
      laporanId,
    ],
    (err) => {
      if (err) {
        console.error("Error updating report:", err);
        return res.send("Error updating report");
      }

      res.redirect("/dashboard"); // Redirect ke halaman dashboard setelah laporan berhasil diperbarui
    }
  );
};
module.exports = {
  showEditForm,
  saveEditLaporan,
};
