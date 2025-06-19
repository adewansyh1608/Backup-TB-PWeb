const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const validateLaporanType = require("../middleware/validateLaporanType");
const uploadFotoBarang = require("../middleware/uploadFoto");
const laporanController = require('../controllers/laporanController');

// Menampilkan Form Laporan (GET)
router.get("/laporan", requireLogin, (req, res) => {
  res.render("report-form", { user: req.session.user });
});

// Mengirim Laporan (POST)
router.post(
  "/laporan",
  requireLogin,
  uploadFotoBarang,
  validateLaporanType,
  laporanController.saveLaporan
);
router.get('/', laporanController.getLaporan);
// Menampilkan detail laporan
router.get("/laporan/detail/:id", requireLogin, laporanController.detailLaporan);

module.exports = router;
