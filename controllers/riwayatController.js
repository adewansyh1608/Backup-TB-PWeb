const db = require('../config/db'); // Koneksi mysql2 biasa

// Controller untuk menampilkan halaman riwayat
const getRiwayatSaya = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Silakan login terlebih dahulu.");
  }

  const userEmail = req.session.user.email;

  const query = `
    SELECT id_riwayat, email, deskripsi_aktivitas, tanggal_aktivitas 
    FROM riwayat 
    WHERE email = ? 
    ORDER BY tanggal_aktivitas DESC
  `;

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching riwayat:', err);
      return res.status(500).send('Terjadi kesalahan saat mengambil data riwayat');
    }

    res.render('riwayat-saya', {
  riwayat: results,
  title: 'Riwayat Saya',
  user: req.session.user, // ⬅️ ini WAJIB ditambahkan agar sidebar tidak error
  activeMenu: 'riwayat-saya' // opsional, kalau kamu pakai highlight menu
});

  });
};

// Menampilkan halaman Print Riwayat
const printRiwayatPDF = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Silakan login terlebih dahulu.");
  }

  const userEmail = req.session.user.email;

  const query = `
    SELECT id_riwayat, email, deskripsi_aktivitas, tanggal_aktivitas 
    FROM riwayat 
    WHERE email = ? 
    ORDER BY tanggal_aktivitas DESC
  `;

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(' Error fetching riwayat for print:', err);
      return res.status(500).send('Terjadi kesalahan saat memuat halaman cetak');
    }

    res.render('print-riwayat', {
      riwayat: results,
      user: req.session.user,
      title: 'Cetak Riwayat Aktivitas'
    });
  });
};

// Function untuk menambah riwayat (dipanggil dari controller lain)
const tambahRiwayat = (email, deskripsiAktivitas) => {
  const query = `
    INSERT INTO riwayat (email, deskripsi_aktivitas, tanggal_aktivitas) 
    VALUES (?, ?, NOW())
  `;

  db.query(query, [email, deskripsiAktivitas], (err, result) => {
    if (err) {
      return console.error('Error adding riwayat:', err);
    }
    console.log('✅ Riwayat berhasil ditambahkan:', deskripsiAktivitas);
  });
};

module.exports = {
  getRiwayatSaya,

  printRiwayatPDF,
  tambahRiwayat
};