const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  createDiskusi,
  getAllDiskusi,
  getDiskusiById,
} = require("../controllers/diskusiController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

router.post(
  "/",
  verifyToken,
  verifyRole(["guru_bk", "siswa"]),
  [
    body("judul")
      .notEmpty()
      .withMessage("Judul wajib diisi")
      .isLength({ max: 255 })
      .withMessage("Judul maksimal 255 karakter"),
    body("konten")
      .notEmpty()
      .withMessage("Konten wajib diisi")
      .isLength({ min: 10 })
      .withMessage("Konten minimal 10 karakter"),
    body("is_anonim")
      .optional()
      .isBoolean()
      .withMessage("Is_anonim harus berupa boolean (true/false)")
  ],
  validationMiddleware,
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
        judul: 'Fokus Belajar',
        konten: 'Bagaimana cara fokus saat ujian?',
        is_anonim: false
      }
    }
  */
);

router.get(
  "/",
  verifyToken,
  verifyRole(["guru_bk", "siswa", "super_admin"]),
  getAllDiskusi
  /*
    #swagger.tags = ['Diskusi']
    #swagger.summary = 'List semua diskusi dengan filter dan pencarian'
    #swagger.description = 'Endpoint untuk mendapatkan daftar semua diskusi dengan dukungan filter dan pencarian.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['page'] = { in: 'query', required: false, type: 'number', default: 1, description: 'Nomor halaman yang ingin ditampilkan. Default: 1' }
    #swagger.parameters['limit'] = { in: 'query', required: false, type: 'number', default: 25, description: 'Limit untuk pagination. Jika tidak ada limit, maka akan menampilkan data sebanyak 25' }
    #swagger.parameters['search'] = { in: 'query', required: false, type: 'string', description: 'Kata kunci untuk mencari diskusi berdasarkan judul atau konten' }
    #swagger.parameters['filter'] = { in: 'query', required: false, type: 'string', enum: ['semua', 'terpopuler', 'terbaru'], default: 'semua', description: 'Filter untuk mengurutkan diskusi: semua (default), terpopuler (berdasarkan jumlah balasan), terbaru (berdasarkan tanggal pembuatan)' }
  */
);

router.get(
  "/:id",
  verifyToken,
  verifyRole(["guru_bk", "siswa", "super_admin"]),
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

