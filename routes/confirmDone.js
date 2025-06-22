const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const confirmDoneController = require("../controllers/confirmDoneController");
const selesaiController = require("../controllers/selesaiController");

// Detail laporan
router.get("/detail/:id_laporan", selesaiController.detailLaporan);

// POST Approve dan Denied
router.post(
  "/confirm-done/approve-report/:id_laporan",
  confirmDoneController.approve
);
router.post(
  "/confirm-done/denied-report/:id_laporan",
  confirmDoneController.denied
);

// Route utama (pastikan ini paling bawah)
router.get("/confirm-done", requireLogin, confirmDoneController.getUserPost);
router.get("/:filter?", requireLogin, confirmDoneController.getUserPost);

module.exports = router;
