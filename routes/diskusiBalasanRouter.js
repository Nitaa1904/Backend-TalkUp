const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createBalasan,
  getBalasanByDiskusiId
} = require('../controllers/diskusiBalasanController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

router.post(
  '/',
  verifyToken,
  [
    body('id_diskusi')
      .notEmpty()
      .withMessage('ID diskusi wajib diisi')
      .isInt({ min: 1 })
      .withMessage('ID diskusi harus berupa angka positif'),
    body('isi_balasan')
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Isi balasan wajib diisi'),
    body('is_anonim')
      .optional()
      .isBoolean()
      .withMessage('Is_anonim harus berupa boolean (true/false)')
  ],
  validationMiddleware,
  verifyRole(['guru_bk', 'siswa']),
  createBalasan
  /*
    #swagger.tags = ['Diskusi Balasan']
    #swagger.summary = 'Menambahkan balasan ke diskusi'
    #swagger.description = 'Endpoint untuk menambahkan balasan ke dalam diskusi (hanya Guru BK dan Siswa).'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Data balasan yang akan ditambahkan',
      required: true,
      schema: {
        id_diskusi: 1,
        isi_balasan: 'Ini adalah isi balasan untuk diskusi',
        is_anonim: false
      }
    }
  */
);

router.get(
  '/:diskusiId',
  verifyToken,
  getBalasanByDiskusiId
  /*
    #swagger.tags = ['Diskusi Balasan']
    #swagger.summary = 'Mendapatkan daftar balasan diskusi'
    #swagger.description = 'Endpoint untuk mendapatkan daftar balasan dari sebuah diskusi.'
    #swagger.parameters['diskusiId'] = {
      in: 'path',
      description: 'ID diskusi',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Nomor halaman',
      type: 'integer',
      default: 1
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Jumlah data per halaman (maks 50)',
      type: 'integer',
      default: 25
    }
  */
);

module.exports = router;
