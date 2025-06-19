const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

// POST: proses klaim laporan
router.post('/claim/:id', claimController.claimReport);

// GET: halaman laporan yang saya klaim
router.get('/my-claimed-report', claimController.getClaimedReports);

module.exports = router;
