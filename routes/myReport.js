// routes/myReport.js
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware untuk memastikan user login
const {
  getUserReports,
  generateReportPdf,
  ajukanUlang,
  getReportDetail,
  getClaimerContact
} = require("../controllers/myReportController");

// Route untuk menampilkan laporan pengguna yang sedang login
router.get("/my-report", requireLogin, getUserReports); // Panggil fungsi controller

router.get("/my-report/download/:id", requireLogin, generateReportPdf);

router.get("/my-report/ajukan-ulang/:id", requireLogin, ajukanUlang);

router.get("/my-report/detail/:id", requireLogin, getReportDetail);

router.get("/my-report/claimer/:id", requireLogin, getClaimerContact);

module.exports = router;
