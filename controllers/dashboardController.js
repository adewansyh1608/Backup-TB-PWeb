const db = require("../config/db");

const dashboardController = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const jenis = req.query.jenis || 'all';     // all / kehilangan / penemuan
  const status = req.query.status || 'all';   // all / On Progress / Claimed

  let query = `SELECT * FROM laporan WHERE 1=1`;
  const params = [];

  if (jenis !== 'all') {
    query += ` AND jenis_laporan = ?`;
    params.push(jenis);
  }

  if (status === 'On Progress' || status === 'Claimed') {
    query += ` AND status = ?`;
    params.push(status);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Internal server error");
    }

    res.render("dashboard", {
      user: req.session.user,
      activeMenu: "dashboard",
      reports: results || [],
      currentJenis: jenis,
      currentStatus: status,
    });
  });
};

module.exports = { dashboardController };
