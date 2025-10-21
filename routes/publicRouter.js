const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

/**
 * @swagger
 * /api/v1/public/guru-bk:
 *   get:
 *     tags: ['Public']
 *     summary: Ambil semua data Guru BK untuk beranda publik
 *     description: Endpoint publik untuk mengambil nama dan jabatan Guru BK tanpa autentikasi.
 *     responses:
 *       200:
 *         description: Berhasil mengambil data Guru BK
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/guru-bk", publicController.getAllGuruBk);

module.exports = router;
