const db = require('../config/db');

// 🔁 Toggle bookmark (simpan jika belum, hapus jika sudah)
const toggleBookmark = (req, res) => {
  const email = req.session.user?.email;
  const { id_laporan } = req.body;

  if (!id_laporan || !email) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const checkSql = 'SELECT * FROM simpan WHERE id_laporan = ? AND email = ?';
  db.query(checkSql, [id_laporan, email], (err, results) => {
    if (err) {
      console.error("Error checking bookmark:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      // Sudah dibookmark → hapus
      const deleteSql = 'DELETE FROM simpan WHERE id_laporan = ? AND email = ?';
      db.query(deleteSql, [id_laporan, email], (err2) => {
        if (err2) {
          console.error("Error removing bookmark:", err2);
          return res.status(500).json({ success: false, message: "Failed to remove bookmark" });
        }
        return res.json({ success: true, is_bookmarked: false });
      });
    } else {
      // Belum dibookmark → simpan
      const insertSql = 'INSERT INTO simpan (id_laporan, email) VALUES (?, ?)';
      db.query(insertSql, [id_laporan, email], (err3) => {
        if (err3) {
          console.error("Error saving bookmark:", err3);
          return res.status(500).json({ success: false, message: "Failed to save bookmark" });
        }
        return res.json({ success: true, is_bookmarked: true });
      });
    }
  });
};

// 📄 Ambil semua laporan yang disimpan user
const getBookmarks = (req, res) => {
  const email = req.session.user?.email;
  const user = req.session.user;
  const activeMenu = "bookmark";

  if (!email) {
    return res.status(401).send("Unauthorized");
  }

  const sql = `
    SELECT s.id_simpan, s.id_laporan, s.email,
           l.foto_barang, l.jenis_laporan, l.nama_barang, l.lokasi, l.status, l.tanggal_laporan
    FROM simpan s
    JOIN laporan l ON s.id_laporan = l.id_laporan
    WHERE s.email = ?
  `;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving bookmarks:", err);
      return res.status(500).send("Error retrieving bookmarks");
    }

    res.render("bookmark", {
      bookmarks: results,
      user: user,
      activeMenu: activeMenu,
      reports: results
    });
  });
};

// 💾 Simpan manual laporan ke bookmark (opsional jika dipakai di tempat lain)
const saveBookmark = (req, res) => {
  const email = req.session.user?.email;
  const { id_laporan } = req.body;

  if (!id_laporan || !email) {
    return res.status(400).send("Missing fields");
  }

  const sql = 'INSERT INTO simpan (id_laporan, email) VALUES (?, ?)';
  db.query(sql, [id_laporan, email], (err) => {
    if (err) {
      console.error('Error saving bookmark:', err);
      return res.status(500).send('Failed to save bookmark');
    }
    res.redirect('/dashboard');
  });
};

// ❌ Hapus manual bookmark (opsional jika butuh route terpisah)
const removeBookmark = (req, res) => {
  const { id_laporan } = req.body;
  const email = req.session.user?.email;

  if (!id_laporan || !email) {
    return res.status(400).send("Missing fields");
  }

  const sql = 'DELETE FROM simpan WHERE id_laporan = ? AND email = ?';
  db.query(sql, [id_laporan, email], (err) => {
    if (err) {
      console.error('Error deleting bookmark:', err);
      return res.status(500).send('Failed to delete bookmark');
    }
    res.redirect('/bookmark');
  });
};

module.exports = {
  toggleBookmark,
  getBookmarks,
  saveBookmark,
  removeBookmark
};