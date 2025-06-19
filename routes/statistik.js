const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // ✅ tambahkan ini
const statistikController = require("../controllers/statistikController");

// Statistik laporan saya
router.get(
  "/statistik-laporan",
  requireLogin,
  statistikController.getStatistikLaporan
);

// Statistik admin
router.get(
  "/statistik-laporanadmin",
  requireLogin,
  statistikController.getStatistikLaporanAdmin
);

module.exports = router;
