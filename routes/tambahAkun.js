const express = require('express');
const router = express.Router();
const tambahAkunController = require('../controllers/tambahAkunController');

router.get('/', tambahAkunController.formTambah);
router.post('/', tambahAkunController.tambahAkun);

module.exports = router;