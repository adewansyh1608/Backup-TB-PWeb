const express = require("express");
const router = express.Router();
const deleteController = require("../controllers/deleteController");

// Route untuk menghapus laporan berdasarkan ID
router.get("/laporan/delete/:id", deleteController.deleteLaporan);

module.exports = router;
