const db = require("../config/db");
const bcrypt = require("bcrypt");

// Tampilkan semua user (dengan pencarian opsional)
const tampilkanUser = (req, res) => {
  const search = req.query.search;
  let sql = "SELECT * FROM pengguna";
  const params = [];

  if (search) {
    sql += " WHERE nama LIKE ? OR email LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data pengguna:", err);
      return res.status(500).send("Gagal mengambil data pengguna.");
    }

    res.render("manajemen-user", {
      users: results,
      user: req.session.user,
      activeMenu: "manajemen-user",
      search,
    });
  });
};

// GET edit akun
const editAkunGet = (req, res) => {
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
      user: req.session.user,
    });
  });
};

// POST edit akun
const editAkunPost = (req, res) => {
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
};

// Reset password ke default
const resetPassword = async (req, res) => {
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
};

// Hapus user dan data terkait
const hapusUser = (req, res) => {
  const email = req.params.email;

  const deleteQueries = [
    "DELETE FROM claim WHERE email = ?",
    "DELETE FROM riwayat WHERE email = ?",
    "DELETE FROM laporan WHERE email = ?",
    "DELETE FROM saran WHERE email = ?",
    "DELETE FROM pengguna WHERE email = ?",
  ];

  const executeQuery = (index) => {
    if (index >= deleteQueries.length) {
      return res.redirect("/manajemen-user");
    }

    db.query(deleteQueries[index], [email], (err) => {
      if (err) {
        console.error("Gagal menghapus data:", err);
        return res
          .status(500)
          .send("Gagal menghapus akun beserta data terkait.");
      }
      executeQuery(index + 1);
    });
  };

  executeQuery(0);
};

module.exports = {
  tampilkanUser,
  editAkunGet,
  editAkunPost,
  resetPassword,
  hapusUser,
};
