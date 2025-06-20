const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const { tampilkanUser, cetakUser } = require("../controllers/manajemenUserController");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// Route untuk menampilkan halaman manajemen user
router.get("/manajemen-user", requireLogin, tampilkanUser);

//Route untuk mencetak data user
router.get("/manajemen-user/cetak", requireLogin, cetakUser);

//Route untuk Edit Akun
router.post("/edit-akun/:email", requireLogin, (req, res) => {
  const email = req.params.email;
  const { nama, no_telepon, alamat, role } = req.body;

  const sql = `
    UPDATE pengguna 
    SET nama = ?, no_telepon = ?, alamat = ?, role = ?
    WHERE email = ?
  `;

  db.query(sql, [nama, no_telepon, alamat, role, email], (err, result) => {
    if (err) {
      console.error("Gagal memperbarui akun:", err);
      return res.status(500).send("Gagal memperbarui akun.");
    }

    res.redirect("/manajemen-user");
  });
});

router.get("/edit-akun/:email", requireLogin, (req, res) => {
  const email = req.params.email;
  const sql = "SELECT * FROM pengguna WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Gagal mengambil data akun:", err);
      return res.status(500).send("Gagal mengambil data akun.");
    }

    if (results.length === 0) {
      return res.status(404).send("Akun tidak ditemukan.");
    }

    res.render("edit-akun", {
      akun: results[0],              
      user: req.session.user         
    });
  });
});

//Route untuk Reset Password
router.post("/reset-password/:email", requireLogin, async (req, res) => {
  const email = req.params.email;
  const defaultPassword = "user123";

  try {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const sql = "UPDATE pengguna SET password = ? WHERE email = ?";

    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Gagal mereset password:", err);
        return res.status(500).send("Gagal mereset password.");
      }
      res.redirect(`/edit-akun/${email}`);
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send("Terjadi kesalahan saat reset password.");
  }
});


// Route untuk menghapus user berdasarkan email
router.post("/hapus-akun/:email", requireLogin, (req, res) => {
  const email = req.params.email;

  const sql = "DELETE FROM pengguna WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Gagal menghapus akun:", err);
      return res.status(500).send("Gagal menghapus akun.");
    }

    // Setelah berhasil menghapus, kembali ke halaman manajemen user
    res.redirect("/manajemen-user");
  });
});

module.exports = router;
