const db = require("../config/db");

const kontakPelaporController = (req, res) => {
  const { id_laporan } = req.params;

  // Query to get the details of the report creator
  const query = `
    SELECT p.nama, p.email, p.no_telepon, p.alamat
    FROM laporan l
    JOIN pengguna p ON l.email = p.email
    WHERE l.id_laporan = ?
  `;

  db.query(query, [id_laporan], (err, results) => {
    if (err) {
      console.error("Error fetching report creator details:", err);
      return res.status(500).send("Error fetching report creator details.");
    }

    if (results.length > 0) {
      const reporter = results[0];
      res.render("kontak-pelapor", {
        reporter, // Passing the reporter details to the view
        user: req.session.user,
      });
    } else {
      res.status(404).send("Report not found.");
    }
  });
};

module.exports = { kontakPelaporController };
