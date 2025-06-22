const db = require("../config/db");

const dashboardController = (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { filter, jenis, search } = req.query;

  let query = `SELECT * FROM laporan WHERE 1=1`;
  const params = [];

  // Filter jenis_laporan (Kehilangan, Penemuan)
  if (jenis === "Kehilangan" || jenis === "Penemuan") {
    query += ` AND jenis_laporan = ?`;
    params.push(jenis);
  }

  // Filter status (On Progress, Claimed, Done)
  if (filter === "On Progress" || filter === "Claimed" || filter === "Done") {
    query += ` AND status = ?`;
    params.push(filter);
  } else {
    query += ` AND status IN ('On Progress', 'Claimed', 'Done')`;
  }

  // Pencarian nama_barang
  if (search) {
    query += ` AND nama_barang LIKE ?`;
    params.push(`%${search}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    res.render("dashboard", {
      user: req.session.user,
      activeMenu: "dashboard",
      reports: results || [],
      searchQuery: search || "",
      activeFilter: filter || "All",
      activeJenis: jenis || "All",
    });
  });
};

const claimReport = (req, res) => {
  const { id_laporan } = req.body;
  const email = req.session.user.email; // Asumsi email disimpan dalam session

  // Query untuk memperbarui status laporan menjadi "Claimed"
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

    // Insert ke dalam tabel claim
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

      db.query(
        insertRiwayatQuery,
        [email, deskripsi_aktivitas, tanggal_aktivitas],
        (err2, result2) => {
          if (err2) {
            console.error("Gagal menyimpan riwayat:", err2);
            // Tidak perlu menghentikan proses meskipun gagal menyimpan riwayat
          }
          // Redirect ke halaman kontak pelapor
          res.redirect(`/kontak-pelapor/${id_laporan}`);
        }
      );
    });
  });
};

const detailLaporanPost = (req, res) => {
  const { id_laporan } = req.params;

  // Query untuk mengambil data detail laporan berdasarkan id_laporan
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
