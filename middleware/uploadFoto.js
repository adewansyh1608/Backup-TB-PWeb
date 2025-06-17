const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, "..", "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Menyimpan file ke folder public/uploads/
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Mendapatkan ekstensi file
    cb(null, Date.now() + ext); // Menambahkan timestamp untuk nama file unik
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Hanya menerima file gambar
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // File diterima
    } else {
      cb(new Error("Hanya file gambar yang diizinkan."), false); // Error jika file tidak valid
    }
  },
});

const uploadFotoBarang = upload.single("foto_barang");

module.exports = uploadFotoBarang;
