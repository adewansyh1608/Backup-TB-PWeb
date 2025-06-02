function validateLaporanType(req, res, next) {
  const { jenis_laporan } = req.body;

  if (jenis_laporan !== "Penemuan" && jenis_laporan !== "Kehilangan") {
    return res.status(400).send("Jenis Laporan tidak valid.");
  }
  next();
}

module.exports = validateLaporanType;
