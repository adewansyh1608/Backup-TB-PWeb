const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.showLogin = (req, res) => {
  res.render("login"); // Render halaman login
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Query untuk mengambil data pengguna berdasarkan email
  const sql = "SELECT * FROM pengguna WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error saat login:", err);
      return res.status(500).send("Terjadi kesalahan pada server.");
    }
    if (results.length === 0) {
      // Jika email tidak ditemukan
      return res.render("login", { errorMessage: "Email tidak ditemukan." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Jika password tidak cocok
      return res.render("login", { errorMessage: "Password salah." });
    }

    // Menyimpan informasi pengguna di session
    req.session.user = {
      email: user.email,
      nama: user.nama,
      foto_profile: user.foto_profile,
      role: user.role,
      no_telepon: user.no_telepon,
      alamat: user.alamat,
    };

    // Redirect ke dashboard setelah login berhasil
    res.redirect("/dashboard");
  });
};

exports.showSignup = (req, res) => {
  res.render("signup"); // Render halaman signup
};

exports.signup = async (req, res) => {
  const { email, nama, no_telepon, alamat, password, confirm_password } =
    req.body;

  // Validasi jika password dan konfirmasi password tidak cocok
  if (password !== confirm_password) {
    return res.render("signup", {
      errorMessage: "Password dan Konfirmasi Password tidak cocok.",
    });
  }

  // Enkripsi password menggunakan bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Query untuk memasukkan data pengguna baru ke dalam database
  const sql = `INSERT INTO pengguna (email, nama, no_telepon, alamat, password)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [email, nama, no_telepon, alamat, hashedPassword], (err) => {
    if (err) {
      console.error("Error saat mendaftar:", err);
      return res.render("signup", {
        errorMessage: "Gagal mendaftar, coba lagi.",
      });
    }

    // Setelah sukses mendaftar, arahkan ke halaman login
    res.redirect("/login");
  });
};
