const db = require('../config/db');

exports.showSelesaiForm = (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM laporan WHERE id_laporan = ?`;
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send('Laporan tidak ditemukan');
    }

    res.render('selesai-form', {
      laporan: results[0],
      reportId: id
    });
  });
};

exports.submitSelesaiForm = (req, res) => {
  const id = req.params.id;
  if (!req.session.user || !req.session.user.email) {
  console.error("Session user/email tidak ditemukan");
  return res.status(401).send("Unauthorized: Email tidak tersedia");
}
  const email = req.session.user.email;

  const updateQuery = `UPDATE laporan SET status = 'Waiting for end verification' WHERE id_laporan = ?`;

  db.query(updateQuery, [id], (err) => {
    if (err) {
      console.error("Gagal mengupdate status:", err);
      return res.status(500).send("Gagal mengupdate status laporan.");
    }

    //  Tambahkan riwayat aktivitas
    const insertRiwayatQuery = `
      INSERT INTO riwayat (email, deskripsi_aktivitas, tanggal_aktivitas)
      VALUES (?, ?, ?)
    `;

    const deskripsi_aktivitas = `Membuat laporan selesai dengan ID ${id}`;
    const tanggal_aktivitas = new Date();

    db.query(insertRiwayatQuery, [email, deskripsi_aktivitas, tanggal_aktivitas], (err2, result2) => {
      if (err2) {
        console.error('Gagal menyimpan riwayat:', err2);
        // Tidak perlu menghentikan proses meskipun gagal menyimpan riwayat
      }

      res.redirect('/my-report');
    });
  });
};