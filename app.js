require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const laporanRoutes = require("./routes/laporan");
const dashboardRoutes = require("./routes/dashboard");
const myReportRoutes = require("./routes/myReport");
const editFormRoutes = require("./routes/edit-form");
const editController = require("./controllers/editController");
const deleteRoutes = require("./routes/delete");
const confirmPostRoutes = require("./routes/confirmPost");

const upload = multer({ dest: "uploads/" });

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "r15hitam",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", laporanRoutes);
app.use("/", dashboardRoutes);
app.use("/", myReportRoutes);
app.use("/", confirmPostRoutes);
app.use(editFormRoutes);
app.use(deleteRoutes);

app.post(
  "/laporan/edit/:id",
  upload.single("foto_barang"),
  editController.saveEditLaporan
);
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
