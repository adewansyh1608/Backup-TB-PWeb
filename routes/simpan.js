const express = require("express");
const router = express.Router();
const simpanController = require("../controllers/simpanController");

// Middleware untuk memastikan user login
function ensureLoggedIn(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect("/login");
}

// Menyimpan bookmark (POST)
router.post("/simpan", ensureLoggedIn, simpanController.saveBookmark);

// Menampilkan halaman bookmark (GET)
router.get("/bookmark", ensureLoggedIn, simpanController.getBookmarks);

// Menghapus bookmark (POST)
router.post("/hapus-simpan", ensureLoggedIn, simpanController.removeBookmark);

router.post(
  "/toggle-bookmark",
  ensureLoggedIn,
  simpanController.toggleBookmark
);

module.exports = router;
