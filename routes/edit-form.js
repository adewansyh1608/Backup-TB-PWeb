const express = require("express");
const router = express.Router();
const editController = require("../controllers/editController");

// Route untuk menampilkan halaman edit berdasarkan ID
router.get("/laporan/edit/:id", editController.showEditForm);

// Route untuk menyimpan perubahan laporan
router.post("/laporan/edit/:id", editController.saveEditLaporan);

module.exports = router;
