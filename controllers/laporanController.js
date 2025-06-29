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

      // ✅ Tambahkan riwayat aktivitas
      const insertRiwayat = `
        INSERT INTO riwayat (email, deskripsi_aktivitas, tanggal_aktivitas)
        VALUES (?, ?, ?)
      `;
      const deskripsi_aktivitas = `Membuat laporan (${jenis_laporan} - ${nama_barang})`;
      const tanggal_aktivitas = new Date();

      db.query(
        insertRiwayat,
        [userEmail, deskripsi_aktivitas, tanggal_aktivitas],
        (err2, result2) => {
          if (err2) {
            console.error("Gagal menyimpan riwayat:", err2);
            // UX: Tetap redirect meskipun gagal simpan riwayat
          }

          res.redirect("/dashboard"); // Redirect ke halaman dashboard setelah laporan berhasil disimpan
        }
      );
    }
  );
};

// Tampilkan detail laporan berdasarkan ID
const detailLaporan = (req, res) => {
  const idLaporan = req.params.id;

  const sql = "SELECT * FROM laporan WHERE id_laporan = ?";
  db.query(sql, [idLaporan], (err, results) => {
    if (err) {
      console.error("Gagal mengambil detail laporan:", err);
      return res.status(500).send("Terjadi kesalahan");
    }

    if (results.length === 0) {
      return res.status(404).send("Laporan tidak ditemukan");
    }

    const laporan = results[0];
    res.render("detail-laporan", { laporan });
  });
};

const getLaporan = (req, res) => {
  // logika untuk mengambil data laporan
  res.send("Daftar laporan di sini");
};

module.exports = {
  saveLaporan,
  detailLaporan,
  getLaporan,
};
