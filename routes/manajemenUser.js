const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const {
  tampilkanUser,
  editAkunGet,
  editAkunPost,
  resetPassword,
  hapusUser,
} = require("../controllers/manajemenUserController");

// Tampilkan halaman manajemen user
router.get("/manajemen-user", requireLogin, tampilkanUser);

// Form edit akun
router.get("/edit-akun/:email", requireLogin, editAkunGet);

// Proses edit akun
router.post("/edit-akun/:email", requireLogin, editAkunPost);

// Reset password ke default
router.post("/reset-password/:email", requireLogin, resetPassword);

// Hapus akun
router.post("/hapus-akun/:email", requireLogin, hapusUser);

module.exports = router;
