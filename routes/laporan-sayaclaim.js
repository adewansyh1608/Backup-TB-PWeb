const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin"); // Middleware untuk memastikan user sudah login
const {
  laporanSayaClaim,
  batalClaim,
} = require("../controllers/laporanSayaClaimController"); // Import controller

// Route untuk menampilkan laporan yang di-claim oleh user
router.get("/laporan-sayaclaim", requireLogin, laporanSayaClaim); // Halaman Laporan Saya Claim

// Route untuk batal claim
router.post("/batal-claim", requireLogin, batalClaim); // Membatalkan klaim laporan

module.exports = router;
