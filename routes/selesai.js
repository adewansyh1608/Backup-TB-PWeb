const express = require('express');
const router = express.Router();
const selesaiController = require('../controllers/selesaiController'); // pastikan path-nya betul

router.get('/selesai-form/:id', selesaiController.showSelesaiForm);
router.post('/laporan/selesai/:id', selesaiController.submitSelesaiForm); // error kemungkinan dari sini

module.exports = router;