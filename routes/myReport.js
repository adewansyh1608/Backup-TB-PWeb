// routes/myReport.js
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware untuk memastikan user login
const myReportController = require("../controllers/myReportController"); // Mengimpor controller

// Route untuk menampilkan laporan pengguna yang sedang login
router.get("/my-report", requireLogin, myReportController.getUserReports); // Panggil fungsi controller

module.exports = router;
