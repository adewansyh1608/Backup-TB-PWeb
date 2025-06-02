require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const laporanRoutes = require("./routes/laporan");
const dashboardRoutes = require("./routes/dashboard");
const myReportRoutes = require("./routes/myReport");

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

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
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
