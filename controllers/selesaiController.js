const db = require('../config/db');

exports.getSelesaiForm = (req, res) => {
  const reportId = req.params.id;

  const sql = `SELECT * FROM laporan WHERE id_laporan = ?`;

  db.query(sql, [reportId], (err, results) => {
    if (err) {
      console.error('Gagal ambil data laporan:', err);
      return res.status(500).send('Terjadi kesalahan saat mengambil data laporan');
    }

    if (results.length === 0) {
      return res.status(404).send('Laporan tidak ditemukan');
    }

    res.render('selesai-form', {
      laporan: results[0]
    });
  });
};

// Untuk menandai laporan sebagai selesai
exports.laporanSelesai = (req, res) => {
  const reportId = req.params.id;

  const sql = `
    UPDATE laporan SET 
      status = 'Done'
    WHERE id_laporan = ?
  `;

  db.query(sql, [reportId], (err, result) => {
    if (err) {
      console.error('Gagal menandai laporan selesai:', err);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menandai laporan selesai' });
    }
    res.json({ success: true, message: 'Laporan berhasil ditandai sebagai selesai' });
  });
};