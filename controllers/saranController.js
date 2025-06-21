const db = require("../config/db");

// Form buat saran untuk user
const formSaran = (req, res) => {
  res.render("buat-saran", {
    user: req.session.user,
    activeMenu: "saran",
  });
};

// Simpan saran dari user
const kirimSaran = (req, res) => {
  const { deskripsi_saran } = req.body;
  const email = req.body.email;
  const tanggal_saran = new Date();

  const sql =
    "INSERT INTO saran (email, deskripsi_saran, tanggal_saran) VALUES (?, ?, ?)";
  db.query(sql, [email, deskripsi_saran, tanggal_saran], (err, result) => {
    if (err) {
      console.error("Gagal mengirim saran:", err);
      return res.status(500).send("Gagal mengirim saran.");
    }
    res.redirect("/dashboard");
  });
};

// Admin melihat semua saran
const tampilkanSemuaSaran = (req, res) => {
  const sql = `
    SELECT s.*, p.nama
    FROM saran s
    JOIN pengguna p ON s.email = p.email
    ORDER BY s.tanggal_saran DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data saran:", err);
      return res
        .status(500)
        .send("Terjadi kesalahan saat mengambil data saran.");
    }

    res.render("tampilkan-saran", {
      user: req.session.user,
      activeMenu: "saran",
      saranList: results,
    });
  });
};

module.exports = {
  formSaran,
  kirimSaran,
  tampilkanSemuaSaran,
};
