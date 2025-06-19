const db = require("../config/db");

// Statistik laporan
const getStatistikLaporan = (req, res) => {
  const userEmail = req.session.user.email;

  db.query(
    `
    SELECT 
      COUNT(*) AS total,
      SUM(status = 'Done') AS selesai,
      SUM(status = 'Upload verification rejected') AS ditolak,
      SUM(status = 'Waiting for upload verification') AS menunggu,
      SUM(status = 'On progress') AS on_progress,
      SUM(status != 'Waiting for upload verification') AS terverifikasi,
      SUM(jenis_laporan = 'Kehilangan') AS kehilangan,
      SUM(jenis_laporan = 'Penemuan') AS penemuan
    FROM laporan
    WHERE email = ?
    `,
    [userEmail],
    (err, results) => {
      if (err) {
        console.error("Gagal ambil statistik:", err);
        return res.status(500).send("Terjadi kesalahan saat mengambil statistik.");
      }

      const data = results[0];

      res.render("statistik-laporan", {
        statistik: data,
        activeMenu: "statistik-laporan",
        user: req.session.user, 
      });
    }
  );
};

// Statistik semua laporan untuk admin
const getStatistikLaporanAdmin = (req, res) => {
  db.query(
    `
    SELECT 
      COUNT(*) AS total,
      SUM(status IN ('Upload verification rejected','On progress','Claimed','Waiting for end verification','End verification rejected','Done')) AS terverifikasi,
      SUM(status = 'Waiting for upload verification') AS menunggu,
      SUM(status = 'Upload verification rejected') AS ditolak,
      SUM(status = 'On progress') AS on_progress,
      SUM(jenis_laporan = 'Kehilangan') AS kehilangan,
      SUM(jenis_laporan = 'Penemuan') AS penemuan,
      SUM(status = 'Done') AS selesai
    FROM laporan
    `,
    (err, results) => {
      if (err) {
        console.error("Gagal ambil statistik admin:", err);
        return res.status(500).send("Terjadi kesalahan saat mengambil data.");
      }

      const data = results[0];
      res.render("statistik-laporanadmin", {
        statistik: data,
        user: req.session.user, // untuk sidebar
        activeMenu: "statistik-admin"
      });
    }
  );
};

module.exports = {
  getStatistikLaporan,
  getStatistikLaporanAdmin,
};