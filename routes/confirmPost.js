const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const confirmPostController = require("../controllers/confirmPostController");

// Route utama: bisa pakai /confirm-post atau /confirm-post/:filter
router.get(
  "/confirm-post/:filter?",
  requireLogin,
  confirmPostController.getUserPost
);

// Verifikasi laporan
router.post("/approve-report/:id_laporan", confirmPostController.approve);

// Tolak laporan
router.post("/denied-report/:id_laporan", confirmPostController.denied);

module.exports = router;
