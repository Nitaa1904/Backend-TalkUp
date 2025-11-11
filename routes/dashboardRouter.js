const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { dashboardController } = require("../controllers");

router.get(
  "/guru",
  verifyToken,
  verifyRole("guru_bk"),
  /*
  #swagger.tags = ['Dashboard']
  #swagger.summary = 'Get Dashboard Guru BK'
  #swagger.description = 'Endpoint khusus Dashboard Guru BK yang menampilkan ringkasan cepat dari dua kategori data utama: jadwal konseling mendatang dan pengajuan menunggu.'
  #swagger.security = [{ "bearerAuth": [] }]
  */
  dashboardController.getDashboardGuru
);

module.exports = router;