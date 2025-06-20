const express = require('express');
const router = express.Router();
const arsipLaporanController = require('../controllers/arsipLaporanController');

router.get('/arsip-laporan', arsipLaporanController.getArsipLaporan);

module.exports = router;
