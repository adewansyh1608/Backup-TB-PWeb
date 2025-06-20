const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware to ensure user is logged in
const {
  dashboardController,
  claimReport,
  detailLaporanPost,
} = require("../controllers/dashboardController"); // Import controller

// Route to render the dashboard and fetch reports
router.get("/dashboard", requireLogin, dashboardController); // Use the controller to fetch reports and render the view

// Route to handle claim action (POST request)
router.post("/claim", requireLogin, claimReport); // Handle claim and insert into database

// Route untuk menampilkan detail laporan
router.get("/detail-laporan/:id_laporan", requireLogin, detailLaporanPost); // Menampilkan detail laporan

const kontakPelaporRoute = require("./kontak-pelapor");
router.use("/kontak-pelapor", kontakPelaporRoute);

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
