const PDFDocument = require("pdfkit");
const fs = require("fs");
const db = require("../config/db"); // Pastikan pengimporan db benar

const getUserReports = (req, res) => {
  const userEmail = req.session.user.email;

  const sql = `SELECT * FROM laporan WHERE email = ?`;

  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.send("Error fetching reports.");
    }

    // Menggunakan layout dengan title dan activeMenu
    res.render("my-report", {
      user: req.session.user,
      reports: results,
      activeMenu: "my-report", // Pastikan menu aktif di sidebar
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

    // Judul Barang (bold)
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Nama Barang: ${report.nama_barang}`, { align: "center" });
    doc.moveDown(2);

    // Gambar Barang (jika ada)
    if (report.foto_barang) {
      const imagePath = `public/${report.foto_barang}`;
      if (fs.existsSync(imagePath)) {
        // Ensure image is centered and fits the page width
        doc.image(imagePath, { fit: [500, 500], align: "center" });
        doc.moveDown(2); // Space after image
      } else {
        doc.text("Gambar tidak tersedia.", { align: "center" });
        doc.moveDown(2); // Space after text
      }
    }

    // **Informasi Laporan**
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("Informasi Laporan", { underline: true });
    doc.moveDown();
    doc.font("Helvetica").text(`Jenis Laporan: ${report.jenis_laporan}`);
    doc.font("Helvetica").text(`Status: ${report.status}`);
    doc.font("Helvetica").text(`Lokasi: ${report.lokasi}`);
    doc.font("Helvetica").text(`Tanggal Kejadian: ${report.tanggal_kejadian}`);
    doc.font("Helvetica").text(`Tanggal Laporan: ${report.tanggal_laporan}`);
    doc.font("Helvetica").text(`Deskripsi: ${report.deskripsi}`);
    doc
      .font("Helvetica")
      .text(`Lokasi Penyerahan: ${report.lokasi_penyerahan}`);
    doc
      .font("Helvetica")
      .text(`Tanggal Penyerahan: ${report.tanggal_penyerahan}`);
    doc.font("Helvetica").text(`Foto Bukti Penyerahan: ${report.foto_bukti}`);
    doc.moveDown(2); // Space after details

    // **Informasi Pelapor**
    doc.fontSize(12).text("Informasi Pelapor", { underline: true });
    doc.moveDown();
    doc.font("Helvetica").text(`Nama Pelapor: ${report.nama_penemu_penerima}`);
    doc.font("Helvetica").text(`Email Pelapor: ${report.email_pelapor}`);
    doc
      .font("Helvetica")
      .text(`No Telepon Pelapor: ${report.nohp_penemu_penerima}`);
    doc.font("Helvetica").text(`Alamat Pelapor: ${report.alamat_pelapor}`);
    doc.moveDown(2); // Space after pelapor info

    // **Informasi Penemu/Penerima**
    doc.fontSize(12).text("Informasi Penemu/Penerima", { underline: true });
    doc.moveDown();
    doc.font("Helvetica").text(`Nama: ${report.nama_penemu_penerima}`);
    doc
      .font("Helvetica")
      .text(`No Telepon Penemu: ${report.nohp_penemu_penerima}`);
    doc.moveDown(2); // Space after penerima info

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

module.exports = { getUserReports, generateReportPdf };
