const express = require("express");
const router = express.Router();
const {
  createDiskusi,
  getAllDiskusi,
  getDiskusiById,
} = require("../controllers/diskusiController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

router.post(
  "/",
  verifyToken,
  verifyRole(["guru_bk", "siswa"]),
  createDiskusi
  /*
    #swagger.tags = ['Diskusi']
    #swagger.summary = 'Membuat diskusi baru'
    #swagger.description = 'Endpoint untuk membuat diskusi baru (hanya Guru BK dan Siswa).'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Data diskusi yang akan dibuat',
      required: true,
      schema: {
        topik: 'Fokus Belajar',
        isi_diskusi: 'Bagaimana cara fokus saat ujian?',
        is_anonim: false
      }
    }
  */
);

router.get(
  "/",
  verifyToken,
  getAllDiskusi
  /*
    #swagger.tags = ['Diskusi']
    #swagger.summary = 'List semua diskusi'
    #swagger.description = 'Endpoint untuk mendapatkan daftar semua diskusi.'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.get(
  "/:id",
  verifyToken,
  getDiskusiById
  /*
    #swagger.tags = ['Diskusi']
    #swagger.summary = 'Detail diskusi by id'
    #swagger.description = 'Endpoint untuk mendapatkan detail diskusi berdasarkan ID.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
  */
);

module.exports = router;
