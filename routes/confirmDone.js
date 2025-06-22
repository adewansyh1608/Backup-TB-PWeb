const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const confirmDoneController = require("../controllers/confirmDoneController");

// Route utama + filter
router.get("/:filter?", requireLogin, confirmDoneController.getUserPost);

// Verifikasi laporan selesai
router.post("/approve-report/:id_laporan", confirmDoneController.approve);

// Tolak laporan
router.post("/denied-report/:id_laporan", confirmDoneController.denied);

module.exports = router;
