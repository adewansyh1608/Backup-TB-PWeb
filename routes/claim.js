const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const laporanController = require('../controllers/laporanController');

// POST: proses klaim laporan
router.post('/claim/:id', claimController.claimReport);

// GET: halaman laporan yang saya klaim
router.get('/my-claimed-report', claimController.getClaimedReports);

// POST: batalkan klaim laporan
router.post('/unclaim/:id', laporanController.unclaimReport);

module.exports = router;