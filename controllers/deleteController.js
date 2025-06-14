const db = require("../config/db"); // Pastikan koneksi db Anda sudah benar

// Menangani penghapusan laporan berdasarkan id_laporan
const deleteLaporan = (req, res) => {
  const laporanId = req.params.id; // Mengambil id_laporan dari parameter URL

  const sql = "DELETE FROM laporan WHERE id_laporan = ?";

  db.query(sql, [laporanId], (err) => {
    if (err) {
      console.error("Error deleting report:", err);
      return res.send("Error deleting report");
    }

    res.redirect("/dashboard"); // Redirect ke halaman dashboard setelah laporan berhasil dihapus
  });
};

module.exports = {
  deleteLaporan,
};
