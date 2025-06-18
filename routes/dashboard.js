const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware to ensure user is logged in
const { dashboardController } = require("../controllers/dashboardController"); // Import controller

// Route to render the dashboard and fetch reports
router.get("/dashboard", requireLogin, dashboardController); // Use the controller to fetch reports and render the view

// Statistik Laporan Saya - TAMPILKAN statistik-laporan.ejs
const laporanController = require("../controllers/laporanController");

router.get("/statistik-laporan", laporanController.getStatistikLaporan); // ✅ Pakai controller


module.exports = router;
