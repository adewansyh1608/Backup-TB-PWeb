const express = require("express");
const router = express.Router();
const selesaiController = require("../controllers/selesaiController"); // pastikan path-nya betul
const uploadBukti = require("../middleware/uploadBukti");

router.get("/laporan/selesai/:id", selesaiController.showSelesaiForm);

// Form POST -> pakai uploadBukti
router.post(
  "/laporan/selesai/:id",
  uploadBukti,
  selesaiController.submitSelesaiForm
);

// Route untuk detail laporan selesai
router.get("/detail/:id_laporan", selesaiController.detailLaporan);

module.exports = router;
