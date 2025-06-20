const express = require('express');
const router = express.Router();
const selesaiController = require('../controllers/selesaiController');

router.get('/selesai-form/:id', selesaiController.getSelesaiForm);
router.post('/laporan-selesai/:id', selesaiController.laporanSelesai);

module.exports = router;