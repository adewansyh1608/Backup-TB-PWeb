const db = require("../config/db");

const saveLaporan = (req, res) => {
  const { jenis_laporan, nama_barang, lokasi, tanggal_kejadian, deskripsi } =
    req.body;
  const foto_barang = req.file ? "uploads/" + req.file.filename : null;
  const status = "Waiting for upload verification";
  const userEmail = req.session.user.email;

  const nama_penemu_penerima = null;
  const nohp_penemu_penerima = null;
  const tanggal_penyerahan = null;
  const foto_bukti = null;

  // Menambahkan tanggal saat ini untuk kolom tanggal_laporan dalam format YYYY-MM-DD
  const tanggal_laporan = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  const sql = `
    INSERT INTO laporan (jenis_laporan, nama_barang, lokasi, tanggal_kejadian, deskripsi, foto_barang, status, email,
                         nama_penemu_penerima, nohp_penemu_penerima, tanggal_penyerahan, foto_bukti, tanggal_laporan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      status,
      userEmail,
      nama_penemu_penerima,
      nohp_penemu_penerima,
      tanggal_penyerahan,
      foto_bukti,
      tanggal_laporan, // Menyimpan tanggal laporan saat ini
    ],
    (err) => {
      if (err) {
        console.error("Error during report submission:", err);
        return res.send("Error submitting report.");
      }
      res.redirect("/dashboard"); // Redirect ke halaman dashboard setelah laporan berhasil disimpan
    }
  );
};

module.exports = { saveLaporan };
