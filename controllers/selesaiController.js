const db = require("../config/db");

const showSelesaiForm = (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM laporan WHERE id_laporan = ?`;
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send("Laporan tidak ditemukan");
    }

    res.render("selesai-form", {
      laporan: results[0],
      reportId: id,
    });
  });
};

const submitSelesaiForm = (req, res) => {
  const id = req.params.id;

  if (!req.session.user || !req.session.user.email) {
    console.error("Session user/email tidak ditemukan");
    return res.status(401).send("Unauthorized: Email tidak tersedia");
  }

  const email = req.session.user.email;

  const { nama_penyerah, no_penyerah, tanggal_penyerahan, lokasi_penyerahan } =
    req.body;

  const foto_bukti = req.file ? req.file.filename : null;

  const updateQuery = `
    UPDATE laporan SET
      status = 'Waiting for end verification',
      nama_penemu_penerima = ?,
      nohp_penemu_penerima = ?,
      tanggal_penyerahan = ?,
      lokasi_penyerahan = ?,
      foto_bukti = ?
    WHERE id_laporan = ?
  `;

  db.query(
    updateQuery,
    [
      nama_penyerah,
      no_penyerah,
      tanggal_penyerahan,
      lokasi_penyerahan,
      foto_bukti,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Gagal mengupdate laporan:", err);
        return res.status(500).send("Gagal mengupdate laporan.");
      }

      const insertRiwayatQuery = `
      INSERT INTO riwayat (email, deskripsi_aktivitas, tanggal_aktivitas)
      VALUES (?, ?, ?)
    `;
      const deskripsi_aktivitas = `Membuat laporan selesai dengan ID ${id}`;
      const tanggal_aktivitas = new Date();

      db.query(
        insertRiwayatQuery,
        [email, deskripsi_aktivitas, tanggal_aktivitas],
        (err2) => {
          if (err2) console.error("Gagal menyimpan riwayat:", err2);
          res.redirect("/my-report");
        }
      );
    }
  );
};

const detailLaporan = (req, res) => {
  const id = req.params.id_laporan;

  const sql = `SELECT 
    nama_penemu_penerima, 
    nohp_penemu_penerima, 
    tanggal_penyerahan, 
    lokasi_penyerahan, 
    foto_bukti
    FROM laporan WHERE id_laporan = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error mengambil detail laporan:", err);
      return res.status(500).send("Terjadi kesalahan saat mengambil data.");
    }

    if (results.length === 0) {
      return res.status(404).send("Laporan tidak ditemukan.");
    }

    res.render("detail-laporan-selesai", {
      report: results[0],
    });
  });
};

module.exports = {
  showSelesaiForm,
  submitSelesaiForm,
  detailLaporan,
};
