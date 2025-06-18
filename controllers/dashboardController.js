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

const saveClaim = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized. Please log in.");
  }

  const { id_laporan } = req.body;
  if (!id_laporan) {
    return res.status(400).send("Missing report ID.");
  }

  const email = req.session.user.email;
  const tanggal_claim = new Date().toISOString().slice(0, 10);

  const sql = "INSERT INTO claim (id_laporan, email, tanggal_claim) VALUES (?, ?, ?)";
  db.query(sql, [id_laporan, email, tanggal_claim], (err) => {
    if (err) {
      console.error("Error inserting claim:", err);
      return res.status(500).send("Claim failed.");
    }
    res.redirect("/dashboard");
  });
};

module.exports = { dashboardController };
