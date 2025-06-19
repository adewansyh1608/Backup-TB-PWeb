const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware to ensure user is logged in
const { dashboardController } = require("../controllers/dashboardController"); // Import controller

// Route to render the dashboard and fetch reports
router.get("/dashboard", requireLogin, dashboardController); // Use the controller to fetch reports and render the view

// Statistik user dan admin
const statistikController = require("../controllers/statistikController");
router.get(
  "/statistik-laporan",
  requireLogin,
  statistikController.getStatistikLaporan
);
router.get(
  "/statistik-laporanadmin",
  requireLogin,
  statistikController.getStatistikLaporanAdmin
);

module.exports = router;
