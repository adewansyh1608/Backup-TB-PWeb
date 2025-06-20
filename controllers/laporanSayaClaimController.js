const db = require("../config/db");

const laporanSayaClaim = (req, res) => {
  const userEmail = req.session.user.email; // Ambil email dari sesi pengguna yang login

  // Query untuk mendapatkan semua id_laporan yang terkait dengan email pengguna di tabel 'claim'
  const getLaporanIdsQuery = `
    SELECT id_laporan FROM claim
    WHERE email = ?
  `;

  db.query(getLaporanIdsQuery, [userEmail], (err, claimResults) => {
    if (err) {
      console.error("Error fetching claim reports:", err);
      return res.status(500).send("Error fetching claim reports.");
    }

    // Jika tidak ada klaim yang ditemukan untuk pengguna
    if (claimResults.length === 0) {
      return res.render("laporan-sayaclaim", {
        reports: [],
        user: req.session.user,
        activeMenu: "laporan-sayaclaim",
      });
    }

    // Ambil id_laporan yang ditemukan dalam claim
    const laporanIds = claimResults.map((claim) => claim.id_laporan);

    // Query untuk mengambil data laporan berdasarkan id_laporan yang ditemukan di claim
    const getReportsQuery = `
      SELECT * FROM laporan
      WHERE id_laporan IN (?)
    `;

    db.query(getReportsQuery, [laporanIds], (err, reportResults) => {
      if (err) {
        console.error("Error fetching report details:", err);
        return res.status(500).send("Error fetching report details.");
      }

      // Render halaman dengan laporan yang sudah di-claim
      res.render("laporan-sayaclaim", {
        reports: reportResults,
        user: req.session.user,
        activeMenu: "laporan-sayaclaim", // Menambahkan activeMenu untuk menandai menu ini aktif
      });
    });
  });
};

const batalClaim = (req, res) => {
  const { id_laporan } = req.body; // Mendapatkan id laporan dari form
  const userEmail = req.session.user.email; // Ambil email dari sesi pengguna yang login

  // 1. Update status laporan menjadi 'On Progress' di tabel 'laporan'
  const updateLaporanQuery = `
    UPDATE laporan
    SET status = 'On Progress'
    WHERE id_laporan = ?
  `;

  db.query(updateLaporanQuery, [id_laporan], (err, updateResults) => {
    if (err) {
      console.error("Error updating laporan status:", err);
      return res.status(500).send("Error updating laporan status.");
    }

    // 2. Hapus data klaim di tabel 'claim'
    const deleteClaimQuery = `
      DELETE FROM claim
      WHERE id_laporan = ? AND email = ?
    `;

    db.query(
      deleteClaimQuery,
      [id_laporan, userEmail],
      (err, deleteResults) => {
        if (err) {
          console.error("Error deleting claim:", err);
          return res.status(500).send("Error deleting claim.");
        }

        // Setelah berhasil mengupdate status dan menghapus klaim, arahkan kembali ke halaman laporan saya claim
        res.redirect("/laporan-sayaclaim");
      }
    );
  });
};

module.exports = { laporanSayaClaim, batalClaim }; // Export the controller functions
