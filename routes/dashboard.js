const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const dashboardController = require("../controllers/dashboardController"); // jangan pakai destructuring

// Route utama dashboard
router.get("/dashboard", requireLogin, dashboardController.dashboardController);

// Statistik user dan admin
const statistikController = require("../controllers/statistikController");
router.get("/statistik-laporan", requireLogin, statistikController.getStatistikLaporan);
router.get("/statistik-laporanadmin", requireLogin, statistikController.getStatistikLaporanAdmin);

module.exports = router;
