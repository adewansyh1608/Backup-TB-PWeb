const db = require("../config/db");

const tampilkanUser = (req, res) => {
  const search = req.query.search; // Ambil parameter dari input pencarian
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
      search, // dikirim ke EJS agar input search tetap terisi
    });
  });
};

const cetakUser = (req, res) => {
  const sql = "SELECT * FROM pengguna";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mencetak data pengguna:", err);
      return res.status(500).send("Gagal mencetak data pengguna.");
    }

    // Filter berdasarkan role
    const adminUsers = results.filter((user) => user.role === "admin");
    const normalUsers = results.filter((user) => user.role === "user");

    res.render("cetak-user", {
      user: req.session.user,
      adminUsers,
      normalUsers,
    });
  });
};

module.exports = {
  tampilkanUser,
  cetakUser,
};
