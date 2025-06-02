const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Menambahkan timestamp untuk nama file unik
  },
});
const upload = multer({ storage: storage });

const uploadFotoBarang = upload.single("foto_barang");

module.exports = uploadFotoBarang;
