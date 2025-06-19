const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const db = require("../config/db"); // pastikan koneksi db disini

const { dashboardController } = require("../controllers/dashboardController");

router.get("/dashboard", requireLogin, dashboardController);

router.get("/claim/:id", requireLogin, (req, res) => {
  console.log("Route /claim/:id dipanggil");
  const idLaporan = req.params.id;

  const query = `
    SELECT l.*, p.nama, p.no_telepon, p.alamat 
    FROM laporan l 
    JOIN pengguna p ON l.email = p.email 
    WHERE l.id_laporan = ?
  `;

  db.query(query, [idLaporan], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error");
    }

    if (results.length === 0) {
      return res.status(404).send("Laporan tidak ditemukan");
    }

    const laporan = results[0];
    res.render("kontak-pelapor", { laporan });
  });
});

module.exports = router;