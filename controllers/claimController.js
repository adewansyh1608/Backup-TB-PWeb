const db = require('../config/db'); // koneksi database

exports.claimReport = (req, res) => {
  const reportId = req.params.id;
  const { nama_penemu_penerima, nohp_penemu_penerima, lokasi_penyerahan } = req.body;
  const tanggal_penyerahan = new Date().toISOString().slice(0, 10);

  const sql = `
    UPDATE laporan SET 
      status = 'Claimed',
      nama_penemu_penerima = ?,
      nohp_penemu_penerima = ?,
      tanggal_penyerahan = ?,
      lokasi_penyerahan = ?
    WHERE id_laporan = ?
  `;

  db.query(sql, [nama_penemu_penerima, nohp_penemu_penerima, tanggal_penyerahan, lokasi_penyerahan, reportId], (err, result) => {
    if (err) {
      console.error('Gagal klaim laporan:', err);
      return res.status(500).send('Terjadi kesalahan saat mengklaim laporan');
    }
    res.redirect('/my-claimed-report');
  });
};

exports.unclaimReport = (req, res) => {
  const reportId = req.params.id;
  const email = req.session.user?.email; // ambil email dari session
  const tanggal_aktivitas = new Date(); // tanggal dan waktu sekarang
  const deskripsi_aktivitas = `Membatalkan claim laporan dengan ID ${reportId}`;

  const sql = `
    UPDATE laporan SET 
      status = 'On progress',
      nama_penemu_penerima = NULL,
      nohp_penemu_penerima = NULL,
      tanggal_penyerahan = NULL,
      lokasi_penyerahan = NULL
    WHERE id_laporan = ?
  `;

  db.query(sql, [reportId], (err, result) => {
    if (err) {
      console.error('Gagal batalkan klaim:', err);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat membatalkan klaim' });
    }
  // Tambahkan riwayat
    const insertRiwayat = `
      INSERT INTO riwayat (email, deskripsi_aktivitas, tanggal_aktivitas)
      VALUES (?, ?, ?)
    `;

    db.query(insertRiwayat, [email, deskripsi_aktivitas, tanggal_aktivitas], (err2, result2) => {
      if (err2) {
        console.error('Gagal menyimpan riwayat:', err2);
        // Meski gagal simpan riwayat, balas tetap berhasil untuk UX
      }
    res.json({ success: true, message: 'Claim berhasil dibatalkan' });
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

exports.getClaimedReports = (req, res) => {
  const emailUser = req.session.user?.email; // pastikan ada session

  if (!emailUser) {
    return res.redirect('/login'); // arahkan ke login jika belum login
  }

  const sql = `
    SELECT * FROM laporan 
    WHERE status = 'Claimed' AND email = ?
  `;

  db.query(sql, [emailUser], (err, results) => {
    if (err) {
      console.error('Gagal ambil laporan yang diklaim:', err);
      return res.status(500).send('Terjadi kesalahan saat mengambil data');
    }

    res.render('my-claimed-report', {
      reports: results || [],
      user: req.session.user || {},
      activeMenu: 'my-claimed-report'
    });
  });
};