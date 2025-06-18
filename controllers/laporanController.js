const db = require("../config/db");

// Simpan laporan baru
const saveLaporan = (req, res) => {
  const {
    jenis_laporan,
    nama_barang,
    lokasi,
    tanggal_kejadian,
    deskripsi,
  } = req.body;

  const foto_barang = req.file ? "uploads/" + req.file.filename : null;
  const status = "Waiting for upload verification";
  const userEmail = req.session.user.email;

  const nama_penemu_penerima = null;
  const nohp_penemu_penerima = null;
  const tanggal_penyerahan = null;
  const foto_bukti = null;
  const tanggal_laporan = new Date().toISOString().slice(0, 10);

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
      tanggal_laporan,
    ],
    (err) => {
      if (err) {
        console.error("Error during report submission:", err);
        return res.send("Error submitting report.");
      }
      res.redirect("/dashboard");
    }
  );
};

// Detail laporan
const detailLaporan = (req, res) => {
  const idLaporan = req.params.id;

  db.query("SELECT * FROM laporan WHERE id_laporan = ?", [idLaporan], (err, results) => {
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

// Statistik laporan
const getStatistikLaporan = (req, res) => {
  const userEmail = req.session.user.email;

  db.query(
    `
    SELECT 
      COUNT(*) AS total,
      SUM(status = 'Done') AS selesai,
      SUM(status = 'Upload verification rejected') AS ditolak,
      SUM(status = 'Waiting for upload verification') AS menunggu,
      SUM(status = 'On progress') AS on_progress,
      SUM(status != 'Waiting for upload verification') AS terverifikasi,
      SUM(jenis_laporan = 'Kehilangan') AS kehilangan,
      SUM(jenis_laporan = 'Penemuan') AS penemuan
    FROM laporan
    WHERE email = ?
    `,
    [userEmail],
    (err, results) => {
      if (err) {
        console.error("Gagal ambil statistik:", err);
        return res.status(500).send("Terjadi kesalahan saat mengambil statistik.");
      }

      const data = results[0];

      res.render("statistik-laporan", {
        statistik: data,
        activeMenu: "statistik-laporan",
        user: req.session.user, // ✅ Tambahkan ini agar sidebar bisa akses `user`
      });
    }
  );
};
module.exports = {
  saveLaporan,
  detailLaporan,
  getStatistikLaporan,
};
