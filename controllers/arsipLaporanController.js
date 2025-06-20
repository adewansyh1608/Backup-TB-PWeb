const db = require('../config/db');

const getArsipLaporan = (req, res) => {
  const filter = req.query.filter || 'All';
  const search = req.query.search || '';

  let sql = `
    SELECT laporan.id_laporan, laporan.email, pengguna.nama, laporan.jenis_laporan, laporan.nama_barang, laporan.tanggal_laporan, laporan.status
    FROM laporan
    JOIN pengguna ON laporan.email = pengguna.email
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    sql += ` AND (laporan.nama_barang LIKE ? OR laporan.email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (filter !== 'All') {
    sql += ` AND laporan.jenis_laporan = ?`;
    params.push(filter);
  }

  sql += ` ORDER BY laporan.tanggal_laporan DESC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching arsip laporan:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.render('arsip-laporan', {
      laporan: results,
      selectedFilter: filter,
      searchQuery: search,
      user: req.session.user,
      activeMenu: 'arsip-laporan'
    });
  });
};

module.exports = {
  getArsipLaporan
};
