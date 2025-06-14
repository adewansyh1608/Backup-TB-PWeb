const db = require("../config/db"); // Pastikan pengimporan db benar

const getUserPost = (req, res) => {
  const query = `
    SELECT * FROM laporan WHERE status IN ('On Progress', 'Waiting for upload verification', 'Upload verification rejected')
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    // Menggunakan layout dengan title dan activeMenu
    res.render("confirm-post", {
      user: req.session.user,
      reports: results,
      activeMenu: "confirm-post", // Pastikan menu aktif di sidebar
    });
  });
};

const approve = (req, res) => {
  const idLaporan = req.params.id_laporan; // Get id_laporan from URL parameter
  const newStatus = "On progress"; // Set the new status after approval

  const sql = `UPDATE laporan 
               SET status = ? 
               WHERE id_laporan = ?`;

  db.query(sql, [newStatus, idLaporan], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.send("Error updating status.");
    }

    // Redirect back to the dashboard after updating the status
    res.redirect("/confirm-post");
  });
};

const denied = (req, res) => {
  const idLaporan = req.params.id_laporan; // Get id_laporan from URL parameter
  const newStatus = "Upload verification rejected"; // Set the new status after approval

  const sql = `UPDATE laporan 
               SET status = ? 
               WHERE id_laporan = ?`;

  db.query(sql, [newStatus, idLaporan], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.send("Error updating status.");
    }

    // Redirect back to the dashboard after updating the status
    res.redirect("/confirm-post");
  });
};

module.exports = { getUserPost, approve, denied };
