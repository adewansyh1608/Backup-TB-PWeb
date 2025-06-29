
const db = require("../config/db");

const getUserPost = (req, res) => {
  const statusFilter = req.params.filter || "all";
  const dropdownFilter = req.query.dropdown || null;
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : null;

  const query = `
    SELECT * FROM laporan 
    WHERE status IN ('Waiting for end verification', 'Done', 'End verification rejected')
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    let combined = results;

  
    if (dropdownFilter === "lost") {
      combined = results.filter((r) => r.jenis_laporan === "Kehilangan");
    } else if (dropdownFilter === "found") {
      combined = results.filter((r) => r.jenis_laporan === "Penemuan");
    } else if (dropdownFilter === "approved") {
      combined = results.filter((r) => r.verifikasi_action === "approved");
    } else if (dropdownFilter === "denied") {
      combined = results.filter((r) => r.verifikasi_action === "denied");
    }

   
    if (searchQuery) {
      combined = combined.filter((r) =>
        r.nama_penyerah.toLowerCase().includes(searchQuery)
      );
    }

    res.render("confirm-done", {
      user: req.session.user,
      laporanGabungan: combined,
      activeMenu: "confirm-done",
      activeFilter: statusFilter,
      currentDropdown: dropdownFilter,
      searchQuery: req.query.search || "",
    });
  });
};

const approve = (req, res) => {
  const idLaporan = req.params.id_laporan;
  const redirectUrl = req.body.redirect || "/confirm-done";

  const sql = `
    UPDATE laporan 
    SET status = 'Done',
        verifikasi_action = 'approved'
    WHERE id_laporan = ?
  `;

  db.query(sql, [idLaporan], (err, result) => {
    if (err) {
      console.error("Error approving report:", err);
      return res.status(500).send("Gagal menyetujui laporan.");
    }
    return res.redirect(redirectUrl);
  });
};

const denied = (req, res) => {
  const idLaporan = req.params.id_laporan;
  const redirectUrl = req.body.redirect || "/confirm-done";

  const sql = `
    UPDATE laporan 
    SET status = 'End verification rejected',
        verifikasi_action = 'denied'
    WHERE id_laporan = ?
  `;

  db.query(sql, [idLaporan], (err, result) => {
    if (err) {
      console.error("Error denying report:", err);
      return res.status(500).send("Gagal menolak laporan.");
    }
    return res.redirect(redirectUrl);
  });
};

module.exports = { getUserPost, approve, denied };
