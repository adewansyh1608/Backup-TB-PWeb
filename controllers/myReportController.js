const db = require("../config/db"); // Pastikan pengimporan db benar

const getUserReports = (req, res) => {
  const userEmail = req.session.user.email;

  const sql = `SELECT * FROM laporan WHERE email = ?`;

  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.send("Error fetching reports.");
    }

    // Menggunakan layout dengan title dan activeMenu
    res.render("my-report", {
      user: req.session.user,
      reports: results,
      activeMenu: "my-report", // Pastikan menu aktif di sidebar
    });
  });
};

module.exports = { getUserReports };
