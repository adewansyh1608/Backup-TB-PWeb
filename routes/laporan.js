const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const validateLaporanType = require("../middleware/validateLaporanType");
const uploadFotoBarang = require("../middleware/uploadFoto");
const { saveLaporan } = require("../controllers/laporanController");
const laporanController = require('../controllers/laporanController');


// Menampilkan Form Laporan (GET)
router.get("/laporan", requireLogin, (req, res) => {
  res.render("report-form", { user: req.session.user });
});

// Mengirim Laporan (POST)
router.post(
  "/laporan",
  requireLogin, // Pastikan ini adalah middleware yang valid
  uploadFotoBarang, // Pastikan ini adalah middleware yang valid
  validateLaporanType, // Pastikan ini adalah middleware yang valid
  saveLaporan // Pastikan ini adalah controller yang valid
);

router.get("/laporan/detail/:id", requireLogin, laporanController.detailLaporan);

module.exports = router;
