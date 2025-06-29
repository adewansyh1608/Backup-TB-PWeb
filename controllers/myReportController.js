const PDFDocument = require("pdfkit");
const fs = require("fs");
const db = require("../config/db"); // Pastikan pengimporan db benar

const getUserReports = (req, res) => {
  const userEmail = req.session.user.email;
  const { filter, jenis, search } = req.query;

  let query = `SELECT * FROM laporan WHERE email = ?`;
  const params = [userEmail];

  // Filter jenis_laporan (Kehilangan, Penemuan)
  if (jenis === "Kehilangan" || jenis === "Penemuan") {
    query += ` AND jenis_laporan = ?`;
    params.push(jenis);
  }

  // Filter status (On Progress, Claimed, Done)
  if (
    filter === "Waiting for upload verification" ||
    filter === "Upload verification rejected" ||
    filter === "On Progress" ||
    filter === "Claimed" ||
    filter === "Waiting for end verification" ||
    filter === "End verification rejected" ||
    filter === "Done"
  ) {
    query += ` AND status = ?`;
    params.push(filter);
  } else {
    query += ` AND status IN ('Waiting for upload verification', 'Upload verification rejected', 'On Progress', 'Claimed', 'Waiting for end verification' 'End verification rejected', 'Done')`;
  }

  // Pencarian nama_barang
  if (search) {
    query += ` AND nama_barang LIKE ?`;
    params.push(`%${search}%`);
  }

  // Execute the query and pass data to the view
  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).send("Error fetching reports.");
    }

    res.render("my-report", {
      user: req.session.user,
      activeMenu: "my-report",
      reports: results || [],
      searchQuery: search || "",
      activeFilter: filter || "All", // Default filter to "All"
      activeJenis: jenis || "All", // Default jenis to "All"
    });
  });
};

const generateReportPdf = (req, res) => {
  const reportId = req.params.id;

  const sql = `SELECT * FROM laporan WHERE id_laporan = ?`;
  db.query(sql, [reportId], (err, results) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.send("Error fetching report.");
    }

    const report = results[0];

    if (!report) {
      return res.send("Report not found.");
    }

    console.log(report); // Log the fetched data for debugging

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response type to PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="laporan.pdf"');

    doc.pipe(res); // Send PDF to response

    // Header - Logo Universitas
    doc.image("./public/images/unand.png", 30, 30, { width: 50 });

    // Title - Rektorat Universitas Andalas (bold)
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Rektorat Universitas Andalas", { align: "center" });
    doc
      .fontSize(14)
      .font("Helvetica")
      .text("Laporan Penemuan / Kehilangan Barang Hilang", { align: "center" });
    doc.moveDown(2);

    // Nama Barang (bold)
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`${report.nama_barang || "-"}`, {
        align: "center",
      });
    doc.moveDown(1);

    // Gambar Barang (jika ada)
    if (report.foto_barang) {
      const imagePath = `public/${report.foto_barang}`;
      if (fs.existsSync(imagePath)) {
        doc.image(imagePath, { fit: [250, 250], align: "center" });
        doc.moveDown(2); // Space after image
      } else {
        doc.text("Gambar tidak tersedia.", { align: "center" });
        doc.moveDown(2); // Space after text
      }
    }

    // **Informasi Laporan**
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Informasi Laporan:", { underline: true });
    doc.moveDown();
    doc
      .font("Helvetica")
      .text(`Jenis Laporan: ${report.jenis_laporan || "-"}`)
      .text(`Status: ${report.status || "-"}`)
      .text(`Lokasi: ${report.lokasi || "-"}`)
      .text(`Tanggal Kejadian: ${report.tanggal_kejadian || "-"}`)
      .text(`Tanggal Laporan: ${report.tanggal_laporan || "-"}`)
      .text(`Deskripsi: ${report.deskripsi || "-"}`)
      .text(`Lokasi Penyerahan: ${report.lokasi_penyerahan || "-"}`)
      .text(`Tanggal Penyerahan: ${report.tanggal_penyerahan || "-"}`)
      .text(`Foto Bukti Penyerahan: ${report.foto_bukti || "-"}`);
    doc.moveDown(2); // Space after Informasi Laporan

    // **Informasi Pelapor**
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Informasi Pelapor:", { underline: true });
    doc.moveDown();
    doc
      .font("Helvetica")
      .text(`Nama Pelapor: ${report.nama_penemu_penerima || "-"}`)
      .text(`Email Pelapor: ${report.email_pelapor || "-"}`)
      .text(`No Telepon Pelapor: ${report.nohp_penemu_penerima || "-"}`)
      .text(`Alamat Pelapor: ${report.alamat_pelapor || "-"}`);
    doc.moveDown(2); // Space after Informasi Pelapor

    // **Informasi Penemu/Penerima**
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Informasi Penemu/Penerima:", { underline: true });
    doc.moveDown();
    doc
      .font("Helvetica")
      .text(`Nama: ${report.nama_penemu_penerima || "-"}`)
      .text(`No Telepon Penemu: ${report.nohp_penemu_penerima || "-"}`);
    doc.moveDown(2); // Space after Informasi Penemu/Penerima

    // Footer
    doc
      .font("Helvetica")
      .fontSize(8)
      .text("Laporan dibuat oleh Rektorat Universitas Andalas.", {
        align: "center",
      });

    doc.end(); // Finish PDF creation
  });
};

// Function to handle "Ajukan Ulang" action and update status and verifikasi_action
const ajukanUlang = (req, res) => {
  const reportId = req.params.id;

  // SQL query to update the status and verifikasi_action
  const sql = `
    UPDATE laporan
    SET status = 'Waiting for upload verification', verifikasi_action = 'approve'
    WHERE id_laporan = ?
  `;

  // Execute the query to update the report status
  db.query(sql, [reportId], (err, result) => {
    if (err) {
      console.error("Error updating report status:", err);
      return res.status(500).send("Error updating the report status.");
    }

    // After successfully updating, redirect back to the report list
    res.redirect("/my-report");
  });
};

const getReportDetail = (req, res) => {
  const reportId = req.params.id;

  const sql = `SELECT * FROM laporan WHERE id_laporan = ?`;
  db.query(sql, [reportId], (err, results) => {
    if (err) {
      console.error("Error fetching report details:", err);
      return res.status(500).send("Error fetching report details.");
    }

    const report = results[0];

    if (!report) {
      return res.render("detail-laporansaya", {
        report: null,
      });
    }

    res.render("detail-laporansaya", {
      report: report,
    });
  });
};

const getClaimerContact = (req, res) => {
  const reportId = req.params.id;

  const query = `
    SELECT p.nama, p.email, p.no_telepon, p.alamat
    FROM claim c
    JOIN pengguna p ON c.email = p.email
    WHERE c.id_laporan = ?
  `;

  db.query(query, [reportId], (err, results) => {
    if (err) {
      console.error("Error fetching claimer contact:", err);
      return res.status(500).send("Error retrieving claimer data.");
    }

    if (results.length === 0) {
      return res.status(404).send("Claimer not found.");
    }

    res.render("kontak-claimer", {
      claimer: results[0],
    });
  });
};

module.exports = {
  getUserReports,
  generateReportPdf,
  ajukanUlang,
  getReportDetail,
  getClaimerContact,
};
