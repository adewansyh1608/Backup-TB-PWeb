const db = require("../config/db");

// Controller untuk menampilkan dashboard
const dashboardController = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const searchQuery = req.query.q; // Ambil keyword pencarian dari query string

  let sql = `
    SELECT * FROM laporan 
    WHERE status IN ('On Progress', 'Claimed', 'Done')
  `;
  const params = [];

  // Jika ada keyword pencarian, tambahkan ke SQL
  if (searchQuery) {
    sql += " AND nama_barang LIKE ?";
    params.push(`%${searchQuery}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    res.render("dashboard", {
      user: req.session.user,
      activeMenu: "dashboard",
      reports: results || [],
      query: searchQuery || "" // Untuk menampilkan keyword di input
    });
  });
};

// Controller untuk klaim laporan
const claimReport = (req, res) => {
  const { id_laporan } = req.body;
  const email = req.session.user.email;

  // 1. Update status laporan menjadi 'Claimed'
  const updateQuery = `
    UPDATE laporan
    SET status = 'Claimed'
    WHERE id_laporan = ?
  `;

  db.query(updateQuery, [id_laporan], (err, results) => {
    if (err) {
      console.error("Error updating report status:", err);
      return res.status(500).send("Error processing claim.");
    }

    // 2. Tambahkan ke tabel claim
    const claimQuery = `
      INSERT INTO claim (id_laporan, email, tanggal_claim)
      VALUES (?, ?, NOW())
    `;

    db.query(claimQuery, [id_laporan, email], (err, results) => {
      if (err) {
        console.error("Error inserting claim:", err);
        return res.status(500).send("Error processing claim.");
      }

      // ✅ 3. Tambahkan riwayat aktivitas
      const insertRiwayatQuery = `
        INSERT INTO riwayat (email, deskripsi_aktivitas, tanggal_aktivitas)
        VALUES (?, ?, ?)
      `;

      const deskripsi_aktivitas = `Mengklaim laporan dengan ID ${id_laporan}`;
      const tanggal_aktivitas = new Date(); // waktu saat ini

      db.query(insertRiwayatQuery, [email, deskripsi_aktivitas, tanggal_aktivitas], (err2, result2) => {
        if (err2) {
          console.error('Gagal menyimpan riwayat:', err2);
          // Tidak perlu menghentikan proses meskipun gagal menyimpan riwayat
        }

        // 4. Redirect ke halaman kontak pelapor
        res.redirect(`/kontak-pelapor/${id_laporan}`);
      });
    });
  });
};

// Controller untuk detail laporan
const detailLaporanPost = (req, res) => {
  const { id_laporan } = req.params;

  const query = `
    SELECT l.id_laporan, l.nama_barang, l.jenis_laporan, l.tanggal_kejadian, l.lokasi, 
           l.tanggal_laporan, l.deskripsi, l.foto_barang, l.status
    FROM laporan l
    WHERE l.id_laporan = ?
  `;

  db.query(query, [id_laporan], (err, results) => {
    if (err) {
      console.error("Error fetching report details:", err);
      return res.status(500).send("Error fetching report details.");
    }

    if (results.length > 0) {
      const report = results[0];
      res.render("detail-laporanpost", {
        report,
        user: req.session.user,
      });
    } else {
      res.status(404).send("Report not found.");
    }
  });
};

module.exports = { dashboardController, claimReport, detailLaporanPost };