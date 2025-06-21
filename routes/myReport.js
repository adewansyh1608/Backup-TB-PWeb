// routes/myReport.js
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware untuk memastikan user login
const {
  getUserReports,
  generateReportPdf,
} = require("../controllers/myReportController");

// Route untuk menampilkan laporan pengguna yang sedang login
router.get("/my-report", requireLogin, getUserReports); // Panggil fungsi controller

router.get("/my-report/download/:id", requireLogin, generateReportPdf);

module.exports = router;
