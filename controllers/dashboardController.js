const db = require("../config/db");

const dashboardController = (req, res) => {
  // Ensure user data exists in session
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if there's no user session
  }

  // Query to get reports with status 'On Progress', 'Claimed', or 'Done'
  const query = `
    SELECT * FROM laporan WHERE status IN ('On Progress', 'Claimed', 'Done')
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    // Render the dashboard page and pass the reports, user data, and active menu
    res.render("dashboard", {
      user: req.session.user,
      activeMenu: "dashboard", // Mark "Dashboard" as active in the sidebar
      reports: results || [], // Pass reports to the template (or empty array if no reports)
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

      // Redirect ke halaman kontak pelapor
      res.redirect(`/kontak-pelapor/${id_laporan}`);
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
