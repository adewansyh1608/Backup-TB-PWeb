const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get("/profile", requireLogin, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/profile/edit", requireLogin, (req, res) => {
  res.render("edit-profile", { user: req.session.user });
});

router.get("/profile/change-password", requireLogin, (req, res) => {
  res.render("changepassword-profile", { user: req.session.user });
});

router.post(
  "/profile/update",
  requireLogin,
  upload.single("foto_profile"),
  (req, res) => {
    const { nama, email, no_telepon, alamat } = req.body;
    let foto = req.session.user.foto_profile;

    if (req.file) {
      foto = "uploads/" + req.file.filename;
    }

    const sql = `
    UPDATE pengguna 
    SET nama = ?, email = ?, no_telepon = ?, alamat = ?, foto_profile = ?
    WHERE email = ?
  `;
    db.query(
      sql,
      [nama, email, no_telepon, alamat, foto, req.session.user.email],
      (err) => {
        if (err) {
          console.error(err);
          return res.send("Gagal update profil.");
        }

        req.session.user = {
          nama,
          email,
          no_telepon,
          alamat,
          foto_profile: foto,
          role: req.session.user.role,
        };

        res.redirect("/profile");
      }
    );
  }
);

router.post("/profile/change-password", requireLogin, async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.send("Password tidak cocok.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const sql = `UPDATE pengguna SET password = ? WHERE email = ?`;

  db.query(sql, [hashedPassword, req.session.user.email], (err) => {
    if (err) {
      console.error(err);
      return res.send("Gagal mengubah password.");
    }
    res.redirect("/profile");
  });
});

module.exports = router;
