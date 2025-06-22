const db = require("../config/db"); // Pastikan pengimporan db benar

const getUserPost = (req, res) => {
  const statusFilter = req.params.filter || "all";
  const dropdownFilter = req.query.dropdown || null;
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : null;

  const query = `
  SELECT * FROM laporan 
  WHERE status IN ('Waiting for End Verification', 'Done', 'Rejected')
`;


  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    let laporanBaru = results.filter(r => r.status === 'Waiting for End Verification');
    let laporanLama = results.filter(r => r.status !== 'Waiting for End verification');
    let combined = [];

    // 🔍 FILTER BERDASARKAN DROPDOWN
    if (dropdownFilter === "lost") {
      combined = results.filter(r => r.jenis_laporan === "Kehilangan");
    } else if (dropdownFilter === "found") {
      combined = results.filter(r => r.jenis_laporan === "Penemuan");
    } else if (dropdownFilter === "approved") {
      combined = results.filter(r => r.verifikasi_action === "approved");
    } else if (dropdownFilter === "denied") {
      combined = results.filter(r => r.verifikasi_action === "denied");
    } else {
      // Jika tidak ada filter dropdown, gunakan tombol filter utama
      if (statusFilter === "all") {
        combined = [...laporanBaru, ...laporanLama];
      } else if (statusFilter === "unverified") {
        combined = laporanBaru;
      } else if (statusFilter === "verified") {
        combined = laporanLama;
      }
    }

    //  Filter berdasarkan nama barang
    if (searchQuery) {
      combined = combined.filter(r => r.nama_barang.toLowerCase().includes(searchQuery));
    }

    res.render("confirm-done", {
      user: req.session.user,
      laporanGabungan: combined,
      laporanBaru: statusFilter === "all" && !dropdownFilter ? laporanBaru : [],
      laporanLama: statusFilter === "all" && !dropdownFilter ? laporanLama : [],
      activeMenu: "confirm-done",
      activeFilter: statusFilter,
      currentDropdown: dropdownFilter,
      searchQuery: req.query.search || ""
    });
  });
};

const getUnverified = (req, res) => {
  const query = `
    SELECT * FROM laporan 
    WHERE status = 'Waiting for End verification'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching unverified reports:", err);
      return res.status(500).send("Error fetching unverified reports.");
    }

    res.render("confirm-done", {
      user: req.session.user,
      laporanBaru: results,
      laporanLama: [],
      activeMenu: "confirm-done",
      activeFilter: "unverified",
    });
  });
};



const approve = (req, res) => {
  const idLaporan = req.params.id_laporan; 
  console.log("ID laporan yang diproses:", idLaporan);


  const sql = `
    UPDATE laporan 
    SET status = 'Done', verifikasi_action = 'approved' 
    WHERE id_laporan = ?
  `;

  db.query(sql, [idLaporan], (err, result) => { 
    if (err) {
      console.error("Error approving report:", err);
      return res.status(500).send("Gagal menyetujui laporan.");
    }
    res.redirect('/confirm-done');
  });
};


const denied = (req, res) => {
  const idLaporan = req.params.id_laporan; 
  console.log("ID laporan yang diproses:", idLaporan);


  const sql = `
    UPDATE laporan 
    SET status = 'Rejected', verifikasi_action = 'denied' 
    WHERE id_laporan = ?
  `;

  db.query(sql, [idLaporan], (err, result) => { // ✅ ganti id → idLaporan
    if (err) {
      console.error("Error denying report:", err);
      return res.status(500).send("Gagal menolak laporan.");
    }
    res.redirect('/confirm-done');
  });
};


module.exports = { getUserPost, approve, denied, getUnverified };

