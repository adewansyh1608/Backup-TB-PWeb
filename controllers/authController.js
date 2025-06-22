const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.showLogin = (req, res) => {
  res.render("login"); 
};

exports.login = (req, res) => {
  const { email, password } = req.body;


  const sql = "SELECT * FROM pengguna WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error saat login:", err);
      return res.status(500).send("Terjadi kesalahan pada server.");
    }
    if (results.length === 0) {
 
      return res.render("login", { errorMessage: "Email tidak ditemukan." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {

      return res.render("login", { errorMessage: "Password salah." });
    }


    req.session.user = {
      email: user.email,
      nama: user.nama,
      foto_profile: user.foto_profile,
      role: user.role,
      no_telepon: user.no_telepon,
      alamat: user.alamat,
    };

 
    res.redirect("/dashboard");
  });
};

exports.showSignup = (req, res) => {
  res.render("signup");
};

exports.signup = async (req, res) => {
  const { email, nama, no_telepon, alamat, password, confirm_password } =
    req.body;


  if (password !== confirm_password) {
    return res.render("signup", {
      errorMessage: "Password dan Konfirmasi Password tidak cocok.",
    });
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  const sql = `INSERT INTO pengguna (email, nama, no_telepon, alamat, password)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [email, nama, no_telepon, alamat, hashedPassword], (err) => {
    if (err) {
      console.error("Error saat mendaftar:", err);
      return res.render("signup", {
        errorMessage: "Gagal mendaftar, coba lagi.",
      });
    }


    res.redirect("/login");
  });
};
