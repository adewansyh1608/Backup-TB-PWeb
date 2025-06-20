const db = require("../config/db");

// Controller untuk menampilkan halaman dashboard
const dashboardController = (req, res) => {
  // Pastikan user sudah login
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Ambil laporan dengan status tertentu
  const query = `
    SELECT * FROM laporan 
    WHERE status IN ('On Progress', 'Claimed', 'Done')
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    res.render("dashboard", {
      user: req.session.user,
      activeMenu: "dashboard",
      reports: results || [],
    });
  });
};

// Controller untuk menyimpan klaim laporan
const saveClaim = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized. Please log in.");
  }

  const { id_laporan } = req.body;
  if (!id_laporan) {
    return res.status(400).send("Missing report ID.");
  }

  const email = req.session.user.email;
  const tanggal_claim = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

  const sql = `
    INSERT INTO claim (id_laporan, email, tanggal_claim) 
    VALUES (?, ?, ?)
  `;

  db.query(sql, [id_laporan, email, tanggal_claim], (err) => {
    if (err) {
      console.error("Error inserting claim:", err);
      return res.status(500).send("Claim failed.");
    }

    res.redirect("/dashboard");
  });
};

// Pastikan kedua fungsi diekspor
module.exports = {
  dashboardController,
  saveClaim
};