require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const laporanRoutes = require("./routes/laporan");
const dashboardRoutes = require("./routes/dashboard");
const myReportRoutes = require("./routes/myReport");
const editFormRoutes = require("./routes/edit-form");
const deleteRoutes = require("./routes/delete");
const confirmPostRoutes = require("./routes/confirmPost");
const editController = require("./controllers/editController"); // Pastikan path ini benar
const statistikRoutes = require("./routes/statistik");
const kontakPelaporRoute = require("./routes/kontak-pelapor");
const laporanSayaclaimRoutes = require("./routes/laporan-sayaclaim"); // Import rute laporan-sayaclaim
const arsipLaporanRoute = require("./routes/arsipLaporan");
const tambahAkunRoutes = require("./routes/tambahAkun");
const manajemenUserRoutes = require("./routes/manajemenUser");
const saranRoutes = require("./routes/saran");
const selesaiRoutes = require("./routes/selesai");
const simpanRoutes = require("./routes/simpan");
const riwayatRoutes = require("./routes/riwayat");
const confirmDoneRoutes = require("./routes/confirmDone");

const upload = multer({ dest: "uploads/" }); // pastikan destinasi upload benar

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Parsing data dari form
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "r15hitam",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", laporanRoutes);
app.use("/", dashboardRoutes);
app.use("/", myReportRoutes);
app.use("/", confirmPostRoutes);
app.use(editFormRoutes);
app.use(deleteRoutes);
app.use("/laporan", require("./routes/laporan"));
app.use("/", require("./routes/statistik"));
app.use("/kontak-pelapor", kontakPelaporRoute);
app.use("/", statistikRoutes);
app.use("/", laporanSayaclaimRoutes); // Menambahkan rute laporan-sayaclaim ke dalam aplikasi
app.use("/", arsipLaporanRoute);
app.use("/tambah-akun", tambahAkunRoutes);
app.use("/", manajemenUserRoutes);
app.use(saranRoutes);
app.use("/", selesaiRoutes);
app.use("/", simpanRoutes);
app.use("/", riwayatRoutes);
app.use("/confirm-done", confirmDoneRoutes);

// Menangani POST request untuk mengedit laporan
app.post(
  "/laporan/edit/:id",
  upload.single("foto_barang"), // Multer hanya digunakan pada route ini
  editController.saveEditLaporan
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
