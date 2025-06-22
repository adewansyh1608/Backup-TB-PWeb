const express = require("express");
const router = express.Router();
const { getRiwayatSaya } = require("../controllers/riwayatController");

// Route untuk menampilkan halaman riwayat saya
router.get("/riwayat-saya", getRiwayatSaya);

module.exports = router;
