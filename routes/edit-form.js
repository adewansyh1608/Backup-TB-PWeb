const express = require("express");
const router = express.Router();
const editController = require("../controllers/editController");
const uploadFotoBarang = require("../middleware/uploadFoto"); // Menggunakan middleware uploadFoto

// Route untuk menampilkan halaman edit berdasarkan ID
router.get("/laporan/edit/:id", editController.showEditForm);

// Route untuk menyimpan perubahan laporan, dengan middleware untuk menangani file upload
router.post(
  "/laporan/edit/:id",
  uploadFotoBarang,
  editController.saveEditLaporan
);

module.exports = router;
