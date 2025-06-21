const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.formTambah = (req, res) => {
  res.render("tambahAkun"); // file views/tambahAkun.ejs
};

exports.tambahAkun = async (req, res) => {
  const { nama, email, no_telepon, password, alamat, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO pengguna (email, nama, password, role, no_telepon, alamat) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [email, nama, hashedPassword, role, no_telepon, alamat],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.send("Gagal menambahkan akun.");
      }
      res.redirect("/manajemen-user");
    }
  );
};
