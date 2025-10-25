const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const guruBkController = require("../controllers/guruBkController");

router.get(
  "/siswa",
  verifyToken,
  verifyRole("guru_bk"),
  /* 
  #swagger.tags = ['Guru BK']
  #swagger.summary = 'Ambil semua siswa bimbingan'
  #swagger.description = 'Endpoint untuk menampilkan seluruh siswa yang berada di bawah bimbingan Guru BK terkait.'
  #swagger.security = [{ "bearerAuth": [] }]
  */
  guruBkController.getSiswaBimbingan
);

router.get(
  "/siswa/:id",
  verifyToken,
  verifyRole("guru_bk"),
  /* 
  #swagger.tags = ['Guru BK']
  #swagger.summary = 'Ambil data siswa bimbingan berdasarkan ID'
  #swagger.description = 'Endpoint untuk menampilkan data detail siswa bimbingan berdasarkan ID siswa.'
  #swagger.parameters['id'] = { description: 'ID Siswa', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  */
  guruBkController.getSiswaBimbinganById
);

module.exports = router;
